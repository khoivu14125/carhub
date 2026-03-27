import React from 'react';
import { Mail, Phone, MapPin, Globe, Send, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-blue-500">CarHub</h3>
          <p className="text-gray-400 leading-relaxed">
            Nền tảng mua bán xe trực tuyến hàng đầu Việt Nam. Kết nối người mua và người bán với sự tin tưởng tuyệt đối.
          </p>
          <div className="flex space-x-4">
            <Globe className="text-gray-500 hover:text-blue-500 cursor-pointer transition" />
            <MessageCircle className="text-gray-500 hover:text-pink-500 cursor-pointer transition" />
            <Send className="text-gray-500 hover:text-blue-400 cursor-pointer transition" />
          </div>
        </div>

        {/* Cột 2: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Liên kết nhanh</h4>
          <ul className="space-y-3 text-gray-400">
            <li><a href="/inventory" className="hover:text-blue-400 transition">Danh sách xe</a></li>
            <li><a href="/register" className="hover:text-blue-400 transition">Đăng tin bán xe</a></li>
            <li><a href="/" className="hover:text-blue-400 transition">Chính sách bảo mật</a></li>
            <li><a href="/" className="hover:text-blue-400 transition">Điều khoản sử dụng</a></li>
          </ul>
        </div>

        {/* Cột 3: Dịch vụ khách hàng */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Hỗ trợ</h4>
          <ul className="space-y-3 text-gray-400">
            <li>Trung tâm trợ giúp</li>
            <li>Quy trình thanh toán</li>
            <li>Giải quyết tranh chấp</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Thông tin liên hệ</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-blue-500" />
              <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-blue-500" />
              <span>support@carhub.com</span>
            </li>
            <li className="flex items-center space-x-3 text-sm">
              <MapPin size={18} className="text-blue-500 shrink-0" />
              <span>Khu công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
        <p>© 2026 CarHub Project. All Rights Reserved. Designed for Modern Excellence.</p>
      </div>
    </footer>
  );
};

export default Footer;