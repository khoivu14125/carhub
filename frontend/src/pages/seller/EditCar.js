import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import carService from '../../services/carService';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    year: '',
    price: '',
    specs: '',
    description: ''
  });

  const [keptImages, setKeptImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const car = await carService.getSellerCarById(id);

        setFormData({
          brand: car.brand || '',
          model_name: car.model_name || '',
          year: car.year || '',
          price: car.price || '',
          specs: car.specs || '',
          description: car.description || ''
        });

        const oldImgs = car.images ? car.images.split(',') : [];
        setKeptImages(oldImgs);
      } catch (error) {
        console.error('Lỗi lấy bài đăng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveOldImage = (imgToRemove) => {
    setKeptImages((prev) => prev.filter((img) => img !== imgToRemove));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewImages((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const submitData = new FormData();

      submitData.append('brand', formData.brand);
      submitData.append('model_name', formData.model_name);
      submitData.append('year', formData.year);
      submitData.append('price', formData.price);
      submitData.append('specs', formData.specs);
      submitData.append('description', formData.description);

      submitData.append('keptImages', JSON.stringify(keptImages));

      newImages.forEach((img) => {
        submitData.append('images', img);
      });

      const res = await carService.updateSellerCar(id, submitData);
      setMessage(res.message || 'Cập nhật bài đăng thành công');

      setTimeout(() => {
        navigate('/seller/manage-cars');
      }, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Đang tải bài đăng...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-white mb-8">Chỉnh sửa bài đăng</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Hãng xe</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Dòng xe</label>
            <input
              type="text"
              name="model_name"
              value={formData.model_name}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Năm sản xuất</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Giá bán (VND)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Thông số kỹ thuật</label>
            <textarea
              name="specs"
              value={formData.specs}
              onChange={handleChange}
              rows="4"
              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
              placeholder="Nhập thông số kỹ thuật..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
              placeholder="Nhập mô tả xe..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-3">Ảnh hiện tại đang giữ</label>

            {keptImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {keptImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`old-${index}`}
                      className="w-full h-36 object-cover rounded-xl border border-gray-700"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveOldImage(img)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-700 rounded-2xl p-6 text-center text-gray-500">
                Không còn ảnh cũ nào được giữ lại
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-3">Thêm ảnh mới</label>

            <label className="flex flex-col items-center justify-center gap-3 border border-dashed border-blue-600/40 rounded-2xl p-8 bg-black cursor-pointer hover:border-blue-500 transition">
              <Upload size={28} className="text-blue-400" />
              <span className="text-gray-300">Chọn thêm ảnh mới</span>
              <span className="text-xs text-gray-500">Có thể chọn nhiều ảnh cùng lúc</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {newImages.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-3">Ảnh mới sẽ thêm</label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${index}`}
                      className="w-full h-36 object-cover rounded-xl border border-gray-700"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                    >
                      <X size={14} />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <ImageIcon size={12} />
                      Mới
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div className="md:col-span-2 text-blue-400 font-medium">
              {message}
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white text-lg font-bold transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;