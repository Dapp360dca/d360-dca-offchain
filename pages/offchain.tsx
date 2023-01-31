import type { NextPage } from "next";
import Head from "next/head";
import WalletConnect from "../components/WalletConnect";
import { useStoreActions, useStoreState } from "../utils/store";
import Link from "next/link";
import { useState, useEffect } from "react";
// import { getAssets } from "../utils/cardano";
import initLucid from "../utils/lucid";
import {
  Lucid,
  TxHash,
  Lovelace,
  Constr,
  SpendingValidator,
  Data,
  PlutusData,
  Address,
  utf8ToHex,
  OutRef,
  datumJsonToCbor,
} from "lucid-cardano";
import {
  LiquidityPoolDatum,
  RequestDatum,
  RequestMetadaDatum,
  SwapAction,
  SwapDirection,
  AssetClass,
} from "@wingriders/dex-serializer";
import * as mlb from "@dcspark/cardano-multiplatform-lib-browser";

const alwaysSucceedCbor = "49480100002221200101";
const dummyDCAcbor =
  "5907ac5907a901000032323232323232323232323232323322323232323222323223232533532323201d3333573466e1cd55cea80224000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4064068d5d0a80619a80c80d1aba1500b33501901b35742a014666aa03aeb94070d5d0a804999aa80ebae501c35742a01066a0320486ae85401cccd54074095d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40bdd69aba150023030357426ae8940088c98c80c8cd5ce01a01901809aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a817bad35742a00460606ae84d5d1280111931901919ab9c034032030135573ca00226ea8004d5d09aba2500223263202e33573806005c05826aae7940044dd50009aba1500533501975c6ae854010ccd540740848004d5d0a801999aa80ebae200135742a00460466ae84d5d1280111931901519ab9c02c02a028135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00860266ae84d5d1280211931900e19ab9c01e01c01a3333573466e1d40152002212200123333573466e1d4019200023212230020033014357426aae7940208c98c8070cd5ce00f00e00d00c9bad007101913263201933573892010350543500019135573ca00226ea80044d55cea80089baa0011232230023758002640026aa02a446666aae7c004940288cd4024c010d5d080118019aba2002014232323333573466e1cd55cea8012400046644246600200600460186ae854008c014d5d09aba2500223263201433573802c02802426aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea80124000466442466002006004602a6ae854008cd403c050d5d09aba2500223263201933573803603202e26aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931900d99ab9c01d01b019018017135573aa00226ea8004d5d0a80119a805bae357426ae8940088c98c8054cd5ce00b80a80989aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5404888c8cccd55cf80112804119a8039991091980080180118031aab9d5002300535573ca00460086ae8800c0484d5d080088910010910911980080200189119191999ab9a3370ea0029000119091180100198029aba135573ca00646666ae68cdc3a801240044244002464c6402066ae700480400380344d55cea80089baa001232323333573466e1d400520062321222230040053007357426aae79400c8cccd5cd19b875002480108c848888c008014c024d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6402066ae7004804003803403002c4d55cea80089baa001232323333573466e1cd55cea80124000466442466002006004600a6ae854008dd69aba135744a004464c6401866ae700380300284d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e500223263200a33573801801401026ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263201333573802a02602202001e01c01a01801626aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931900619ab9c00e00c00a009135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c8024cd5ce00580480380309aab9d50011375400224464646666ae68cdc3a800a40084244400246666ae68cdc3a8012400446424446006008600c6ae84d55cf280211999ab9a3370ea00690001091100111931900519ab9c00c00a008007006135573aa00226ea80048c8cccd5cd19b8750014800880188cccd5cd19b8750024800084880048c98c8018cd5ce00400300200189aab9d3754002930900089100124810350543100112323001001223300330020020011";
const dcaScript: SpendingValidator = {
  type: "PlutusV2",
  script: dummyDCAcbor,
};

const Offchain: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [nftList, setNftList] = useState([]);
  const [lucid, setLucid] = useState<Lucid>();
  const [script, setScript] = useState<SpendingValidator>();
  const [scriptAddress, setScriptAddress] = useState("");

  // helper functions

  function keyAddressWithKeyStakeToData(address: Address): PlutusData {
    const { paymentCredential, stakeCredential } =
      lucid!.utils.getAddressDetails(address);
    return new Constr(0, [
      new Constr(0, [paymentCredential?.hash!]),
      new Constr(0, [new Constr(0, [new Constr(0, [stakeCredential?.hash!])])]),
    ]);
  }

  const openDCA = async () => {
    if (lucid) {
      const dcaScriptAddress: Address =
        lucid.utils.validatorToAddress(dcaScript);
      const ownerAddress = await lucid.wallet.address();
      console.log("ownerAddress: " + ownerAddress);

      /*
      data DcaDetails = DcaDetails { 
                    owner       :: PlutusV2.Address
                ,   fromAsset   :: PlutusV2.AssetClass
                ,   toAsset     :: PlutusV2.AssetClass
                ,   ammount     :: Integer
                ,   nextSwap    :: PlutusV2.POSIXTime
                ,   period      :: Integer
                }
      */
      const dOwner = keyAddressWithKeyStakeToData(ownerAddress); // Owner of the DCA is the owner of the Wallet
      const dFromAsset = new Constr(0, [""]); // Swap from tADA
      const dToAsset = new Constr(0, [
        "47e9faf04ae9f5c3bcde980c84e332b84feebc9fa2870cff07239bbe575254",
      ]); // Swap to tWRT
      const dAmmount = BigInt(50_000000); // Swap 50 Ada every time
      const dNextSwap = new Constr(0, [BigInt(Date.now())]); // Starting from now
      const dPeriod = BigInt(3600000); // Period of swaps - 1 hour
      const dcaDatum = new Constr(0, [
        dOwner,
        dFromAsset,
        dToAsset,
        dAmmount,
        dNextSwap,
        dPeriod,
      ]);

      const tx = await lucid
        .newTx()
        .payToContract(
          dcaScriptAddress,
          { inline: Data.to(dcaDatum) },
          { lovelace: BigInt(7_770000) }
        )
        //.payToContract(dcaScriptAddress,{inline: Data.to(dcaDatum)}, {lovelace: BigInt(11_000000)})
        //.payToContract(dcaScriptAddress, Data.to(dcaDatum), {lovelace: BigInt(10_000000)})
        .complete();
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
    }
  };

  const swapDCA = async () => {
    if (lucid) {
      const dcaScriptAddress: Address =
        lucid.utils.validatorToAddress(dcaScript);
      console.log("dcaScriptAddress: " + dcaScriptAddress);
      const dcaScriptUtxos = (await lucid.utxosAt(dcaScriptAddress)).filter(
        (utxo) => Boolean(utxo.datum)
      );
      if (!dcaScriptUtxos[0])
        throw new Error("UTxOs with Datum not found at the script");
      console.log("DCA UTxOs:");
      console.log(dcaScriptUtxos);
      console.log(Data.from(dcaScriptUtxos[0].datum!));

      const walletAddress = await lucid.wallet.address();
      const walletUtxos = await lucid.utxosAt(walletAddress);

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
          "659ab0b5658687c2e74cd10dba8244015b713bf503b90557769d77a7",
          "57696e67526964657273"
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
    }
  };

  async function closeDCA(): Promise<TxHash> {
    //    outRef: OutRef,
    //const utxos = await lucid?.utxosByOutRef([outRef]);
    const dcaScriptAddress: Address =
      lucid!.utils.validatorToAddress(dcaScript);
    const utxos = (await lucid!.utxosAt(dcaScriptAddress)).filter((utxo) =>
      Boolean(utxo.datum)
    );
    const tx = await lucid!
      .newTx()
      .collectFrom(utxos!, Data.empty())
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    return txHash;
  }

  const Datum = () => Data.empty();

  async function HarvestDCA(): Promise<TxHash> { 
    const dcaScriptAddress: Address =
      lucid!.utils.validatorToAddress(dcaScript);
    const utxos = (await lucid!.utxosAt(dcaScriptAddress)).filter((utxo) => 
      utxo.datum === Data.empty()) 
    const tx = await lucid!
      .newTx()
      .collectFrom(utxos!, Data.empty())
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    return txHash;
  }


  return (
    <div className="px-10">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Cardano
          </Link>
        </div>
        <div className="flex-none">
          <WalletConnect />
        </div>
      </div>
      <div>Address: {walletStore.address}</div>
      <div className="m-10">
        <p>DCA example</p>
      </div>
      <div className="mx-40 my-10">
        <button
          className="btn btn-primary m-5"
          onClick={() => {
            openDCA();
          }}
        >
          Open DCA
        </button>
        <button
          className="btn btn-secondary m-5"
          onClick={() => {
            swapDCA();
          }}
        >
          Close DCA
        </button>
        <button
          className="btn btn-primary m-5"
          onClick={() => {
            closeDCA();
          }}
        >
         Harvest DCA
        </button>
        <button
          className="btn btn-primary m-5"
          onClick={() => {
            HarvestDCA();
          }}
        >
          Swap from Script
        </button>
      </div>
      <div>
        {" "}
        SWAP
        <p>FromAsset: {"tADA"}</p>
        <p>ToAsset: {"tWRT"}</p>
      </div>
    </div>
  );
};

export default Offchain;
export { dcaScript };
