import { Constr, Data, Lucid } from "lucid-cardano";
import { useEffect, useState } from "react";
import { dcaScript } from "../pages/offchain";
import initLucid from "../utils/lucid";
import { useStoreState } from "../utils/store";
import {
  RequestDatum,
  RequestMetadaDatum,
  SwapAction,
  SwapDirection,
  AssetClass,
} from "@wingriders/dex-serializer";
import mlb from "@dcspark/cardano-multiplatform-lib-browser";

const AccountCard = (props: any) => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [lucid, setLucid] = useState<Lucid>();
  const [txHash, setTxHash] = useState<string>();

  useEffect(() => {
    if (walletStore.connected && !lucid) {
      initLucid(walletStore.name).then((Lucid: Lucid) => {
        setLucid(Lucid);
      });
    }
  }, [lucid]);

  /*********************************************** Endpoints ***********************************************/
  const swapDCA = async () => {
    if (lucid) {
      const dcaScriptAddress = lucid.utils.validatorToAddress(dcaScript);
      const dcaScriptUtxos = (await lucid.utxosAt(dcaScriptAddress)).filter(
        (utxo) =>
          utxo.txHash === props.meta.txHash &&
          utxo.outputIndex === props.meta.txIdx
      );
      if (!dcaScriptUtxos[0]) throw new Error("UTxOs not found at the script");
      // console.log("DCA UTxOs:");
      // console.log(dcaScriptUtxos);
      // console.log(Data.from(dcaScriptUtxos[0].datum!));

      // const walletAddress = await lucid.wallet.address();
      // const walletUtxos = await lucid.utxosAt(walletAddress);

      const wingridersDexAddress =
        "addr_test1wz6zjuut6mx93dw8jvksqx4zh5zul6j8qg992myvw575gdsgwxjuc"; //Preprod

      const txExpiry = Date.now() + 3600000; // In 1 hour
      const metadata = new RequestMetadaDatum(
        mlb.Address.from_bech32(
          // beneficiary address - taken from dcaScript Datum Params
          "addr_test1qq4r29krkplvwplyu2vuaaus2qxtrt9jsdtvhzp4zsfu7x29gfn2fhyzsglz9f4r6jg8w477rqurmc4p6g735znrs3hstu0frs"
        ),
        mlb.StakeCredential.from_keyhash(
          mlb.Ed25519KeyHash.from_hex(
            "2a3516c3b07ec707e4e299cef790500cb1acb28356cb88351413cf19"
          ) // Someone's staking key???
        ),
        mlb.BigInt.from_str(txExpiry.toString()), // Deadline - usually 24 hrs -> Date.now() + 86_400_000
        AssetClass.from_hex("", ""),
        AssetClass.from_hex(
          "f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e3",
          "74575254"
        ) // tWRT on Preprod
      );
      const swapAction = new SwapAction(
        SwapDirection.ATOB,
        mlb.BigInt.from_str("6000000")
      ); // Minimum received
      // Minimum received is calculated from dcaDetails{dSwapAmmount} and slippage
      const requestDatum = new RequestDatum(metadata, swapAction);
      const requestDatumHex = Buffer.from(
        requestDatum.to_plutus_data().to_bytes()
      ).toString("hex"); // Should be an easier way?

      const txOutId = dcaScriptUtxos[0].txHash;
      const txOutIdx = dcaScriptUtxos[0].outputIndex;
      const txOutRefParam = new Constr(0, [
        new Constr(0, [txOutId]),
        BigInt(txOutIdx),
      ]);
      const dcaRedeemerSwap = new Constr(1, []);
      const dcaRedeemerClose = new Constr(0, [
        // CloseDCA TxOutRef
        new Constr(0, [
          // TxOutRef
          new Constr(0, [""]), // BuiltinByteString
          BigInt(0), // txOutRefIdx
        ]),
      ]);
      /*
      data TxOutRef = TxOutRef {
        txOutRefId  :: TxId,
        txOutRefIdx :: Integer -- ^ Index into the referenced transaction's outputs
        }
        */
      const tx = await lucid
        .newTx()
        .payToContract(wingridersDexAddress, requestDatumHex, {
          lovelace: BigInt(9_000000),
        })
        .collectFrom([dcaScriptUtxos[0]], Data.to(dcaRedeemerClose))
        //.collectFrom([dcaScriptUtxos[0]], Data.empty())
        .attachSpendingValidator(dcaScript)
        .complete();
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      setTxHash(txHash);
      return txHash;
    }
  };

  /*************************************************** UI ***************************************************/
  // Card title
  const assetPair = `${props.meta.fromAsset} - ${props.meta.toAsset}`;

  // Card details
  const dcaAmount = `${Math.floor(
    props.meta.fromAsset.endsWith("ADA")
      ? props.meta.dcaAmount / 1000000
      : props.meta.dcaAmount
  )} ${props.meta.fromAsset}`;

  const s = props.meta.period / 1000;
  const m = s / 60;
  const h = m / 60;
  const d = h / 24;
  const sec = Math.floor(s) % 60 === 0 ? "" : ` ${s} sec`;
  const min = Math.floor(m) % 60 === 0 ? "" : ` ${m} min`;
  const hr = Math.floor(h) % 24 === 0 ? "" : ` ${h} hour(s)`;
  const day = Math.floor(d) === 0 ? "" : ` ${d} days`;
  // const period = `Period:${day}${hr}${min}${sec}`;
  // const nextSwap = `Next swap: ${new Date(parseInt(props.meta.nextSwap))}`;
  const cardDetails = (
    <table>
      <tbody>
        <tr style={{ backgroundColor: "#EEEEEE" }}>
          <td valign="top">{`Current ${props.meta.fromAsset}`}</td>
          <td>{props.meta.fromAmount / 1000000}</td>
        </tr>
        <tr>
          <td valign="top">{`Current ${props.meta.toAsset}`}</td>
          <td>{props.meta.toAmount}</td>
        </tr>
        <tr style={{ backgroundColor: "#EEEEEE" }}>
          <td valign="top">{"DCA amount"}</td>
          <td>{dcaAmount}</td>
        </tr>
        <tr>
          <td valign="top">{"Swap frequency"}</td>
          <td>{`${day}${hr}${min}${sec}`}</td>
        </tr>
        <tr style={{ backgroundColor: "#EEEEEE" }}>
          <td valign="top">{"Next swap"}</td>
          <td>{`${new Date(parseInt(props.meta.nextSwap))}`}</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="card bg-[#F8F8FF] text-black shadow-xl p-0 m-6 ">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{assetPair}</h2>

        <div className="card-detail">{cardDetails}</div>

        <div className="card-actions">
          {props.swap && (
            <button
              className="btn btn-primary m-50"
              onClick={() => {
                console.log(`Swap:${props.meta.txHash}#${props.meta.txIdx}`);
              }}
            >
              Swap
            </button>
          )}

          {props.harvest && (
            <button
              className="btn m-50"
              onClick={() => {
                console.log(`Harvest:${props.meta.txHash}#${props.meta.txIdx}`);
              }}
            >
              Harvest
            </button>
          )}

          {props.close && (
            <button
              className="btn btn-primary m-50"
              onClick={() => {
                console.log(`Close:${props.meta.txHash}#${props.meta.txIdx}`);
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
