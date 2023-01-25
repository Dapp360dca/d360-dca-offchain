import { Address, Constr, Data, Lucid } from "lucid-cardano";
import { useEffect, useState } from "react";
import { dcaScript } from "../pages/offchain";
import initLucid from "../utils/lucid";
import { useStoreState } from "../utils/store";

const OpenDCA = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [lucid, setLucid] = useState<Lucid>();
  const [txHash, setTxHash] = useState<string>();

  useEffect(() => {
    if (!lucid) {
      initLucid(walletStore.name).then((Lucid: Lucid) => {
        setLucid(Lucid);
      });
    }
  }, [lucid]);

  const keyAddressWithKeyStakeToData = (address: Address) => {
    const { paymentCredential, stakeCredential } =
      lucid!.utils.getAddressDetails(address);
    return new Constr(0, [
      new Constr(0, [paymentCredential?.hash!]),
      new Constr(0, [new Constr(0, [new Constr(0, [stakeCredential?.hash!])])]),
    ]);
  };

  const openDCA = async (e: any) => {
    e.preventDefault();

    if (lucid) {
      const dcaScriptAddress = lucid.utils.validatorToAddress(dcaScript);
      const ownerAddress = await lucid.wallet.address();

      const dOwner = keyAddressWithKeyStakeToData(ownerAddress); // Owner of the DCA is the owner of the Wallet

      const dFromAsset = new Constr(0, [""]); // Swap from tADA

      const dToAsset = new Constr(0, [e.target.toAsset.value]); // Swap to toAsset

      const dSwapAmmount = BigInt(
        parseInt(e.target.swapAmount.value) * 1000000
      ); // Swap tADA * lovelace

      const dNextSwap = new Constr(0, [BigInt(Date.now())]); // Starting from now

      const freqPeriod = parseInt(e.target.period.value);
      const freqUnit = parseInt(e.target.unit.value);
      const dFreq = BigInt(freqPeriod * freqUnit); // Swap frequency

      const dcaDatum = new Constr(0, [
        dOwner,
        dFromAsset,
        dToAsset,
        dSwapAmmount,
        dNextSwap,
        dFreq,
      ]);

      const tx = await lucid
        .newTx()
        .payToContract(
          dcaScriptAddress,
          { inline: Data.to(dcaDatum) },
          { lovelace: BigInt(parseInt(e.target.depositAmount.value) * 1000000) }
        )
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      setTxHash(txHash);
      return txHash;
    }
  };

  return (
    <div className="flex bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full items-center border border-[#FF4D41]">
      {walletStore.connected && (
        // if wallet is connected:
        <div className="mx-80 my-10">
          <form onSubmit={openDCA}>
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
                    min={1}
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
                    <option value="47e9faf04ae9f5c3bcde980c84e332b84feebc9fa2870cff07239bbe575254">
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
                    min={1}
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

              {/* Period */}
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

export default OpenDCA
