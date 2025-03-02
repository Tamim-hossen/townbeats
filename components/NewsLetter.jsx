
import React, { useEffect, useState } from 'react';

const NewsLetter = () => {
  const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true); 
          }
        },
        { threshold: 0.5 } 
      );
  
      const element = document.getElementById('scroll-to-appear-next');
      if (element) observer.observe(element);
  
      return () => {
        if (element) observer.unobserve(element);
      };
    }, []);
  return (
    <div id="scroll-to-appear-next" className={`flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14 transition-all duration-700 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
      <h1 className="md:text-4xl text-2xl font-medium">
        Subscribe now & get upto 10% off
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        Subscibe to the newsletter to get updates on latest releases.
      </p>
      <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="text"
          placeholder="Enter your email id"
        />
        <button className="md:px-12 px-8 h-full text-white bg-black border-2 border-black hover:bg-white hover:text-black rounded-md rounded-l-none hover:rounded-l-md transition ease-in-out">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
