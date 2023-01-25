import Link from 'next/link'
import WalletConnect from './WalletConnect'
import {FiMenu} from 'react-icons/fi'

const Navbar = () => {
  return (
    <div className='bg-[#09031B] fixed top-0 w-[100%] z-10'>
        <div className='container mix-auto flex justify-between items-center py-3 px-4 text-[#e9ecea]'>
            <div><img src='/logo1.jpg' alt='logo' /></div> 
            <div className='hidden md:flex gap-6'>
                <Link href='/'><a className= 'hover:text-[#ff4D41]'>Home</a></Link>
                <Link href='/aboutUs'><a className= 'hover:text-[#ff4D41]'>About us</a></Link>
                <Link href='/offchain'><a className= 'hover:text-[#ff4D41]'>Offchain</a></Link>
                <Link href='/openDCA'><a className= 'hover:text-[#ff4D41]'>Open DCA</a></Link>
                <Link href='/swapDCA'><a className= 'hover:text-[#ff4D41]'>Swap DCA</a></Link>
                <Link href='/portfolio'><a className= 'hover:text-[#ff4D41]'>Portfolio</a></Link>
            </div>
            <a className='hidden md:flex border border-[#ff4D41] px-2 py-2 bg-[#ffffff] text-[#ff4D41] rounded-[5px] items-center gap-2 font-bold hover:bg-[#ff4D41] hover:text-white transition duration-200'>
                <WalletConnect />
            </a> 
            <div className='md:hidden text-[24px]'>
                <FiMenu />
            </div>
        </div>
    </div>  
  )
}

export default Navbar