import React from 'react'
import Typewriter from 'typewriter-effect'
import styles from '../styles/Home.module.css'

const Hero = () => {
  return (
    <div className="flex bg-[image:url('/bg.jpg')] bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full items-center">
        <div>
            <img className='w-[300px] absolute inset-y-5 right-0' src='/insideU.jpg' alt='Hero img' />
        </div>
        <div>
            <img className='w-[150px] absolute bottom-0 right-0' src='/insideD.jpg' alt='Hero img2'/>
        </div>
    <div className='max-w-[450px] text-white flex flex-col gap-[40px] px-4'>
                <div>
                <h1 className='text-5xl text-[#ff4D41]'>Swap Your Tokens Without Stress</h1>
                </div>
                <div className={styles.card}>
                <h1 className='text-2xl hover:text-white'>Welcome to the DCA Swap platform, where swapping your token to ADA, the native
                    token of Cardano is made easy and smooth
                </h1>
                </div>
                <div>
                <h1 className='text-2xl mt-3 text-[#ff4D41]'>
                <p className='text-[#ffffff]'>What You Can Do:</p>
                <Typewriter
                options={{
                    strings: [
                        "Connect your wallet",
                        "Open DCA",
                        "Swap DCA",
                        "Harvest DCA",
                        "Close DCA",
                        "Refile DCA"
                    ],
                    autoStart: true,
                    loop: true
                }} />
                </h1>
            </div>    
            </div>

    </div>
  )
}

export default Hero