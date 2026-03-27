import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import carService from '../../services/carService';
import cartService from '../../services/cartService';
import viewingRequestService from '../../services/viewingRequestService';
import Loader from '../../components/ui/Loader';
import CustomButton from '../../components/ui/CustomButton';
import {
  Phone,
  User,
  ShoppingCart,
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Shield,
} from 'lucide-react';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const [requestForm, setRequestForm] = useState({
    full_name: '',
    phone_number: '',
    preferred_time: '',
    message: '',
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';
  const isAdmin = user?.role === 'admin';

  // Nếu field owner trong dữ liệu của bạn không phải seller_id thì đổi lại cho đúng:
  const isOwner =
    user?.id === car?.seller_id ||
    user?.id === car?.user_id ||
    user?.id === car?.sellerId;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await carService.getCarById(id);
        setCar(data);
        setSelectedImage(data?.images?.split(',')[0] || '');

        setRequestForm((prev) => ({
          ...prev,
          full_name: user?.name || '',
          phone_number: user?.phone || '',
        }));
      } catch (err) {
        console.error('Lỗi lấy chi tiết xe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleAddToCart = () => {
    if (!token) {
      alert('Bạn cần đăng nhập để thêm xe vào giỏ hàng');
      navigate('/login', { state: { from: `/car/${id}` } });
      return;
    }

    if (!isBuyer) {
      alert('Chỉ người mua mới có thể thêm xe vào giỏ hàng');
      return;
    }

    if (!car) return;

    const result = cartService.addToCart(car);
    alert(result.message);

    if (result.success) {
      navigate('/cart');
    }
  };

  const handleOpenViewingRequest = () => {
    if (!token) {
      alert('Bạn cần đăng nhập để gửi yêu cầu xem xe');
      navigate('/login', { state: { from: `/car/${id}` } });
      return;
    }

    if (!isBuyer) {
      alert('Chỉ người mua mới có thể gửi yêu cầu xem xe');
      return;
    }

    setShowRequestModal(true);
  };

  const handleCloseViewingRequest = () => {
    setShowRequestModal(false);
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitViewingRequest = async (e) => {
    e.preventDefault();

    if (!requestForm.full_name || !requestForm.phone_number || !requestForm.preferred_time) {
      alert('Vui lòng nhập đầy đủ họ tên, số điện thoại và thời gian muốn xem xe');
      return;
    }

    try {
      setSubmittingRequest(true);

      await viewingRequestService.createRequest({
        car_id: car.id,
        full_name: requestForm.full_name,
        phone_number: requestForm.phone_number,
        preferred_time: requestForm.preferred_time,
        message: requestForm.message,
      });

      alert('Đã gửi yêu cầu xem xe thành công');
      setShowRequestModal(false);
      setRequestForm((prev) => ({
        ...prev,
        preferred_time: '',
        message: '',
      }));
    } catch (err) {
      console.error('Lỗi gửi yêu cầu xem xe:', err);
      alert(err.response?.data?.message || 'Không thể gửi yêu cầu xem xe');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleEditCar = () => {
    navigate(`/seller/edit-car/${car.id}`);
  };

  const handleAdminManage = () => {
    navigate('/admin/approve-cars');
  };

  if (loading) return <Loader />;
  if (!car) return <div className="text-center py-20 text-2xl">Không tìm thấy xe</div>;

  const imageList = car.images ? car.images.split(',') : [];
  const currentImageIndex = imageList.findIndex((img) => img === selectedImage);

  const handlePrevImage = () => {
    if (imageList.length === 0) return;
    const prevIndex = currentImageIndex <= 0 ? imageList.length - 1 : currentImageIndex - 1;
    setSelectedImage(imageList[prevIndex]);
  };

  const handleNextImage = () => {
    if (imageList.length === 0) return;
    const nextIndex = currentImageIndex >= imageList.length - 1 ? 0 : currentImageIndex + 1;
    setSelectedImage(imageList[nextIndex]);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative group overflow-hidden rounded-2xl border border-gray-800 shadow-lg">
            <img
              src={selectedImage || imageList[0]}
              alt={car.model_name}
              className="w-full rounded-2xl transition duration-500 group-hover:scale-[1.02]"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-blue-600 hover:scale-110 text-white flex items-center justify-center border border-white/10 transition"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-blue-600 hover:scale-110 text-white flex items-center justify-center border border-white/10 transition"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            {imageList.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${car.model_name}-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`h-24 w-full object-cover rounded-lg cursor-pointer transition duration-300 hover:scale-105 ${
                  selectedImage === img
                    ? 'border-2 border-blue-500 opacity-100 shadow-[0_0_12px_rgba(37,99,235,0.45)]'
                    : 'border border-gray-800 hover:opacity-80'
                }`}
              />
            ))}
          </div>
        </div>

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

          <div className="p-6 bg-[#111111] rounded-2xl border border-gray-800 space-y-4 hover:border-blue-500/30 transition">
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

          <div className="p-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl space-y-4 hover:border-blue-400/50 transition">
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
              {isBuyer && (
                <>
                  <button
                    onClick={handleOpenViewingRequest}
                    className="h-14 rounded-xl flex items-center justify-center gap-2 font-semibold bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white transition duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    <CalendarDays size={18} />
                    Gửi yêu cầu xem xe
                  </button>

                  <CustomButton
                    onClick={handleAddToCart}
                    className="h-14 text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition duration-300"
                  >
                    <ShoppingCart size={18} />
                    Thêm vào giỏ hàng
                  </CustomButton>
                </>
              )}

              {isSeller && isOwner && (
                <button
                  onClick={handleEditCar}
                  className="sm:col-span-2 h-14 rounded-xl flex items-center justify-center gap-2 font-semibold bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white transition duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  <Pencil size={18} />
                  Chỉnh sửa tin đăng
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={handleAdminManage}
                  className="sm:col-span-2 h-14 rounded-xl flex items-center justify-center gap-2 font-semibold bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] text-white transition duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  <Shield size={18} />
                  Quản lý tin đăng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-xl bg-[#111111] border border-gray-800 rounded-3xl p-6 relative shadow-2xl animate-fade-in">
            <button
              onClick={handleCloseViewingRequest}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:rotate-90 transition duration-300"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Gửi yêu cầu xem xe</h2>
            <p className="text-gray-400 mb-6">
              Điền thông tin để gửi yêu cầu xem xe đến người bán.
            </p>

            <form onSubmit={handleSubmitViewingRequest} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Họ và tên</label>
                <input
                  type="text"
                  name="full_name"
                  value={requestForm.full_name}
                  onChange={handleRequestChange}
                  className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Số điện thoại</label>
                <input
                  type="text"
                  name="phone_number"
                  value={requestForm.phone_number}
                  onChange={handleRequestChange}
                  className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Thời gian muốn xem xe</label>
                <input
                  type="datetime-local"
                  name="preferred_time"
                  value={requestForm.preferred_time}
                  onChange={handleRequestChange}
                  className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Lời nhắn</label>
                <textarea
                  name="message"
                  rows="4"
                  value={requestForm.message}
                  onChange={handleRequestChange}
                  placeholder="Bạn có thể để lại lời nhắn cho người bán (không bắt buộc)"
                  className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="pt-2">
                <CustomButton
                  type="submit"
                  className="w-full h-14 text-lg hover:scale-[1.01] transition duration-300"
                  disabled={submittingRequest}
                >
                  {submittingRequest ? 'Đang gửi...' : 'Xác nhận gửi yêu cầu'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CarDetail;