import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Address from '../components/Address'
import SwapDCA from '../components/SwapDCA'

const swapDCA = () => {
  return (
    <div className="flex bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full items-center">
    <Header />
    <Navbar/>
    <Address />
    <SwapDCA />
    </div>
  )
}

export default swapDCA