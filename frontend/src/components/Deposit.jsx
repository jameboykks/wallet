import React, { useState } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleDeposit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/transaction/deposit", { amount: Number(amount) });
      setMsg("Nạp tiền thành công!");
      setAmount("");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Lỗi nạp tiền");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={() => navigate('/dashboard')} className="mb-6 text-white bg-glass-secondary rounded-full px-4 py-2 hover:scale-110 transition">Quay lại</button>
      <GlassCard className="w-[340px] p-7 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white mb-4">Nạp tiền</h3>
        <form onSubmit={handleDeposit} className="flex flex-col gap-4 w-full">
          <input type="number" className="p-3 rounded-xl bg-white/30 text-white placeholder:text-white/60 outline-none"
            placeholder="Số tiền" value={amount} onChange={e=>setAmount(e.target.value)} />
          <button type="submit" className="liquid-gradient py-2 rounded-xl text-white font-semibold hover:scale-105 transition">Nạp</button>
          {msg && <div className="mt-2 text-white/80">{msg}</div>}
        </form>
      </GlassCard>
    </div>
  );
}
