// import { getAssets } from "../utils/cardano";
import { useStoreState } from "../utils/store";
// import { useState, useEffect } from "react";

const Address = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  // const [nftList, setNftList] = useState([]);

  // useEffect(() => {
  //   //const lucid = initLucid(walletStore.name)
  //   if (walletStore.address != "") {
  //     getAssets(walletStore.address).then((res: any) => {
  //       setNftList(res.addressInfo.nfts);
  //     });
  //   }
  // }, [walletStore.address]);

  return (
    <div className="fixed top-14">
      <div>
        <h1 className="font-bold px-4 text-[#09031B]">
          Address: {walletStore.address}
        </h1>
      </div>
    </div>
  );
};

export default Address;
