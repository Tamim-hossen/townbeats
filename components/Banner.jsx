import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Banner = () => {
  const {router} =useAppContext()
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56"
        src={assets.header_image_1}
        alt="header_image_1"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Level Up Your Clothing
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          Everything you need. All in one place.
        </p>
        <button onClick={()=> router.push('/all-products')} className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-black rounded text-white">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className=" max-w-80 mt-10 md:mt-0"
        src={assets.banner_image}
        alt="banner_image"
      />
    </div>
  );
};

export default Banner;