import React, { useEffect, useState } from 'react';
import Loader from '../../components/ui/Loader';
import viewingRequestService from '../../services/viewingRequestService';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await viewingRequestService.getSellerRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi lấy yêu cầu xem xe:', err);
      setError('Không thể tải danh sách yêu cầu xem xe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDateTime = (value) => {
    if (!value) return '---';
    return new Date(value).toLocaleString('vi-VN');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Chờ xử lý',
          className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        };
      case 'approved':
        return {
          text: 'Đã xác nhận',
          className: 'bg-green-500/10 text-green-400 border border-green-500/20',
        };
      case 'rejected':
        return {
          text: 'Đã từ chối',
          className: 'bg-red-500/10 text-red-400 border border-red-500/20',
        };
      default:
        return {
          text: status || 'Không rõ',
          className: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
        };
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await viewingRequestService.updateStatus(id, status);

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      alert('Không thể cập nhật trạng thái yêu cầu.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Yêu cầu xem xe</h1>
        <p className="text-gray-500 mt-1">
          Danh sách khách hàng đã gửi yêu cầu xem xe của bạn.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Hiện chưa có yêu cầu xem xe nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-300">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5">Khách hàng</th>
                  <th className="p-5">Số điện thoại</th>
                  <th className="p-5">Xe quan tâm</th>
                  <th className="p-5">Thời gian muốn xem</th>
                  <th className="p-5">Lời nhắn</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5">Ngày gửi</th>
                  <th className="p-5 text-right">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800 text-sm">
                {requests.map((request) => {
                  const status = getStatusLabel(request.status);

                  return (
                    <tr key={request.id} className="hover:bg-white/5 transition">
                      <td className="p-5 text-white font-medium">
                        {request.full_name || '---'}
                      </td>

                      <td className="p-5 text-white">
                        {request.phone_number || '---'}
                      </td>

                      <td className="p-5 text-white">
                        {request.brand && request.model_name
                          ? `${request.brand} ${request.model_name}`
                          : `Xe #${request.car_id || '---'}`}
                      </td>

                      <td className="p-5 text-gray-300">
                        {formatDateTime(request.preferred_time)}
                      </td>

                      <td className="p-5 text-gray-300 max-w-65">
                        <div className="truncate" title={request.message || ''}>
                          {request.message || '---'}
                        </div>
                      </td>

                      <td className="p-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </td>

                      <td className="p-5 text-gray-500">
                        {formatDateTime(request.created_at)}
                      </td>

                      <td className="p-5 text-right">
                        {request.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleUpdateStatus(request.id, 'approved')}
                              disabled={updatingId === request.id}
                              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50"
                            >
                              Xác nhận
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(request.id, 'rejected')}
                              disabled={updatingId === request.id}
                              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs italic">
                            Đã xử lý
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;