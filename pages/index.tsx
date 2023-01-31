import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Header from "../components/Header";

const Home: NextPage = () => {
  return ( 
    <div>
      <Header />
      <Navbar /> 
      <Hero />
    </div>
  );
};

export default Home;
