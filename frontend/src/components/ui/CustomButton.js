import React from 'react';
import { motion } from 'framer-motion';

const CustomButton = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", // primary, outline, danger
  className = "",
  disabled = false,
  icon: Icon = null
}) => {
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]",
    outline: "border-2 border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 
        px-6 py-3 rounded-xl font-bold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${className}
      `}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
};

export default CustomButton;