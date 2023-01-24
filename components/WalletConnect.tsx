import { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from "../utils/store";
import initLucid from "../utils/lucid";
import { getAssets } from "../utils/cardano";


const WalletConnect = () => {
    // const [availableWallets, setAvailableWallets] = useState<string[]>([])
    const walletStore = useStoreState(state => state.wallet)
    const setWallet = useStoreActions(actions => actions.setWallet)
    const availableWallets = useStoreState(state => state.availableWallets)
    const setAvailableWallets = useStoreActions(actions => actions.setAvailableWallets)
    
    const [connectedAddress, setConnectedAddress] = useState("")
    
    const loadWalletSession = async () => {
        if (walletStore.connected &&
            walletStore.name &&
            window.cardano &&
            (await window.cardano[walletStore.name.toLowerCase()].enable())
        ) {
            walletConnected(walletStore.name)

        }
    }

    const walletConnected = async (wallet: string, connect: boolean = true) => {
        const addr = connect ? await (await initLucid(wallet)).wallet.address() : ''
        const walletStoreObj = connect ? { connected: true, name: wallet, address: addr } : { connected: false, name: '', address: '' }
        setConnectedAddress(addr)
        setWallet(walletStoreObj)
    }

    const selectWallet = async (wallet: string) => {
        if (
            window.cardano &&
            (await window.cardano[wallet.toLocaleLowerCase()].enable())
        ) {
            walletConnected(wallet)
        }
    }

    useEffect(() => {
        let wallets = []
        if (window.cardano) {
            if (window.cardano.nami) wallets.push('Nami')
            if (window.cardano.eternl) wallets.push('Eternl')
            if (window.cardano.flint) wallets.push('Flint')
            loadWalletSession()
        }
        setAvailableWallets(wallets)
    }, [])
  
  
    useEffect(() => {
      if (walletStore.address != "") {
        getAssets(walletStore.address)
      }
    }, [walletStore.address]);

    const disconnectWallet = async (wallet: string) => {
        let walletIsEnabled = false;
        if (
            window.cardano &&
           await window.cardano[wallet].isEnabled()
        ) {
            console.log("wallet is connected")
        } else {console.log("Disconnected")
}
    }
 disconnectWallet(walletStore.name)

 const checkIfWalletEnabled = async () => {
    let walletIsEnabled = false;

    try {
        const walletName = walletStore.name;
        walletIsEnabled = await window.cardano[walletName].isEnabled();

    } catch (err) {
        console.log(err)
    }
    this.setState({walletIsEnabled});

    return walletIsEnabled;
}

    return (
        <>
            <div className="dropdown dropdown-end">
                <label tabIndex={0}>{connectedAddress != "" 
                ?
                <>
                <div className='w-[150px]'><span className='truncate block'>${walletStore.address}</span></div> 
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-100">
                    <li onClick={() => {}}><a>{walletStore.address} DISCONNECT</a></li>
                </ul>
                </>
                :
                <div>CONNECT<ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52">
                    {availableWallets.map((wallet) =>
                        <li key={wallet} onClick={() => { selectWallet(wallet) }} ><a>{wallet}</a></li>
                    )}
                </ul>
                </div>}
                </label>
            </div>
        </>
    )
}

export default WalletConnect;