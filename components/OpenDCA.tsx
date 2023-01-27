import { Address, Constr, Data, Lucid } from "lucid-cardano";
import { useEffect, useState } from "react";
import { dcaScript } from "../pages/offchain";
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
    <div className="flex bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full items-center border border-[#FF4D41]">
      {walletStore.connected && (
        // if wallet is connected:
        <div className="mx-80 my-10">
          <form onSubmit={doOpenDCA}>
            <table>
              {/* Deposit amount */}
              <tr>
                <td>
                  <label
                    htmlFor="depositAmount"
                    style={{ color: "black", margin: "10px" }}
                  >
                    Deposit amount
                  </label>
                </td>
                <td>
                  <input
                    type="number"
                    id="depositAmount"
                    name="depositAmount"
                    placeholder="tADA"
                    min={10}
                    style={{
                      color: "black",
                      margin: "5px",
                      width: "100px",
                      textAlign: "right",
                    }}
                    required
                  />
                </td>
              </tr>

              {/* To asset */}
              <tr>
                <td>
                  <label
                    htmlFor="toAsset"
                    style={{ color: "black", margin: "10px" }}
                  >
                    To asset
                  </label>
                </td>
                <td>
                  <select
                    id="toAsset"
                    name="toAsset"
                    style={{
                      color: "black",
                      margin: "5px",
                      width: "100px",
                      textAlign: "right",
                    }}
                    required
                  >
                    <option value="f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e374575254">
                      tWRT
                    </option>
                  </select>
                </td>
              </tr>

              {/* Swap amount */}
              <tr>
                <td>
                  <label
                    htmlFor="swapAmount"
                    style={{ color: "black", margin: "10px" }}
                  >
                    Swap amount
                  </label>
                </td>
                <td>
                  <input
                    type="number"
                    id="swapAmount"
                    name="swapAmount"
                    placeholder="tADA"
                    min={5}
                    style={{
                      color: "black",
                      margin: "5px",
                      width: "100px",
                      textAlign: "right",
                    }}
                    required
                  />
                </td>
              </tr>

              {/* Swap frequency */}
              <tr>
                <td>
                  <label
                    htmlFor="frequency"
                    style={{ color: "black", margin: "10px" }}
                  >
                    Frequency
                  </label>
                </td>
                <td>
                  <input
                    type="number"
                    id="period"
                    name="period"
                    placeholder="1"
                    min={1}
                    style={{
                      color: "black",
                      margin: "5px",
                      width: "100px",
                      textAlign: "right",
                    }}
                    required
                  />
                  <select
                    id="unit"
                    name="unit"
                    style={{
                      color: "black",
                      margin: "5px",
                    }}
                    required
                  >
                    <option value="86400000">day</option>
                    <option value="3600000">hour</option>
                    <option value="60000">min</option>
                    <option value="1000">sec</option>
                  </select>
                </td>
              </tr>
            </table>

            <button className="btn m-5" type="submit">
              Open DCA
            </button>
          </form>

          {txHash}
        </div>
      )}
    </div>
  );
};

export default OpenDCA;
