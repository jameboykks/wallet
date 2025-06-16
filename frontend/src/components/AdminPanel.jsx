import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]), [transactions, setTransactions] = useState([]), [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
    api.get("/admin/transactions").then(res => setTransactions(res.data));
    api.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAccount = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn mở khóa tài khoản này?')) {
      return;
    }

    try {
      await api.post(`/user/unlock/${userId}`);
      setSuccess('Đã mở khóa tài khoản thành công');
      loadUsers(); // Tải lại danh sách người dùng
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể mở khóa tài khoản');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <h2 className="text-white text-3xl font-bold">Đang tải...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen relative">
      <button onClick={handleLogout} className="absolute top-6 right-8 bg-glass-pink/80 hover:bg-glass-pink text-white rounded-full px-4 py-1 shadow text-glass-shadow font-bold transition z-10">Đăng xuất</button>
      <button onClick={() => navigate('/dashboard')} className="mb-6 text-white bg-glass-secondary rounded-full px-4 py-2 hover:scale-110 transition">Quay lại</button>
      <GlassCard className="w-[500px] p-6 mb-6">
        <h3 className="text-xl text-white font-bold mb-2">Thống kê hệ thống</h3>
        <div className="text-white/80">Tổng số tiền: <span className="text-glass-green font-bold">${stats.total_balance?.toLocaleString() || 0}</span></div>
        <div className="text-white/80">Tổng số giao dịch: <span className="text-glass-pink font-bold">{stats.total_transactions || 0}</span></div>
      </GlassCard>
      <GlassCard className="w-[500px] p-6 mb-6">
        <h3 className="text-xl text-white font-bold mb-2">Top giao dịch</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Từ</th>
                <th className="p-2 text-left">Đến</th>
                <th className="p-2 text-left">Thời gian</th>
                <th className="p-2 text-left">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {stats.topTransactions?.length > 0 ? stats.topTransactions.map(t=>(
                <tr key={t.id} className="border-b border-white/10">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2">{t.sender_name || '-'}</td>
                  <td className="p-2">{t.receiver_name || '-'}</td>
                  <td className="p-2">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="p-2 font-bold">{Number(t.amount).toLocaleString()} VND</td>
                </tr>
              )) : <tr><td colSpan={5} className="text-center text-white/60 py-4">Chưa có dữ liệu</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <GlassCard className="w-[500px] p-6 mb-6">
        <h3 className="text-xl text-white font-bold mb-2">Người dùng</h3>
        <div className="max-h-40 overflow-auto">
          {users.map(u=>(
            <div key={u.id} className="flex justify-between items-center py-1 text-white">
              <span>{u.username}</span>
              <span className="text-white/70">${u.balance}</span>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="w-[500px] p-6">
        <h3 className="text-xl text-white font-bold mb-2">Tất cả giao dịch</h3>
        <div className="overflow-x-auto max-h-60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Từ</th>
                <th className="p-2 text-left">Đến</th>
                <th className="p-2 text-left">Thời gian</th>
                <th className="p-2 text-left">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map(t=>(
                <tr key={t.id} className="border-b border-white/10">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2">{t.sender_name || '-'}</td>
                  <td className="p-2">{t.receiver_name || '-'}</td>
                  <td className="p-2">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="p-2 font-bold">{Number(t.amount).toLocaleString()} VND</td>
                </tr>
              )) : <tr><td colSpan={5} className="text-center text-white/60 py-4">Chưa có dữ liệu</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
    