
import React, { useEffect, useState } from 'react';
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const { featuredproducts,addToCart,router } = useAppContext();
  let products=featuredproducts
  if(products.length>3){
    products = products.slice(0,3)
  }
  const [isVisible, setIsVisible] = useState(false);
      useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
              setIsVisible(true); 
            }
          },
          { threshold: 0.25 } 
        );
    
        const element = document.getElementById('scroll-to-appear-2');
        if (element) observer.observe(element);
    
        return () => {
          if (element) observer.unobserve(element);
        };
      }, []);

  return (
    <div id="scroll-to-appear-2" className={`transition-all duration-700 ${isVisible ? 'animate-slide-up' : 'opacity-0'} mt-14`}>
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-[#c5af9a] mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ _id, image, name }) => (
          <div key={_id} className="cursor-pointer flex relative group" onClick={() => { router.push('/product/' + _id); scrollTo(0, 0) }}>
            <Image
              src={image[image.length-1]}
              alt={name}
              width={1280}
              height={700}
              className="group-hover:brightness-50 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              {_id===products[0]._id ? <p className="font-medium text-xl lg:text-2xl">Elegant</p> :
               _id===products[1]._id ? <p className="font-medium text-xl lg:text-2xl">Resonable</p> :
               <p className="font-medium text-xl lg:text-2xl">Trendy</p>}
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {name}
              </p>
              <button className="flex items-center gap-1.5 bg-black px-4 py-2 text-white rounded hover:scale-[1.03] transition" onClick={() => { addToCart(_id); router.push('/cart') }}>
                Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
