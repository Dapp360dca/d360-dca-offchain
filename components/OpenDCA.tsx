import { Lucid } from "lucid-cardano";
import { useEffect, useState } from "react";
import { openDCA } from "../utils/endpoints";
import initLucid from "../utils/lucid";
import { useStoreState } from "../utils/store";

const OpenDCA = () => {
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

  const doOpenDCA = async (e: any) => {
    e.preventDefault();

    if (lucid) {
      const fromAddress = await lucid.wallet.address();
      const toAsset = e.target.toAsset.value;

      const depositAmount = parseInt(e.target.depositAmount.value);
      const swapAmount = parseInt(e.target.swapAmount.value);

      const freqPeriod = parseInt(e.target.period.value);
      const freqUnit = parseInt(e.target.unit.value);
      const swapFrequency = freqPeriod * freqUnit;

      const txResult = await openDCA(
        lucid,
        fromAddress,
        toAsset,
        depositAmount,
        swapAmount,
        swapFrequency
      );
      setTxHash(txResult);
    }
  };

  return (
    <div className="flex justify-center bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full">
      {walletStore.connected} ? (
      <div className="mt-28 mb-6 text-white bg-[#09031B] w-5/12">
        <form
          onSubmit={doOpenDCA}
          className="shadow-md rounded px-4 pt-6 w-fit m-auto content-center"
        >
          <div className="font-bold text-3xl bg-white rounded-[5px] text-[#ff4D41] flex justify-center">
            OPEN DCA
          </div>
          <div className=" flex  justify-center mt-6 font-bold text-2xl">
            Deposit ADA and open position
          </div>
          <div className="mt-5">
            <div className="flex mb-6 border border-[#498AB4] rounded-[10px] h-10">
              <div className="text-2xl w-44">
                <label htmlFor="depositAmount">Deposit amount</label>
              </div>
              <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <input
                  id="depositAmount"
                  name="depositAmount"
                  type={"number"}
                  min={10}
                  className="box-content w-52 rounded-r"
                  style={{ textAlign: "right" }}
                  placeholder="tADA"
                  required
                />
              </div>
            </div>

            <div className="flex mb-6 border border-[#498AB4] rounded-[10px] h-10">
              <div className="text-2xl w-44">
                <label htmlFor="toAsset">Select asset</label>
              </div>
              <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <select
                  id="toAsset"
                  name="toAsset"
                  className="box-border w-52 rounded-r"
                  style={{ textAlign: "right" }}
                  required
                >
                  <option value="f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e374575254">
                    tWRT
                  </option>
                </select>
              </div>
            </div>

            <div className="flex mb-6 border border-[#498AB4] rounded-[10px] h-10">
              <div className="text-2xl w-44">
                <label htmlFor="swapAmount">Swap amount</label>
              </div>
              <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <input
                  id="swapAmount"
                  name="swapAmount"
                  type={"number"}
                  min={5}
                  className="box-content w-52 rounded-r"
                  style={{ textAlign: "right" }}
                  placeholder="tADA"
                  required
                />
              </div>
            </div>

            <div className="flex mb-8 border border-[#498AB4] rounded-[10px] h-10">
              <div className="text-2xl w-44">
                <label htmlFor="frequency">Swap frequency</label>
              </div>
              <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <input
                  type={"number"}
                  min={1}
                  id="period"
                  name="period"
                  placeholder="1"
                  className="box-content w-32"
                  style={{ textAlign: "right" }}
                  required
                />
                <select className="text-black" id="unit" name="unit" required>
                  <option value="86400000">day</option>
                  <option value="3600000">hour</option>
                  <option value="60000">min</option>
                  <option value="1000">sec</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="btn border border-[#ff4D41] font-bold bg-[#ffffff] text-[#ff4D41] hover:bg-[#ff4D41] hover:text-white transition duration-200"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        {txHash && <div className="mt-4 mb-10 px-4 py-4">TxHash: {txHash}</div>}
      </div>
      )
    </div>
  );
};

export default OpenDCA;
