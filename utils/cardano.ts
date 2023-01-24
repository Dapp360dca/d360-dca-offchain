import { Data } from "lucid-cardano";

export const dcaScAddress =
  "addr_test1wr6echczsvcn7lvxu0nsf70egvzgrt8e3kk8gd055u9lp4c7vw032";

export const getAccounts = async (address: string) => {
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
    data
      .filter((utxo: any) => Boolean(utxo["inline_datum"]))
      .map((utxo: any) => {
        console.log(utxo);
        const datum = Data.from(utxo["inline_datum"]);
        console.log(datum);
        allAccounts.push({
          fromAsset: "ADA",
          toAsset: "XXX",
          period: 0,
          nextSwap: 0,
          amount: utxo["amount"][0]["quantity"],
        });
      });
  }

  // https://cardano-preprod.blockfrost.io/api/v0/addresses/{address}/utxos
  // ["XXX", "YYY", "ZZZ", "AAA", "BBB", "CCC"].map((token) =>
  //   allAccounts.push({
  //     fromAsset: "ADA",
  //     toAsset: token,
  //     period: 0,
  //     nextSwap: 0,
  //   })
  // );

  return { addressInfo };
};

// export const getAssets = async (address: string) => {
//   var allNFTs: any = [];
//   var addressInfo = { nfts: allNFTs, balance: 0 };
//   const data = await fetch(
//     `https://cardano-preprod.blockfrost.io/api/v0/addresses/${address}`,
//     {
//       headers: {
//         // Your Blockfrost API key
//         project_id: process.env.NEXT_PUBLIC_BLOCKFROST!,
//         "Content-Type": "application/json",
//       },
//     }
//   ).then((res) => res.json());
//   // console.log(data);
//   if (data?.error) {
//     // Handle error.
//     console.log("error");
//   }

//   const amount = data["amount"];
//   if (amount.length > 0) {
//     amount.map(async (asset: any) => {
//       //var allNFTs = []
//       if (asset.unit !== "lovelace") {
//         const data = await fetch(
//           `https://cardano-preprod.blockfrost.io/api/v0/assets/${asset.unit}`,
//           {
//             headers: {
//               // Your Blockfrost API key
//               project_id: process.env.NEXT_PUBLIC_BLOCKFROST!,
//               "Content-Type": "application/json",
//             },
//           }
//         ).then((res) => res.json());
//         const meta = data["onchain_metadata"];
//         if (meta && meta.image) {
//           allNFTs.push({ ...meta, assetId: data.asset });
//         } else {
//           //   console.log("nometa", data)
//         }
//       } else if (asset.unit === "lovelace") {
//         addressInfo.balance === asset.quantity;
//       }
//     });
//   }
//   return { addressInfo };
// };
