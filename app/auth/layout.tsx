import Link from 'next/link'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import Footer from '../../components/ui/landing/footer';
import Header from '../../components/ui/landing/header';

interface IProps {
  children: React.ReactNode
}

const layout = ({ children }: IProps) => {
  return (
    <div className='flex flex-col '>
      <Toaster />
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default layout