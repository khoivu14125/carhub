import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      } catch (error) {
        console.error('Lỗi lấy profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await userService.updateProfile(profileData);
      setMessage(res.message || 'Cập nhật thông tin thành công');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    try {
      const res = await userService.changePassword(passwordData);
      setPasswordMessage(res.message || 'Đổi mật khẩu thành công');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold text-white">Trang cá nhân</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cập nhật thông tin */}
        <form
          onSubmit={handleUpdateProfile}
          className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-white">Cập nhật thông tin</h2>

          <div>
            <label className="block text-gray-400 mb-2">Tên</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
            />
          </div>

          {message && <p className="text-sm text-blue-400">{message}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition"
          >
            Lưu thay đổi
          </button>
        </form>

        {/* Đổi mật khẩu */}
        <form
          onSubmit={handleChangePassword}
          className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-white">Đổi mật khẩu</h2>

          <div>
            <label className="block text-gray-400 mb-2">Mật khẩu hiện tại</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
            />
          </div>

          {passwordMessage && <p className="text-sm text-blue-400">{passwordMessage}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;