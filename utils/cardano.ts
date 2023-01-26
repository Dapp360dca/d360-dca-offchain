import { Constr, Data, hexToUtf8 } from "lucid-cardano";

export const dcaScAddress =
  "addr_test1wr6echczsvcn7lvxu0nsf70egvzgrt8e3kk8gd055u9lp4c7vw032";

export const getAccounts = async (pkh: string) => {
  var allAccounts: any = [];
  var addressInfo = { accounts: allAccounts };

  const data = await fetch(
    `https://cardano-preprod.blockfrost.io/api/v0/addresses/${dcaScAddress}/utxos`,
    {
      headers: {
        // Your Blockfrost API key
        project_id: process.env.NEXT_PUBLIC_BLOCKFROST!,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  if (data?.error) {
    // Handle error.
    console.log("error");
  } else {
    // console.log(pkh);
    await Promise.all(
      data
        .filter((utxo: any) => {
          try {
            const datum = Data.from(utxo["inline_datum"]) as Constr<any>;
            return (
              !utxo.scriptRef && pkh === datum.fields[0].fields[0].fields[0]
            );
          } catch {
            return false;
          }
        })
        .map(async (utxo: any) => {
          try {
            // console.log(utxo);
            const datum = Data.from(utxo["inline_datum"]) as Constr<any>;
            // console.log(datum);

            const datumAddress = datum.fields[0].fields[0];
            const datumPKH = datum.fields[0].fields[0].fields[0];
            const datumStakeKey =
              datum.fields[0].fields[1].fields[0].fields[0].fields[0];
            const fromAsset = await getAsset(datum.fields[1]);
            const toAsset = await getAsset(datum.fields[2]);
            const dcaAmount = `${datum.fields[3]}`;
            const nextSwap = `${datum.fields[4].fields[0]}`;
            const period = `${datum.fields[5]}`;

            allAccounts.push({
              address: datumAddress,
              pkh: datumPKH,
              stakeKey: datumStakeKey,
              fromAsset: fromAsset,
              toAsset: toAsset,
              dcaAmount: dcaAmount,
              period: period,
              nextSwap: nextSwap,
              fromAmount: utxo["amount"][0]["quantity"],
              toAmount: 0,
              txHash: utxo["tx_hash"],
              txIdx: utxo["tx_index"],
            });
          } catch {}
        })
    );

    allAccounts = allAccounts.sort((a: any, b: any) => a.nextSwap - b.nextSwap);
  }

  return { addressInfo };
};

const getAsset = async (datumField: Constr<any>) => {
  var asset = datumField.fields[0];
  return "" === asset ? "tADA" : await getAssetName(asset);
};

const getAssetName = async (asset: string) => {
  // const data = await fetch(
  //   `https://cardano-preprod.blockfrost.io/api/v0/assets/${asset}`,
  //   {
  //     headers: {
  //       // Your Blockfrost API key
  //       project_id: process.env.NEXT_PUBLIC_BLOCKFROST!,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // ).then((res) => res.json());
  // console.log(hexToUtf8(data["asset_name"]));
  // return hexToUtf8(data["asset_name"]);
  const tokenName = asset.substring(56);
  return hexToUtf8(tokenName);
};
