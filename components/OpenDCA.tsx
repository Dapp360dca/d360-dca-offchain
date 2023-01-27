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
    <div className="flex justify-center bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full">
     {walletStore.connected} ?
      (
    <div className='mt-28 mb-6 text-white bg-[#09031B] w-5/12'>
        <form onSubmit={openDCA} className='shadow-md rounded px-4 pt-6 w-fit m-auto content-center'>
            <div className='font-bold text-3xl bg-white rounded-[5px] text-[#ff4D41] flex justify-center'>OPEN DCA</div>
            <div className=' flex  justify-center mt-6 font-bold text-2xl'>Deposit ADA and open position</div>
            <div className='mt-5'>

            <div className='flex mb-6 border border-[#498AB4] rounded-[10px] h-10'>
                <div className="text-2xl w-44"><label htmlFor="depositAmount" >Deposit amount</label></div>
                <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <input id="depositAmount" name="depositAmount" type={'number'} min={1} className='box-content w-52 rounded-r' placeholder='tADA'/>
                </div>
            </div>

            <div className='flex mb-6 border border-[#498AB4] rounded-[10px] h-10'>
                <div className="text-2xl w-44"><label htmlFor="toAsset">Select asset</label></div>
                <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                  <select id="toAsset" name="toAsset"  className='box-border w-52 rounded-r'>
                    <option value="47e9faf04ae9f5c3bcde980c84e332b84feebc9fa2870cff07239bbe575254">
                        tWRT
                    </option>
                </select>
                </div>
            </div>

            <div className='flex mb-6 border border-[#498AB4] rounded-[10px] h-10'>
                <div className="text-2xl w-44"><label htmlFor="swapAmount">Swap amount</label></div>
                <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <input id="swapAmount" name="swapAmount" type={'number'} min={1} className='box-content w-52 rounded-r' placeholder='tADA'/>
                </div>
            </div>

            <div className='flex mb-8 border border-[#498AB4] rounded-[10px] h-10'>
                <div className="text-2xl w-44"><label htmlFor="frequency">frequency</label></div>
                <div className="ml-6 w-52 bg-white text-black text-2xl rounded-r">
                <input type={'number'} min={1} id="period" name="period" placeholder="1" className='box-content w-32' />
                <select className='text-black' id="unit" name="unit" required>
                        <option value="86400000">day</option>
                        <option value="3600000">hour</option>
                        <option value="60000">min</option>
                        <option value="1000">sec</option>
                  </select>
                </div>
            </div>
            </div>
            <div className='flex justify-center'>
                <button className="btn border border-[#ff4D41] font-bold bg-[#ffffff] text-[#ff4D41] hover:bg-[#ff4D41] hover:text-white transition duration-200" type="submit">
                  Submit
                </button>         
            </div>
    </form>  
    <div className="mt-4 mb-10 px-4 py-4">TxHash: {txHash}</div>
    </div>
    )
    </div>
      )
};

export default OpenDCA
