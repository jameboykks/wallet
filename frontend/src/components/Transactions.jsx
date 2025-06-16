import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { FaArrowDown, FaArrowUp, FaDollarSign } from "react-icons/fa";
import { useAuth } from '../hooks/useAuth';
import { wallet } from '../services/api';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    searchTerm: ''
  });

  const fetchTransactions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);

      const response = await wallet.getTransactions(queryParams.toString());
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <GlassCard className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Tìm kiếm giao dịch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Từ ngày</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Đến ngày</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loại giao dịch</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
            >
              <option value="">Tất cả</option>
              <option value="deposit">Nạp tiền</option>
              <option value="transfer">Chuyển tiền</option>
              <option value="withdraw">Rút tiền</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Tên người dùng hoặc mô tả"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Lịch sử giao dịch</h2>
        <div className="overflow-x-auto max-h-[480px] rounded-xl border border-white/10 shadow-inner bg-white/5">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="sticky top-0 z-10 bg-white/20 backdrop-blur-md">
              <tr className="border-b border-white/20">
                <th className="text-left p-4">Thời gian</th>
                <th className="text-left p-4">Loại</th>
                <th className="text-left p-4">Người gửi</th>
                <th className="text-left p-4">Người nhận</th>
                <th className="text-left p-4">Số tiền</th>
                <th className="text-left p-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">Không có giao dịch nào</td>
                </tr>
              )}
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/10 hover:bg-white/10 transition">
                  <td className="p-4 whitespace-nowrap">{new Date(transaction.created_at).toLocaleString()}</td>
                  <td className="p-4 whitespace-nowrap">
                    {transaction.type === 'deposit' && <span className="text-green-500 font-semibold flex items-center gap-1"><FaArrowDown /> Nạp</span>}
                    {transaction.type === 'transfer' && <span className="text-blue-500 font-semibold flex items-center gap-1"><FaArrowUp /> Chuyển</span>}
                    {transaction.type === 'withdraw' && <span className="text-yellow-500 font-semibold flex items-center gap-1"><FaDollarSign /> Rút</span>}
                    {transaction.type === 'receive' && <span className="text-purple-500 font-semibold flex items-center gap-1"><FaArrowDown /> Nhận</span>}
                  </td>
                  <td className="p-4 whitespace-nowrap">{transaction.sender_name}</td>
                  <td className="p-4 whitespace-nowrap">{transaction.receiver_name}</td>
                  <td className="p-4 whitespace-nowrap font-bold">{Number(transaction.amount).toLocaleString()} VND</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                      transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {transaction.status === 'completed' ? 'Hoàn tất' :
                       transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
