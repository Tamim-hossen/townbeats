'use client'
import React, { useEffect, useState } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";



const Home = () => {
  const [loading,setLoading] = useState(true)
useEffect(()=>{
  setTimeout(()=> {setLoading(false)},6000)
},[])
  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50 bg-opacity-95 bg-white">
    <Navbar/>
    </div>
      
      <div className="absolute top-16 md:top-20 left-0 right-0">
      <HeaderSlider />
      {loading? <Loading/>:<div className="px-6 md:px-16 lg:px-32">
        <FeaturedProduct />
        <HomeProducts />
        <Banner />
        <NewsLetter />
      </div>}
      <Footer />
      </div>
      
    </>
  );
};

export default Home;
