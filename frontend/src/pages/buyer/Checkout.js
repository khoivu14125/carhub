import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../../services/cartService';
import CustomButton from '../../components/ui/CustomButton';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    paymentMethod: 'momo',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const cart = cartService.getCart();
    setCartItems(cart);

    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalCarPrice = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const depositAmount = Math.round(totalCarPrice * 0.1);
  const remainingAmount = totalCarPrice - depositAmount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.phone_number || !formData.address) {
      alert('Vui lòng nhập đầy đủ thông tin mua hàng');
      return;
    }

    const orderDraft = {
      items: cartItems,
      buyerInfo: formData,
      totalCarPrice,
      depositAmount,
      remainingAmount,
      paymentType: 'deposit_10_percent',
    };

    localStorage.setItem('checkoutDraft', JSON.stringify(orderDraft));

    alert('Đã lưu thông tin đặt cọc. Bước thanh toán MoMo sẽ dùng số tiền cọc 10%.');
    navigate('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form
        onSubmit={handleSubmitOrder}
        className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold">Thông tin mua hàng</h1>

        <div>
          <label className="block text-gray-400 mb-2">Họ và tên</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Số điện thoại</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Địa chỉ</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Phương thức thanh toán</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          >
            <option value="momo">MoMo</option>
          </select>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
          Bạn chỉ cần <span className="text-yellow-400 font-bold">đặt cọc 10%</span> để giữ xe.
          Phần còn lại sẽ thanh toán sau khi hoàn tất giao dịch.
        </div>

        <CustomButton type="submit" className="w-full h-14 text-lg">
          Xác nhận đặt cọc
        </CustomButton>
      </form>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Đơn hàng của bạn</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-gray-800 pb-4">
            <img
              src={item.images?.split(',')[0]}
              alt={item.model_name}
              className="w-28 h-20 object-cover rounded-lg border border-gray-800"
            />
            <div>
              <p className="font-bold">
                {item.brand} {item.model_name}
              </p>
              <p className="text-blue-400">{formatCurrency(item.price)}</p>
            </div>
          </div>
        ))}

        <div className="space-y-3 pt-4">
          <div className="flex justify-between text-gray-400">
            <span>Tổng giá xe</span>
            <span>{formatCurrency(totalCarPrice)}</span>
          </div>

          <div className="flex justify-between text-yellow-400 font-bold text-lg">
            <span>Tiền cọc (10%)</span>
            <span>{formatCurrency(depositAmount)}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Số tiền còn lại</span>
            <span>{formatCurrency(remainingAmount)}</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 text-sm text-gray-500 leading-relaxed">
          Sau khi thanh toán cọc, xe sẽ được giữ cho bạn. Phần còn lại sẽ thanh toán khi hoàn tất giao dịch trực tiếp.
        </div>
      </div>
    </div>
  );
};

export default Checkout;