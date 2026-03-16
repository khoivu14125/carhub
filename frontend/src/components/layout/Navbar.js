import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  ClipboardCheck,
  Users,
  UserCircle
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-blue-900/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] transition-all">
            <Car className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CarHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* MENU DÀNH CHO BUYER */}
          {(!token || role === 'buyer') && (
            <Link to="/inventory" className="hover:text-blue-400 transition-colors">
              Mua xe
            </Link>
          )}

          {/* MENU DÀNH CHO SELLER */}
          {role === 'seller' && (
            <div className="flex items-center space-x-6 border-l border-gray-800 pl-6">
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                <LayoutDashboard size={18} /> Thống kê
              </Link>
              <Link
                to="/seller/post-car"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <PlusCircle size={18} /> Đăng tin
              </Link>
              <Link to="/seller/manage-cars" className="hover:text-blue-400">
                Quản lý xe
              </Link>
            </div>
          )}

          {/* MENU DÀNH CHO ADMIN */}
          {role === 'admin' && (
            <div className="flex items-center space-x-6 border-l border-gray-800 pl-6">
              <Link to="/admin/dashboard" className="text-red-400 hover:text-red-300">
                Dashboard
              </Link>
              <Link
                to="/admin/approve-cars"
                className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400"
              >
                <ClipboardCheck size={18} /> Duyệt xe
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-1 hover:text-blue-400"
              >
                <Users size={18} /> Người dùng
              </Link>
            </div>
          )}

          {/* Auth Actions */}
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-6">
            {token ? (
              <>
                {/* Chỉ buyer mới có giỏ hàng */}
                {role === 'buyer' && (
                  <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-full transition">
                    <ShoppingCart size={20} />
                    <span className="absolute top-0 right-0 bg-blue-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                       {JSON.parse(localStorage.getItem('cart') || '[]').length}
                    </span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 bg-gray-900 p-1 pr-3 rounded-full border border-gray-800">
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                   <Link to="/profile"
                         className="text-gray-300 hover:text-blue-400 transition flex items-center gap-1"
                         title="Trang cá nhân"
                  >  
                         <UserCircle size={18} />
                    </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-blue-400 transition">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-medium transition shadow-lg shadow-blue-900/20"
                >
                  Tham gia
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-blue-900/30 px-4 py-6 space-y-4">
          {/* BUYER */}
          {(!token || role === 'buyer') && (
            <Link
              to="/inventory"
              className="block text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Mua xe
            </Link>
          )}

          {/* SELLER */}
          {role === 'seller' && (
            <>
              <Link
                to="/seller/dashboard"
                className="block text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Thống kê
              </Link>
              <Link
                to="/seller/post-car"
                className="block text-emerald-400 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                + Đăng tin mới
              </Link>
              <Link
                to="/seller/manage-cars"
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                Quản lý xe
              </Link>
            </>
          )}

          {/* ADMIN */}
          {role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                className="block text-red-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/approve-cars"
                className="block text-yellow-500 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Duyệt tin bán xe
              </Link>
              <Link
                to="/admin/users"
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                Người dùng
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-gray-800">
            {token ? (
              <button onClick={handleLogout} className="text-red-500 font-bold">
                Đăng xuất
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-blue-500 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;