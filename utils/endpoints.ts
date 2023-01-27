import {
  AssetClass,
  RequestDatum,
  RequestMetadaDatum,
  SwapAction,
  SwapDirection,
} from "@wingriders/dex-serializer";
import { Address, Constr, Data, Lucid, UTxO } from "lucid-cardano";
import { dcaScript } from "../pages/offchain";
import { dcaScAddress } from "./cardano";
import mlb from "@dcspark/cardano-multiplatform-lib-browser";

export const wingridersDexAddress =
  "addr_test1wz6zjuut6mx93dw8jvksqx4zh5zul6j8qg992myvw575gdsgwxjuc"; // Preprod

export const openDCA = async (
  lucid: Lucid,
  fromAddress: string, // wallet address
  toAsset: string, // policy ID + token name
  depositAmount: number, // tADA
  swapAmount: number, // tADA
  swapFrequency: number // ms
) => {
  const dOwner = keyAddressWithKeyStakeToData(lucid, fromAddress); // Owner of the DCA is the owner of the Wallet
  const dFromAsset = new Constr(0, [""]); // Swap from tADA
  const dToAsset = new Constr(0, [toAsset]); // Swap to toAsset
  const dSwapAmmount = BigInt(swapAmount * 1000000); // Swap tADA * lovelace
  const dNextSwap = new Constr(0, [BigInt(Date.now())]); // Starting from now
  const dFreq = BigInt(swapFrequency); // Swap frequency

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
      dcaScAddress,
      { inline: Data.to(dcaDatum) },
      { lovelace: BigInt(depositAmount * 1000000) }
    )
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();

  return txHash;
};

export const swapDCA = async (
  lucid: Lucid,
  stakeKey: string, // staking key
  fromAddress: string, // beneficiary address - taken from dcaScript Datum Params
  toAsset: string,
  dcaAmount: string,
  collectFromUTxO: UTxO,
  txExpiryMs: number = 3600_000 // default 1 hour
) => {
  const policyID = toAsset.substring(0, 56);
  const tokenName = toAsset.substring(56);
  const txExpiry = Date.now() + txExpiryMs; // deadline - usually 24 hrs
  const metadata = new RequestMetadaDatum(
    mlb.Address.from_bech32(fromAddress),
    mlb.StakeCredential.from_keyhash(mlb.Ed25519KeyHash.from_hex(stakeKey)),
    mlb.BigInt.from_str(txExpiry.toString()),
    AssetClass.from_hex("", ""),
    AssetClass.from_hex(policyID, tokenName)
  );

  const swapAction = new SwapAction(
    SwapDirection.ATOB,
    mlb.BigInt.from_str("0")
  ); // Minimum received
  // Minimum received is calculated from dcaDetails{dSwapAmmount} and slippage
  const requestDatum = new RequestDatum(metadata, swapAction);
  const requestDatumHex = Buffer.from(
    requestDatum.to_plutus_data().to_bytes()
  ).toString("hex"); // Should be an easier way?

  const dcaRedeemerSwap = new Constr(1, []);
  const tx = await lucid
    .newTx()
    .payToContract(wingridersDexAddress, requestDatumHex, {
      lovelace: BigInt(dcaAmount),
    })
    .collectFrom([collectFromUTxO], Data.to(dcaRedeemerSwap))
    .attachSpendingValidator(dcaScript)
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  return txHash;
};

// TODO: harvestDCA()
export const harvestDCA = async () => {};

// TODO: closeDCA()
export const closeDCA = async () => {};

/************************************** Helper Functions **************************************/
const keyAddressWithKeyStakeToData = (lucid: Lucid, address: Address) => {
  const { paymentCredential, stakeCredential } =
    lucid!.utils.getAddressDetails(address);
  return new Constr(0, [
    new Constr(0, [paymentCredential?.hash!]),
    new Constr(0, [new Constr(0, [new Constr(0, [stakeCredential?.hash!])])]),
  ]);
};
