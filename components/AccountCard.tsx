import { Lucid } from "lucid-cardano";
import { useEffect, useState } from "react";
import initLucid from "../utils/lucid";
import { useStoreState } from "../utils/store";
import * as sc from "../utils/endpoints";

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

  const doSwap = async () => {
    if (lucid) {
      const stakingKey = props.meta.stakeKey;
      const fromAddress = props.meta.address;
      const toAsset = props.meta.toAsset;
      const dcaAmount = props.meta.dcaAmount;
      const collectFromUTxO = props.meta.utxo;

      const txResult = await sc.swapDCA(
        lucid,
        stakingKey,
        fromAddress,
        toAsset,
        dcaAmount,
        collectFromUTxO
      );
      setTxHash(txResult);
    }
  };

  // TODO: doHarvest()
  const doHarvest = async () => {
    console.log(`Harvest:${props.meta.txHash}#${props.meta.txIdx}`);
  };

  // TODO: doClose()
  const doClose = async () => {
    console.log(`Close:${props.meta.txHash}#${props.meta.txIdx}`);
  };

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
        {props.swap && (
          <tr>
            <td valign="top">Wallet address</td>
            <td>{`${props.meta.address.substring(
              0,
              10
            )}...${props.meta.address.substring(
              props.meta.address.length - 4
            )}`}</td>
          </tr>
        )}
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
            <button className="btn btn-primary m-50" onClick={doSwap}>
              Swap
            </button>
          )}

          {props.harvest && (
            <button className="btn m-50" onClick={doHarvest}>
              Harvest
            </button>
          )}

          {props.close && (
            <button className="btn btn-primary m-50" onClick={doClose}>
              Close
            </button>
          )}
        </div>

        {txHash && <div>{txHash}</div>}
      </div>
    </div>
  );
};

export default AccountCard;
