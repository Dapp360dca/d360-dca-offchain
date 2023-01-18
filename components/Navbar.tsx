import Link from 'next/link'
import React from 'react'
import styles from '../styles/Home.module.css'

const Navbar = () => {
  return (
    <div className='bg-[#141A2A] fixed top-0 w-[100%] z-10'>
        <div className='container mix-auto flex justify-between py-3 px-4 text-[#9ca3af]'>
            <div><img src='/logo1.jpg' alt='logo' /></div> 
            <div className='hidden md:flex gap-6'>
                <Link className='hover:text-[ff4D41]' href='/'>Home</Link>
                <Link href='/about' className='hover:text-[#ff4D41]'>About</Link>
                <Link href='/openDCA' className='hover:text-[#ff4D41]'>Open DCA</Link>
                <Link href='/swapDCA' className='hover:text-[#ff4D41]'>Swap DCA</Link>
                <Link href='/portfolio' className='hover:text-[#ff4D41]'>Portfolio</Link>
            </div>
            <div className='hidden absolute right-9  md:flex border border-[#ff4D41] px-3 py-1 bg-[#ffffff] text-[#ff4D41] rounded-[5px] gap-2 font-bold hover:bg-[#ff4D41] hover:text-white transition duration-200'>
                Connect
            </div>
        </div>
    </div>  
  )
}

export default Navbar