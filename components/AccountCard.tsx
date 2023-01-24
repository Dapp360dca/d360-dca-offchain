import { useEffect } from "react";
import { useState } from "react";
import { useStoreActions, useStoreState } from "../utils/store";

const AccountCard = (props: any) => {
  // useEffect(() => console.log(props), [props]);

  // Card title
  const assetPair = `${props.meta.fromAsset} - ${props.meta.toAsset}`;

  // Card details
  const currentAssetFrom = `Current ${props.meta.fromAsset}: 100`;
  const currentAssetTo = `Current ${props.meta.toAsset}: 0`;
  const period = `Period: ${props.meta.period}`;
  const nextSwap = `Next swap: ${props.meta.nextSwap}`;
  const cardDetails = (
    <>
      {currentAssetFrom}
      <br />
      {currentAssetTo}
      <br />
      {period}
      <br />
      {nextSwap}
      <br />
    </>
  );

  return (
    <div className="card bg-[#F8F8FF] text-black shadow-xl p-0 m-6 ">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{assetPair}</h2>

        <div className="card-detail">{cardDetails}</div>

        <div className="card-actions">
          <button className="btn m-50" onClick={() => {}}>
            Harvest
          </button>

          <button className="btn btn-primary m-50" onClick={() => {}}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
