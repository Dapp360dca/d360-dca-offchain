import OpenDCA from '../components/OpenDCA'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import type { NextPage } from "next";
import WalletConnect  from '../components/WalletConnect';

const openDCA : NextPage = () => {
  return (
    <>
    <Header />
    <Navbar/>
    <WalletConnect />
    <OpenDCA />
    </>
    )
}

export default openDCA