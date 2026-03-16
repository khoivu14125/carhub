import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16">
        {/* Vòng xoay ngoài */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-full h-full border-4 border-blue-500/20 border-t-blue-600 rounded-full"
        />
        {/* Hiệu ứng Glow tâm */}
        <div className="absolute inset-0 m-auto w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
      </div>
      <p className="mt-4 text-gray-400 font-medium animate-pulse">Đang tải dữ liệu CarHub...</p>
    </div>
  );
};

export default Loader;