import type { NextPage } from "next";
import Head from "next/head";
import WalletConnect from "../components/WalletConnect";
import { useStoreActions, useStoreState } from "../utils/store";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAssets } from "../utils/cardano";
import NftGrid from "../components/NftGrid";
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

      {/* TODO: Account details component here */}

      <div className="mx-40 my-10">
        {/* Harvest button */}
        <button className="btn m-5" onClick={() => {}}>
          Harvest
        </button>

        {/* Close button */}
        <button className="btn btn-primary m-5" onClick={() => {}}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Portfolio;
