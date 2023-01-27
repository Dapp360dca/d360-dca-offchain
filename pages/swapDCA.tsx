import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SwapDCA from "../components/SwapDCA";
import { NextPage } from "next";

const swapDCA: NextPage = () => {
  return (
    <div className="flex bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full items-center">
    <Header />
    <Navbar/>
    <SwapDCA />
    </div>
  );
};

export default swapDCA;
