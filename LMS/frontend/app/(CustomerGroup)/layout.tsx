import Header from '@/app/components/Header'
import React, { ReactNode } from 'react'
import Footer from '../components/Footer'

const CustomerLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='min-h-screen flex flex-col'>
        <Header />
        <div className='grow mb-10 lg:mb-20'>
            {children}
        </div>
        
        <div className='w-full dark:bg-section-dark bg-section-light'>

        <Footer />
        </div>
    </div>
  )
}

export default CustomerLayout