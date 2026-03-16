import React, { useState } from 'react';
import carService from '../../services/carService';
import CustomButton from '../../components/ui/CustomButton';
import { Upload, X, CheckCircle } from 'lucide-react';

const PostCar = () => {
    const [formData, setFormData] = useState({ brand: '', model_name: '', year: '', price: '', specs: '', description: '' });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(image => data.append('images', image));

        try {
            await carService.postCar(data);
            alert("Đăng tin thành công! Tin của bạn đang chờ Admin duyệt.");
            window.location.href = '/seller/manage-cars';
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi đăng tin");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-[#111111] p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Upload className="text-blue-500" /> Đăng tin bán xe
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-1">
                    <label className="text-sm text-gray-400">Hãng xe</label>
                    <input type="text" required placeholder="VD: Mercedes-Benz" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 rounded-xl focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div className="space-y-4 md:col-span-1">
                    <label className="text-sm text-gray-400">Dòng xe</label>
                    <input type="text" required placeholder="VD: C200 Avantgarde" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 rounded-xl focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, model_name: e.target.value})} />
                </div>
                <div className="space-y-4">
                    <label className="text-sm text-gray-400">Năm sản xuất</label>
                    <input type="number" required placeholder="2024" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 rounded-xl focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>
                <div className="space-y-4">
                    <label className="text-sm text-gray-400">Giá bán (VNĐ)</label>
                    <input type="number" required placeholder="1500000000" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 rounded-xl focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-400 mb-2">Thông số kỹ thuật</label>

                   <textarea
                       name="specs"
                       value={formData.specs}
                       onChange={handleChange}
                       rows="4"
                       placeholder="Nhập thông số kỹ thuật của xe..."
                       className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white"
                    />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <label className="text-sm text-gray-400">Hình ảnh chi tiết (Tối đa 10 ảnh)</label>
                    <div className="border-2 border-dashed border-gray-800 rounded-2xl p-10 text-center hover:border-blue-500/50 transition relative">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                        <Upload className="mx-auto text-blue-500 mb-2" size={40} />
                        <p className="text-gray-500">Kéo thả hoặc click để chọn ảnh</p>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-4">
                        {previews.map((url, i) => (
                            <div key={i} className="relative group h-20">
                                <img src={url} className="w-full h-full object-cover rounded-lg border border-gray-800" />
                                <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                            </div>
                        ))}
                    </div>
                </div>
                <CustomButton type="submit" disabled={isSubmitting} className="md:col-span-2 py-4 text-lg">
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đăng tin"}
                </CustomButton>
            </form>
        </div>
    );
};

export default PostCar;