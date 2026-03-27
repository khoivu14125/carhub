import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        keyword: '',
        brand: '',
        maxPrice: ''
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSearch({
            keyword: filters.keyword.trim(),
            brand: filters.brand,
            maxPrice: filters.maxPrice
        });
    };

    const handleReset = () => {
        const resetFilters = {
            keyword: '',
            brand: '',
            maxPrice: ''
        };

        setFilters(resetFilters);
        onSearch(resetFilters);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl mx-auto bg-[#111111]/80 backdrop-blur-xl border border-blue-900/30 p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-3">
                {/* Ô nhập từ khóa */}
                <div className="flex-1 flex items-center bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-all w-full">
                    <Search className="text-gray-500 mr-2" size={20} />
                    <input
                        type="text"
                        name="keyword"
                        value={filters.keyword}
                        placeholder="Tìm kiếm hãng xe, tên xe..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600"
                        onChange={handleChange}
                    />
                </div>

                {/* Lọc theo Hãng */}
                <div className="w-full lg:w-52 relative">
                    <select
                        name="brand"
                        value={filters.brand}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-300 rounded-xl px-4 py-3 appearance-none outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="">Tất cả hãng</option>
                        <option value="Porsche">Porsche</option>
                        <option value="Mercedes">Mercedes</option>
                        <option value="BMW">BMW</option>
                        <option value="Audi">Audi</option>
                        <option value="Ford">Ford</option>
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={18}
                    />
                </div>

                {/* Lọc theo Giá */}
                <div className="w-full lg:w-52 relative">
                    <select
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-300 rounded-xl px-4 py-3 appearance-none outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="">Mọi mức giá</option>
                        <option value="1000000000">Dưới 1 tỷ</option>
                        <option value="2000000000">Dưới 2 tỷ</option>
                        <option value="5000000000">Dưới 5 tỷ</option>
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={18}
                    />
                </div>

                {/* Nút Lọc */}
                <button
                    type="submit"
                    className="w-full lg:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/30 active:scale-95"
                >
                    <Filter size={18} />
                    Lọc xe
                </button>

                {/* Nút Xóa lọc */}
                <button
                    type="button"
                    onClick={handleReset}
                    className="w-full lg:w-auto bg-[#0a0a0a] border border-gray-800 hover:border-red-500/50 hover:text-red-400 text-gray-300 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <X size={18} />
                    Xóa lọc
                </button>
            </form>
        </motion.div>
    );
};

export default SearchBar;