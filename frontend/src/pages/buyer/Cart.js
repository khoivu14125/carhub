import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import cartService from '../../services/cartService';
import CustomButton from '../../components/ui/CustomButton';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cartService.getCart());
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartService.removeFromCart(id);
    setCartItems(updatedCart);
  };

  const handleClearCart = () => {
    cartService.clearCart();
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <ShoppingCart size={56} className="mx-auto text-gray-600 mb-4" />
        <h1 className="text-3xl font-bold mb-3">Giỏ hàng đang trống</h1>
        <p className="text-gray-500 mb-6">Bạn chưa thêm xe nào vào giỏ hàng.</p>
        <Link to="/inventory">
          <CustomButton>Tiếp tục xem xe</CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
        <button
          onClick={handleClearCart}
          className="text-red-400 hover:text-red-500 transition"
        >
          Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex gap-4"
            >
              <img
                src={item.images?.split(',')[0]}
                alt={item.model_name}
                className="w-36 h-24 object-cover rounded-xl border border-gray-800"
              />

              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {item.brand} {item.model_name}
                </h3>
                <p className="text-blue-400 font-semibold mt-2">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.price)}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Người bán: {item.seller_name || 'Chưa có'}
                </p>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition self-start"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>

          <div className="flex justify-between text-gray-400">
            <span>Số xe</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t border-gray-800 pt-4">
            <span>Tổng tiền</span>
            <span className="text-blue-400">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(totalPrice)}
            </span>
          </div>

          <CustomButton
            onClick={() => navigate('/checkout')}
            className="w-full h-14 text-lg"
          >
            Tiến hành đặt hàng
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Cart;