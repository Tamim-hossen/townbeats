'use client'
import Navbar from '@/components/seller/Navbar'
import React from 'react'
import Footer from '@/components/Footer'
import ProductCard from "@/components/ProductCard";
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/Loading';
import { useState,useEffect } from 'react';

const Layout = ({ children }) => {
    const {products} = useAppContext()
const[loading,setLoading] = useState(true)
let productData = products.slice(0, 5)
useEffect(()=>{
    setTimeout(()=> { setLoading(false)},3000)
},[])
  return (
    <div>
      <Navbar />
      <div className='flex flex-col items-center w-full'>
        {children}
      </div>
      <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16 ">
                    <p className="text-3xl font-medium">Other <span className="font-medium text-black">Products</span></p>
                    <div className="w-28 h-0.5 bg-black mt-2"></div>
                </div>
                {loading ? <Loading/>:<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full px-6 md:px-16 lg:px-32">
                    {productData.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>}
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition" onClick={()=> productData = products.slice(0,10)}>
                    See more
                </button>
            </div>
      <Footer />
    </div>
  )
}

export default Layout