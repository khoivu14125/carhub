import React, { useEffect, useState } from 'react';
import carService from '../../services/carService';
import CarCard from '../../components/ui/CarCard';
import SearchBar from '../../components/shared/SearchBar';
import Loader from '../../components/ui/Loader';

const Inventory = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async (filters = {}) => {
        setLoading(true);
        try {
            const data = await carService.getCars(filters);
            setCars(data);
        } catch (err) {
            console.error('Lỗi tải danh sách xe:', err);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <div className="space-y-10">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black tracking-tight">
                    Khám phá <span className="text-blue-500">Kho Xe</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Tìm kiếm chiếc xe hoàn hảo phù hợp với phong cách của bạn
                </p>
            </div>

            <SearchBar onSearch={fetchCars} />

            {loading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.length > 0 ? (
                        cars.map((car) => <CarCard key={car.id} car={car} />)
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500 border border-gray-800 rounded-3xl bg-[#111111]">
                            Không tìm thấy xe phù hợp với bộ lọc.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inventory;