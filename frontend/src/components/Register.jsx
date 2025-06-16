import React, { useState } from "react";
import GlassCard from "./GlassCard";
import { FaWallet } from "react-icons/fa";
import api from "../services/api";
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");  
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");  
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");

  const handleRegister = async e => {
    e.preventDefault();
    setErr(""); setSuccess("");
    try {
      await api.post("/auth/register", { email, username, password });
      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang Đăng nhập...");
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Chuyển hướng sau 1.5 giây
    } catch (e) {
      setErr(e?.response?.data?.message || "Đăng ký thất bại");
    }
  };
  return (
    <div className="flex min-h-screen justify-center items-center">
      <GlassCard className="w-[350px] p-8 shadow-2xl relative">
        <div className="flex flex-col items-center gap-4 mb-3">
          <div className="bg-white/30 rounded-full p-3 shadow-xl">
            <FaWallet size={48} color="#7F5FFF"/>
          </div>
          <h2 className="text-3xl font-bold text-white">Register</h2>
        </div>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input type="text" required className="p-3 rounded-xl bg-white/30 focus:bg-white/50 text-white placeholder:text-white/60 outline-none"
            placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="email" required className="p-3 rounded-xl bg-white/30 focus:bg-white/50 text-white placeholder:text-white/60 outline-none"
            placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" required className="p-3 rounded-xl bg-white/30 focus:bg-white/50 text-white placeholder:text-white/60 outline-none"
            placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" className="mt-2 bg-gradient-to-r from-glass-primary to-glass-pink py-3 rounded-2xl font-bold text-white text-lg shadow-lg liquid-gradient hover:scale-105 transition-all">Đăng ký</button>
          {success && <div className="text-green-400 mt-2 text-sm">{success}</div>}
          {err && <div className="text-red-400 mt-2 text-sm">{err}</div>}
        </form>
        <div className="mt-3 flex justify-end text-sm">
          <Link to="/login" className="text-glass-secondary underline">Đã có tài khoản?</Link>
        </div>
      </GlassCard>
    </div>
  );
}
    