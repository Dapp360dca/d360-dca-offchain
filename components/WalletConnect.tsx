import { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "../utils/store";
import initLucid from "../utils/lucid";
import { getAccounts } from "../utils/cardano";
import { CopyToClipboard } from "react-copy-to-clipboard";

const WalletConnect = () => {
  // const [availableWallets, setAvailableWallets] = useState<string[]>([])
  const walletStore = useStoreState((state) => state.wallet);
  const setWallet = useStoreActions((actions) => actions.setWallet);
  const availableWallets = useStoreState((state) => state.availableWallets);
  const setAvailableWallets = useStoreActions(
    (actions) => actions.setAvailableWallets
  );
  // const clearStore = useStoreState((state) => state.wallet);

  const [connectedAddress, setConnectedAddress] = useState("");

  const [copied, setCopied] = useState(false);

  const loadWalletSession = async () => {
    if (
      walletStore.connected &&
      walletStore.name &&
      window.cardano &&
      (await window.cardano[walletStore.name.toLowerCase()].enable())
    ) {
      walletConnected(walletStore.name);
    }
  };

  const walletConnected = async (wallet: string, connect: boolean = true) => {
    const addr = connect
      ? await (await initLucid(wallet)).wallet.address()
      : "";
    const walletStoreObj = connect
      ? { connected: true, name: wallet, address: addr }
      : { connected: false, name: "", address: "" };
    setConnectedAddress(addr);
    setWallet(walletStoreObj);
  };

  const disconnectWallet = async (wallet: string, connect: boolean = false) => {
    const addr = connect
      ? await (await initLucid(wallet)).wallet.address()
      : "";
    const walletStoreObj = connect
      ? { connected: true, name: wallet, address: addr }
      : { connected: false, name: "", address: "" };
    setConnectedAddress(addr);
    setWallet(walletStoreObj);
  };

  const selectWallet = async (wallet: string) => {
    if (
      window.cardano &&
      (await window.cardano[wallet.toLocaleLowerCase()].enable())
    ) {
      walletConnected(wallet);
    }
  };

  useEffect(() => {
    let wallets = [];
    if (window.cardano) {
      if (window.cardano.nami) wallets.push("Nami");
      if (window.cardano.eternl) wallets.push("Eternl");
      if (window.cardano.flint) wallets.push("Flint");
      loadWalletSession();
    }
    setAvailableWallets(wallets);
  }, []);

  useEffect(() => {
    if (walletStore.address != "") {
      getAccounts(walletStore.address);
    }
  }, [walletStore.address]);

  const clearState = async () => {
    if (walletStore.connected) {
      disconnectWallet(walletStore.name);
    }
  };

  return (
    <>
      <div className="dropdown dropdown-end">
        <label tabIndex={0}>
          {connectedAddress != "" ? (
            <>
              <div className="w-[150px]">
                <span className="truncate block">${walletStore.address}</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-100"
              >
                <li onClick={() => {}}>
                  <div className="menu p-2 h-[100] w-[100]">
                    {/* <li> */}
                    {/* <a className="text-white"> */}
                    {walletStore.address}
                    {/* </a> */}
                    <CopyToClipboard text={walletStore.address}>
                      <span
                        onClick={() => {
                          setCopied(true);
                        }}
                        data-tooltip-target="tooltip-top"
                        className="flex flex-col justify-center items-center"
                      >
                        <div className="bg-white text-[#021639] rounded-[5px] px-2 py-2 hover:text-[#ff4D41]">
                          copy address
                        </div>
                      </span>
                    </CopyToClipboard>
                    {copied ? (
                      <span data-tooltip-target="tooltip-top"></span>
                    ) : null}
                    {/* </li> */}
                    <div
                      onClick={() => {
                        clearState();
                      }}
                      className="bg-white text-[#ff4D41] rounded-[5px] px-2 py-2 hover:text-[#021639]"
                    >
                      {/* <a> */}
                      DISCONNECT
                      {/* </a> */}
                    </div>
                  </div>
                </li>
              </ul>
            </>
          ) : (
            <div>
              CONNECT
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52"
              >
                {availableWallets.map((wallet) => (
                  <li
                    key={wallet}
                    onClick={() => {
                      selectWallet(wallet);
                    }}
                  >
                    {/* <a> */}
                    {wallet}
                    {/* </a> */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </label>
      </div>
    </>
  );
};

export default WalletConnect;
