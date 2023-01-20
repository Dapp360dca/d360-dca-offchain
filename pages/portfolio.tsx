import type { NextPage } from "next";
import Head from "next/head";
import WalletConnect from "../components/WalletConnect";
import { useStoreActions, useStoreState } from "../utils/store";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAccounts } from "../utils/cardano";
import AccountGrid from "../components/AccountGrid";
import initLucid from "../utils/lucid";
import Address from "../components/Address";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import {
  applyParamsToScript,
  Constr,
  Data,
  Lovelace,
  Lucid,
  MintingPolicy,
  PolicyId,
  SpendingValidator,
  TxHash,
  Unit,
  utf8ToHex,
} from "lucid-cardano";
import * as helios from "@hyperionbt/helios";

const Portfolio: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    //const lucid = initLucid(walletStore.name)
    // if (walletStore.address != "") {
    getAccounts(walletStore.address).then((res: any) => {
      setAccountList(res.addressInfo.accounts);
    });
    // }
  }, [walletStore.address]);

  return (
    <div>
      <Header />
      <Navbar/>
      <Address />
      <AccountGrid accounts={accountList} />
    </div>
  );
};

export default Portfolio;
