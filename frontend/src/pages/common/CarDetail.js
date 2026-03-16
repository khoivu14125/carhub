import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import carService from '../../services/carService';
import cartService from '../../services/cartService';
import Loader from '../../components/ui/Loader';
import CustomButton from '../../components/ui/CustomButton';
import { Phone, User, ShoppingCart } from 'lucide-react';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await carService.getCarById(id);
        setCar(data);
        setSelectedImage(data?.images?.split(',')[0] || '');
      } catch (err) {
        console.error('Lỗi lấy chi tiết xe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleAddToCart = () => {
    if (!car) return;

    const result = cartService.addToCart(car);
    alert(result.message);

    if (result.success) {
      navigate('/cart');
    }
  };

  if (loading) return <Loader />;
  if (!car) return <div className="text-center py-20 text-2xl">Không tìm thấy xe</div>;

  const imageList = car.images ? car.images.split(',') : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Cột ảnh */}
      <div>
        <img
          src={selectedImage || imageList[0]}
          alt={car.model_name}
          className="w-full rounded-2xl shadow-lg border border-gray-800"
        />

        <div className="grid grid-cols-4 gap-4 mt-4">
          {imageList.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${car.model_name}-${idx}`}
              onClick={() => setSelectedImage(img)}
              className={`h-24 w-full object-cover rounded-lg cursor-pointer transition ${
                selectedImage === img
                  ? 'border-2 border-blue-500 opacity-100'
                  : 'border border-gray-800 hover:opacity-70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Cột thông tin */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">
          {car.brand} {car.model_name}
        </h1>

        <p className="text-3xl font-bold text-blue-500">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(car.price)}
        </p>

        {/* Thông số kỹ thuật */}
        <div className="p-6 bg-[#111111] rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-xl font-bold border-b border-gray-800 pb-2">
            Thông số kỹ thuật
          </h3>

          {car.specs ? (
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {car.specs}
            </p>
          ) : (
            <p className="text-gray-500 italic">Chưa có thông số kỹ thuật</p>
          )}

          {car.description && (
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-2">Mô tả</h4>
              <p className="text-gray-400 italic leading-relaxed">
                {car.description}
              </p>
            </div>
          )}
        </div>

        {/* Thông tin người bán */}
        <div className="p-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <User size={20} />
            Thông tin người bán
          </h3>

          <div>
            <p className="text-lg font-semibold text-white">
              {car.seller_name || 'Chưa có tên người bán'}
            </p>

            <p className="text-blue-400 flex items-center gap-2 mt-2">
              <Phone size={18} />
              {car.seller_phone || 'Chưa cập nhật số điện thoại'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={car.seller_phone ? `tel:${car.seller_phone}` : '#'}
              className={`h-14 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
                car.seller_phone
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed pointer-events-none'
              }`}
            >
              <Phone size={18} />
              Liên hệ xem xe
            </a>

            <CustomButton
              onClick={handleAddToCart}
              className="h-14 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Thêm vào giỏ hàng
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;