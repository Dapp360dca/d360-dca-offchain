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

const Helios: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet);
  const [nftList, setNftList] = useState([]);
  const [lucid, setLucid] = useState<Lucid>();
  const [script, setScript] = useState<SpendingValidator>();
  const [scriptAddress, setScriptAddress] = useState("");
  const [refTxHash, setRefTxHash] = useState("");

  useEffect(() => {
    if (lucid) {
    } else {
      initLucid(walletStore.name).then((Lucid: Lucid) => {
        setLucid(Lucid);
      });
    }
  }, [lucid]);

  const vestingPolicy: SpendingValidator = {
    type: "PlutusV1",
    script:
      "5907945907910100003233223232323232323232323232323322323232323222232325335332232333573466e1c005",
  };

  // const mintingPolicy: MintingPolicy = {
  //   type: "PlutusV2",
  //   script: "5909785909750100003323322332232323232323232323232323232323232323232323232322335501622232325335330050043333573466e1cd55cea80124000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd405c060d5d0a80619a80b80c1aba1500b33501701935742a014666aa036eb94068d5d0a804999aa80dbae501a35742a01066a02e0406ae85401cccd5406c085d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40add69aba15002302c357426ae8940088c98c80b8cd5ce01781701609aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a815bad35742a00460586ae84d5d1280111931901719ab9c02f02e02c135573ca00226ea8004d5d09aba2500223263202a33573805605405026aae7940044dd50009aba1500533501775c6ae854010ccd5406c0748004d5d0a801999aa80dbae200135742a004603e6ae84d5d1280111931901319ab9c027026024135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a004601e6ae84d5d1280111931900c19ab9c01901801610171326320173357389210350543500017135573ca00226ea800488c8cc05ccc0152401115554784f206e6f7420636f6e73756d656400335501933553018120013232123300122333500522002002001002350012200112330012253350021020100101d232325335333573466e3cd400888008d40048800808007c4ccd5cd19b873500222001350012200102001f101f35006220013500122002323500122222222222200c5001330054911377726f6e6720616d6f756e74206d696e746564005335323301b502000132350012222222222220085001101c22135002222533500413301c32333573466e3c01000408c088d401c88cccd40048c98c8074cd5ce249024c680001d200123263201d3357389201024c680001d23263201d3357389201024c680001d333573466e1c005200202202122102313500122002225335001101a13357380040322464460046eb0004c8004d5406c88cccd55cf8009280e919a80e18021aba1002300335744004024464646666ae68cdc39aab9d5002480008cc8848cc00400c008c028d5d0a80118029aba135744a004464c6402466ae7004c0480404d55cf280089baa0012323232323333573466e1cd55cea8022400046666444424666600200a0080060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008c04cd5d0a80119a8068091aba135744a004464c6402e66ae7006005c0544d55cf280089baa00135742a008666aa010eb9401cd5d0a8019919191999ab9a3370ea0029002119091118010021aba135573ca00646666ae68cdc3a80124004464244460020086eb8d5d09aab9e500423333573466e1d400d20002122200323263201933573803403202e02c02a26aae7540044dd50009aba1500233500975c6ae84d5d1280111931900999ab9c014013011135744a00226ae8940044d55cf280089baa0011335500175ceb44488c88c008dd5800990009aa80c11191999aab9f0022501b233501a33221233001003002300635573aa004600a6aae794008c010d5d100180809aba100112232323333573466e1d4005200023212230020033005357426aae79400c8cccd5cd19b8750024800884880048c98c8040cd5ce00880800700689aab9d500113754002464646666ae68cdc3a800a400c46424444600800a600e6ae84d55cf280191999ab9a3370ea004900211909111180100298049aba135573ca00846666ae68cdc3a801a400446424444600200a600e6ae84d55cf280291999ab9a3370ea00890001190911118018029bae357426aae7940188c98c8040cd5ce00880800700680600589aab9d500113754002464646666ae68cdc39aab9d5002480008cc8848cc00400c008c014d5d0a8011bad357426ae8940088c98c8030cd5ce00680600509aab9e5001137540024646666ae68cdc39aab9d5001480008dd71aba135573ca004464c6401466ae7002c0280204dd5000919191919191999ab9a3370ea002900610911111100191999ab9a3370ea004900510911111100211999ab9a3370ea00690041199109111111198008048041bae35742a00a6eb4d5d09aba2500523333573466e1d40112006233221222222233002009008375c6ae85401cdd71aba135744a00e46666ae68cdc3a802a400846644244444446600c01201060186ae854024dd71aba135744a01246666ae68cdc3a8032400446424444444600e010601a6ae84d55cf280591999ab9a3370ea00e900011909111111180280418071aba135573ca018464c6402666ae7005004c04404003c03803403002c4d55cea80209aab9e5003135573ca00426aae7940044dd50009191919191999ab9a3370ea002900111999110911998008028020019bad35742a0086eb4d5d0a8019bad357426ae89400c8cccd5cd19b875002480008c8488c00800cc020d5d09aab9e500623263200c33573801a01801401226aae75400c4d5d1280089aab9e500113754002464646666ae68cdc3a800a400446424460020066eb8d5d09aab9e500323333573466e1d400920002321223002003375c6ae84d55cf280211931900499ab9c00a009007006135573aa00226ea8004488c8c8cccd5cd19b87500148010848880048cccd5cd19b875002480088c84888c00c010c018d5d09aab9e500423333573466e1d400d20002122200223263200a33573801601401000e00c26aae7540044dd50009191999ab9a3370ea0029001100691999ab9a3370ea0049000100691931900319ab9c007006004003135573a6ea8005261200149010350543100225335002100110073200135500822112225335001135003220012213335005220023004002333553007120010050040011122300200132001355006222533500110022213500222330073330080020060010033200135500522225335001100222135002225335333573466e1c005200000a0091333008007006003133300800733500b12333001008003002006003122002122001112200212212233001004003112323001001223300330020020013351223351223300248008cc011221200534cb9c671a75858286c9b9d3ef94577b4c5ea9087ad0899f6079eeeb1eee9e00480088848cc00400c00880048848cc00400c00880041",
  // };

  const alwaysSucceedScript: SpendingValidator = {
    type: "PlutusV2",
    script: "49480100002221200101",
  };

  const Datum = () => Data.empty();
  const Redeemer = () => Data.empty();

  const oneShotMintingScript =
    "5908295908260100003232323233223232323232323232323322323232323232232223232533533223232323500322222222222233355301812001323212330012233350052200200200100235001220011233001225335002102d100102a25335333573466e3c03cd400488d4008880080ac0a84ccd5cd19b8700e3500122350022200102b02a102a00c3235001220015009323500122002500835001220023333573466e1cd55ce9baa0044800080708c98c8070cd5ce00e80e00d1999ab9a3370e6aae7540092000233221233001003002323232323232323232323232323333573466e1cd55cea8062400046666666666664444444444442466666666666600201a01801601401201000e00c00a00800600466a02e0306ae854030cd405c060d5d0a80599a80b80c9aba1500a3335501b75ca0346ae854024ccd5406dd7280d1aba1500833501702235742a00e666aa036046eb4d5d0a8031919191999ab9a3370e6aae75400920002332212330010030023232323333573466e1cd55cea8012400046644246600200600466a05aeb4d5d0a80118171aba135744a004464c6406466ae700cc0c80c04d55cf280089baa00135742a0046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b5d69aba15002302e357426ae8940088c98c80c8cd5ce01981901809aab9e5001137540026ae84d5d1280111931901719ab9c02f02e02c135573ca00226ea8004d5d0a80299a80bbae35742a008666aa03603e40026ae85400cccd5406dd710009aba150023021357426ae8940088c98c80a8cd5ce01581501409aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023011357426ae8940088c98c8070cd5ce00e80e00d080d89931900d99ab9c491035054350001b135573ca00226ea80044c030004c8004d5405888448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448c88c008dd6000990009aa80b111999aab9f0012500a233500930043574200460066ae880080588c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8058cd5ce00b80b00a09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500f014357426ae8940088c98c806ccd5ce00e00d80c89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403a66ae7007807406c0680644d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201733573803002e02a26ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355013223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301413574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900919ab9c01301201000f135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900919ab9c01301201000f00e00d135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900719ab9c00f00e00c135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8030cd5ce00680600509baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8054cd5ce00b00a80980900880800780700689aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401c66ae7003c03803002c4d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200b33573801801601201026aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401866ae700340300280240204d55cea80089baa0012323333573466e1d40052002200523333573466e1d40092000200523263200833573801201000c00a26aae74dd5000891001091000a4c2400292010350543100112323001001223300330020020011";
  const mintNft = async () => {
    if (lucid) {
      const minterAddress = await lucid.wallet.address(); // get current connected wallet
      const utxo = await lucid.utxosAt(minterAddress); // get wallet UTxO list

      if (utxo.length == 0) throw "No UTxO available";

      const txIn = new Constr(0, [utxo[0].txHash]);
      const txIdx = BigInt(utxo[0].outputIndex);
      const txOutRef = new Constr(0, [txIn, txIdx]); // txIn#txIdx

      const mintingPolicy: MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript(oneShotMintingScript, txOutRef),
      };

      const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
      const tokenName = utf8ToHex("AriadyPutra");
      const assetToMint: Unit = policyId + tokenName;

      const tx = await lucid
        .newTx()
        .mintAssets({ [assetToMint]: BigInt(1) })
        .attachMintingPolicy(mintingPolicy)
        .collectFrom([utxo[0]], Redeemer())
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
    }
  };

  const sendReferenceInputTxn = async () => {
    if (lucid) {
      const scriptAddress = lucid.utils.validatorToAddress(alwaysSucceedScript);

      /* example datum:
      data Game = Game
        { gFirst          :: !PaymentPubKeyHash
        , gSecond         :: !PaymentPubKeyHash
        , gStake          :: !Integer
        , gPlayDeadline   :: !POSIXTime
        , gRevealDeadline :: !POSIXTime
        , gToken          :: !AssetClass
        }
      */
      const gFirst = new Constr(0, ["deadbeef"]);
      const gSecond = new Constr(0, [utf8ToHex("2ndPKH")]);
      const gStake = BigInt(5_000000);
      const gPlayDeadline = BigInt(new Date("2/1/2023").getTime());
      const gRevealDeadline = BigInt(new Date("2/8/2023").getTime());
      const gToken = utf8ToHex("asset_class");
      const ariadyDatum = new Constr(0, [
        gFirst,
        gSecond,
        gStake,
        gPlayDeadline,
        gRevealDeadline,
        gToken,
      ]);

      const tx = await lucid
        .newTx()
        .payToContract(
          scriptAddress, // address
          {
            inline: Data.to(ariadyDatum), // outputData
          },
          {
            lovelace: BigInt(5_000000), // assets
          }
        )
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      setRefTxHash(txHash); // save txHash to refTxHash using setState()
      return txHash;
    }
  };

  const readReferenceInputTxn = async () => {
    if (lucid) {
      // user pkh
      const wallet = await lucid.wallet.address();
      const { paymentCredential } = lucid.utils.getAddressDetails(wallet);

      // to be collected
      const vestingAddress = lucid.utils.validatorToAddress(vestingPolicy);
      const collectUtxos = await lucid.utxosAt(vestingAddress);
      if (!collectUtxos) throw "No UTxO to collect from!";

      // to be read from
      const scriptAddress = lucid.utils.validatorToAddress(alwaysSucceedScript);
      const utxos = await lucid.utxosAt(scriptAddress);
      if (!utxos) throw "No UTxO to read from!";

      // refTxHash: see setState() above
      const txIn = utxos.find((utxo) => utxo.txHash == refTxHash);
      if (!txIn) throw "No valid hash from read script address!";
      console.log(txIn.datum);

      const tx = await lucid
        .newTx()
        .collectFrom([collectUtxos[0]]) // no redeemer
        .readFrom([txIn])
        .addSignerKey(paymentCredential?.hash!)
        .validFrom(Date.now())
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
    }
  };

  const lockUtxo = async () => {
    if (lucid) {
      const alwaysSucceedAddress =
        lucid.utils.validatorToAddress(alwaysSucceedScript);

      // //const receiving_addr : string = "addr_test1qrp26gyxzq9yys8vhdc2rjfkny34w5976hxzd4t2vgsvvlmczpu3ccwkxq9faer2kt3238ppz9zykwd2yyrt96sz52nqkq2trl"
      // const receiving_addr : string = "addr_test1qryc5tck5kqqs3arcqnl4lplvw5yg2ujsdnhx5eawn9lyzzvpmpraw365fayhrtpzpl4nulq6f9hhdkh4cdyh0tgnjxsg03qnh"
      // const tx = await lucid.newTx()
      //   .payToAddress(receiving_addr, { lovelace: BigInt(2000000) })
      //   .complete();

      // const signedTx = await tx.sign().complete();
      // const txHash = await signedTx.submit();

      // Modified the deposit to include 3 different utxos with different values:
      const tx = await lucid
        .newTx()
        .payToContract(
          alwaysSucceedAddress,
          { inline: Datum() },
          { lovelace: BigInt(100_000000) }
        )
        .payToContract(
          alwaysSucceedAddress,
          { inline: Datum() },
          { lovelace: BigInt(200_000000) }
        )
        .payToContract(
          alwaysSucceedAddress,
          { inline: Datum() },
          { lovelace: BigInt(300_000000) }
        )
        .payToContract(
          alwaysSucceedAddress,
          {
            asHash: Datum(),
            scriptRef: alwaysSucceedScript, // adding plutusV2 script to output
          },
          {}
        )
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
    }
  };

  const redeemUtxo = async () => {
    if (lucid) {
      const alwaysSucceedAddress =
        lucid.utils.validatorToAddress(alwaysSucceedScript);

      /* Modified the unlock to include all the alwaysSucceedAddress utxos: */
      const referenceScriptUtxos = (await lucid.utxosAt(alwaysSucceedAddress))

        /* .find((utxo) => Boolean(utxo.scriptRef)); */
        .filter((utxo) => Boolean(utxo.scriptRef));

      if (!referenceScriptUtxos) throw new Error("Reference script not found");

      /* const utxos = (await lucid.utxosAt(alwaysSucceedAddress)).find( */
      const utxos = (await lucid.utxosAt(alwaysSucceedAddress)).filter(
        (utxo) => utxo.datum === Datum() && !utxo.scriptRef
      );
      if (!utxos) throw new Error("Spending script utxo not found");

      const tx = await lucid
        .newTx()

        // spend utxo by reading plutusV2 from reference utxo
        .collectFrom(utxos, Redeemer())
        .readFrom(referenceScriptUtxos)

        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
    }
  };

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

      {/* connected Wallet Address */}
      <div>Address: {walletStore.address}</div>

      <div className="mx-40 my-10">
        {/* Mint NFT button */}
        <button className="btn m-5" onClick={() => mintNft()}>
          Mint NFT
        </button>

        {/* Deposit button */}
        <button className="btn btn-primary m-5" onClick={() => lockUtxo()}>
          Deposit
        </button>

        {/* Unlock button */}
        <button className="btn btn-secondary m-5" onClick={() => redeemUtxo()}>
          Unlock
        </button>
      </div>
    </div>
  );
};

export default Helios;
