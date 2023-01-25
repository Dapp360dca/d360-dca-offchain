const AccountCard = (props: any) => {
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
      <tr style={{ backgroundColor: "#EEEEEE" }}>
        <td valign="top">{`Current ${props.meta.fromAsset}`}</td>
        <td valign="top">{props.meta.fromAmount / 1000000}</td>
      </tr>
      <tr>
        <td valign="top">{`Current ${props.meta.toAsset}`}</td>
        <td valign="top">{props.meta.toAmount}</td>
      </tr>
      <tr style={{ backgroundColor: "#EEEEEE" }}>
        <td valign="top">{"DCA amount"}</td>
        <td valign="top">{dcaAmount}</td>
      </tr>
      <tr>
        <td valign="top">{"Period"}</td>
        <td valign="top">{`${day}${hr}${min}${sec}`}</td>
      </tr>
      <tr style={{ backgroundColor: "#EEEEEE" }}>
        <td valign="top">{"Next swap"}</td>
        <td valign="top">{`${new Date(parseInt(props.meta.nextSwap))}`}</td>
      </tr>
    </table>
  );

  return (
    <div className="card bg-[#F8F8FF] text-black shadow-xl p-0 m-6 ">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{assetPair}</h2>

        <div className="card-detail">{cardDetails}</div>

        <div className="card-actions">
          <button
            className="btn m-50"
            onClick={() => {
              console.log(`Harvest:${props.meta.txHash}#${props.meta.txIdx}`);
            }}
          >
            Harvest
          </button>

          <button
            className="btn btn-primary m-50"
            onClick={() => {
              console.log(`Close:${props.meta.txHash}#${props.meta.txIdx}`);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
