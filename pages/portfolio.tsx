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
import { dcaScript } from "./offchain";

const Portfolio: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [lucid, setLucid] = useState<Lucid>();
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    // const lucid = initLucid(walletStore.name);
    //   if (walletStore.address != "") {
    getAccounts(walletStore.address).then((res: any) => {
      setAccountList(res.addressInfo.accounts);
    });
    /////////////////////////////////////////////
    // {
    //   accounts: [
    //     {
    //       owner: "PlutusV2.Address",
    //       fromAsset: "PlutusV2.AssetClass",
    //       toAsset: "PlutusV2.AssetClass",
    //       ammount: "Integer",
    //       nextSwap: "PlutusV2.POSIXTime",
    //       period: "Integer",
    //     },
    //   ];
    // }
    // }
  }, [walletStore.address]);

  // useEffect(() => {
  //   if (lucid) {
  //     loadAccounts();
  //   } else {
  //     initLucid(walletStore.name).then((Lucid: Lucid) => {
  //       setLucid(Lucid);
  //     });
  //   }
  // }, [lucid]);

  // const loadAccounts = async () => {
  //   if (lucid) {
  //     const dcaScriptAddress = lucid.utils.validatorToAddress(dcaScript);
  //     console.log(dcaScriptAddress);
  //     // const ownerAddress = await lucid.wallet.address();

  //     // const dcaUtxos = await lucid.utxosAt(dcaScriptAddress);
  //     // const ownedUtxos = dcaUtxos.filter(
  //     //   (utxo) => !utxo.scriptRef
  //     // );
  //   }
  // };

  return (
    <div>
      <Header />
      <Navbar />
      <Address />
      <AccountGrid accounts={accountList} />
    </div>
  );
};

export default Portfolio;
