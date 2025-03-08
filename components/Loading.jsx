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
    <div className="flex items-center justify-center h-[100%] w-[100%] bg-white">
      <div className="flex items-center justify-center h-96 w-80 bg-transparent relative">
        <motion.div
          initial={{
            opacity: 1,
            clipPath: 'inset(100% 0 0 0)', 
          }}
          animate={{
            opacity: 1,
            clipPath: 'inset(0% 0 0 0)',
          }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: 1, repeatType:'reverse' }}
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
            initial={{ y: 0 }}
            animate={{ y: -100 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  );
}
