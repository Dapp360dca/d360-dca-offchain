import type { NextPage } from "next";
import Head from "next/head";
import WalletConnect from "../components/WalletConnect";
import { useStoreActions, useStoreState } from "../utils/store";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAccounts } from "../utils/cardano";
import AccountGrid from "../components/AccountGrid";
import initLucid from "../utils/lucid";
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
    <div className="px-10">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Cardano
          </Link>
        </div>
        <div className="flex-none">
          <WalletConnect />
        </div>
      </div>

      <div className="mx-40 my-10">
        <div>Your Accounts:</div>
        <br />
        <AccountGrid accounts={accountList} />
      </div>
    </div>
  );
};

export default Portfolio;
