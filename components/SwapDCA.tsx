import type { NextPage } from "next";
import { useStoreState } from "../utils/store";
import { useState, useEffect } from "react";
import { getAccounts } from "../utils/cardano";
import AccountGrid from "../components/AccountGrid";
import initLucid from "../utils/lucid";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const SwapDCA: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    if (walletStore.connected) {
      initLucid(walletStore.name).then((lucid) => {
        const { paymentCredential } = lucid.utils.getAddressDetails(
          walletStore.address
        );

        if (paymentCredential) {
          getAccounts(paymentCredential.hash).then((res: any) => {
            setAccountList(res.addressInfo.accounts);
          });
        } else {
          console.log("Failed retrieving wallet PKH");
        }
      });
    }
  }, [walletStore.address]);

  return (
    <div className="flex bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full items-center">
      <Header />
      <Navbar />
      <AccountGrid
        accounts={accountList}
        swap={true}
      />
    </div>
  );
};

export default SwapDCA;
