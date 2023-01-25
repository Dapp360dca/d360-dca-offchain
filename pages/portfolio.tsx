import type { NextPage } from "next";

import Head from "next/head";
import { useStoreActions, useStoreState } from "../utils/store";
import Link from "next/link";

import { useState, useEffect } from "react";
import { getAccounts } from "../utils/cardano";
import AccountGrid from "../components/AccountGrid";
import initLucid from "../utils/lucid";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Portfolio: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
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
  }, [walletStore.address]);

  return (
    <div>
      <Header />
      <Navbar/>
      <AccountGrid accounts={accountList} />
    </div>
  );
};

export default Portfolio;
