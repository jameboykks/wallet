import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import Transactions from "./Transactions";
import { FaWallet, FaUser, FaPlusCircle, FaExchangeAlt, FaBell, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/balance").then(res => setBalance(res.data.balance || 0));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Đảm bảo reset state toàn app
  };

  return (
    <div className="flex flex-col items-center pt-8 min-h-screen relative">
      {/* Nút Logout ở góc phải trên */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-8 bg-glass-pink/80 hover:bg-glass-pink text-white rounded-full px-4 py-1 shadow text-glass-shadow font-bold transition"
        style={{zIndex: 10}}
      >
        Đăng xuất
      </button>
      <GlassCard className="w-[360px] mb-6 p-7 flex flex-col items-center relative">
        <div className="bg-white/30 rounded-full p-4 mb-2 shadow-lg">
          <FaWallet size={40} color="#48C6EF" />
        </div>
        <div className="text-xl text-white mb-2">Số dư</div>
        <div className="text-4xl font-extrabold text-white shimmer">${balance.toLocaleString()}</div>
        <div className="flex gap-4 mt-4">
          <button onClick={() => navigate('/deposit')} className="bg-glass-primary/90 hover:bg-glass-primary text-white rounded-xl px-4 py-2 flex gap-2 items-center liquid-gradient"> <FaPlusCircle/> Nạp </button>
          <button onClick={() => navigate('/transfer')} className="bg-glass-secondary/80 hover:bg-glass-secondary text-white rounded-xl px-4 py-2 flex gap-2 items-center liquid-gradient"><FaExchangeAlt/> Chuyển</button>
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => navigate('/profile')} className="glass-card px-5 py-3 text-white rounded-xl flex gap-2 items-center hover:scale-105 transition"><FaUser/>Profile</button>
        <button onClick={() => navigate('/contacts')} className="glass-card px-5 py-3 text-white rounded-xl flex gap-2 items-center hover:scale-105 transition"><FaUserFriends/>Danh bạ</button>
        <button onClick={() => navigate('/notifications')} className="glass-card px-5 py-3 text-white rounded-xl flex gap-2 items-center hover:scale-105 transition"><FaBell/>Thông báo</button>
      </div>

      <div className="w-full max-w-lg">
        <Transactions />
      </div>
    </div>
  );
}
