import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Calendar, Fuel, ArrowRight } from 'lucide-react';

const CarCard = ({ car }) => {
  // Hàm xử lý hiển thị giá tiền VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Lấy ảnh đầu tiên từ chuỗi images (ngăn cách bởi dấu phẩy)
  const mainImage = car.images ? car.images.split(',')[0] : 'https://via.placeholder.com/400x250';

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-[#111111] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={mainImage} 
          alt={`${car.brand} ${car.model_name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
          {car.year}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {car.brand} {car.model_name}
        </h3>
        
        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-blue-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel size={14} className="text-blue-500" />
            <span>Xăng/Dầu</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={14} className="text-blue-500" />
            <span>0 km</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <span className="text-blue-500 font-bold text-lg">
            {formatPrice(car.price)}
          </span>
          <Link 
            to={`/car/${car.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-white hover:text-blue-400 transition-colors"
          >
            Chi tiết <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;