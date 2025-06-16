import React, { useState } from "react";
import GlassCard from "./GlassCard";
import { FaWallet } from "react-icons/fa";
import api from "../services/api";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [err, setErr] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    setErr("");
    try {
      const user = await login({ email, password });
      console.log("Login successful, user data:", user);
      
      // Điều hướng dựa trên loại user
      if (user.is_admin) {
        console.log("Redirecting to admin panel");
        navigate('/admin', { replace: true });
      } else {
        console.log("Redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      }
    } catch (e) {
      console.error("Login failed:", e);
      setErr(e?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <GlassCard className="w-[350px] p-8 shadow-2xl relative">
        <div className="flex flex-col items-center gap-4 mb-3">
          <div className="bg-white/30 rounded-full p-3 shadow-xl">
            <FaWallet size={48} color="#7F5FFF" style={{filter:"drop-shadow(0 0 8px #48C6EFBB)"}}/>
          </div>
          <h2 className="text-3xl font-bold text-white">Login</h2>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" required className="p-3 rounded-xl bg-white/30 focus:bg-white/50 text-white placeholder:text-white/60 outline-none"
            placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" required className="p-3 rounded-xl bg-white/30 focus:bg-white/50 text-white placeholder:text-white/60 outline-none"
            placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit" className="mt-2 bg-gradient-to-r from-glass-primary to-glass-pink py-3 rounded-2xl font-bold text-white text-lg shadow-lg liquid-gradient hover:scale-105 transition-all">Login</button>
          {err && <div className="text-red-400 mt-2 text-sm">{err}</div>}
        </form>
        <div className="mt-3 flex justify-end text-sm">
          <Link to="/register" className="text-glass-secondary underline">Đăng ký tài khoản</Link>
        </div>
      </GlassCard>
    </div>
  );
}
