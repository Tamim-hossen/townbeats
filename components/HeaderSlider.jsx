import React, { useEffect, useState } from 'react';
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const HeaderSlider = () => {
  const {router} = useAppContext()
  const sliderData = [
    {
      id: 1,
      title: "Experience Latest Style - Your Perfect Outfit Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_image_1,
    },
    {
      id: 2,
      title: "All The Craze - Find What You Need!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_image_2,
    },
  ];
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
        
            const element = document.getElementById('scroll-to-appear-4');
            if (element) observer.observe(element);
        
            return () => {
              if (element) observer.unobserve(element);
            };
          }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div id="scroll-to-appear-4" className={`transition-all duration-700 ${isVisible ? 'animate-slide-up' : 'opacity-0'} overflow-hidden relative w-full`}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            {slide.id === 1 ? (<div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-[#000000] pb-1">Trendy</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-black rounded-lg text-white" onClick={()=> router.push('/all-products')}>
                    Explore
                    <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
                </button>
              </div>
            </div>) :(<div className="flex items-center flex-1 justify-start">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>)}
            {slide.id === 1 ? (<div className="flex items-center flex-1 justify-end ">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>) :(<div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-[#000000] pb-1">WEAR YOU</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-black rounded-lg text-white" onClick={()=> router.push('/all-products')}>
                    Explore
                    <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
                </button>
              </div>
            </div>)}
            
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-[#000000]" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
