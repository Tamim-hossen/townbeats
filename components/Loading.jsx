'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {assets} from '@/assets/assets';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // Simulating loading time
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
         <div className="flex items-center justify-center h-screen w-screen bg-white">
      <motion.div
        initial={{ filter: 'grayscale(100%)',  opacity: 0 }}
        animate={{ filter: 'grayscale(0%)',  opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >

<Image 
          src={assets.black_icon}
          alt="Loading Image" 
          className="w-52 h-auto object-cover" 
        />
        </motion.div>
        
      {loading && (
        <motion.div
          className="absolute inset-0 bg-white mix-blend-multiply"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      )}
    </div>
    </div>
   
  );
}
