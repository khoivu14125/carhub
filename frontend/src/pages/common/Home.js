import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';
import CustomButton from '../../components/ui/CustomButton';
import carService from '../../services/carService';
import CarCard from '../../components/ui/CarCard';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getCars();
        setCars(data.slice(0, 6));
      } catch (err) {
        console.error('Lỗi lấy dữ liệu xe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-['Inter']">
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut' }}
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
            alt="Artistic Supercar"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.3em] uppercase bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400">
              Kỷ nguyên mới của tốc độ
            </span>

            <h1 className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tight">
              KHÁM PHÁ <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-200 to-white italic">
                SỰ KIỆT TÁC
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1.5 }}
                />
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Trải nghiệm nền tảng giao dịch siêu xe hạng sang <br className="hidden md:block" />
              với tiêu chuẩn thẩm mỹ và công nghệ hàng đầu Việt Nam.
            </p>

          </motion.div>
        </div>

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() =>
            document.getElementById('inventory-section')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-12 bg-linear-to-b from-blue-500 to-transparent"
          />
        </div>
      </section>

      <section id="inventory-section" className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter">Bộ sưu tập nổi bật</h2>
            <div className="h-1 w-20 bg-blue-600" />
          </div>

          <Link to="/inventory" className="text-blue-400 hover:text-blue-300 text-sm font-bold transition">
            XEM TẤT CẢ XE →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white/5 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cars.length > 0 ? (
              cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl">
                <p className="text-gray-500 italic text-lg">
                  Kho xe đang được cập nhật. Vui lòng quay lại sau!
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;