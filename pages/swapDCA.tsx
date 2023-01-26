import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SwapDCA from "../components/SwapDCA";
import { NextPage } from "next";

const swapDCA: NextPage = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <SwapDCA />
    </div>
  );
};

export default swapDCA;
