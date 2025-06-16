import React, { useState, useEffect } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Transfer() {
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [contacts, setContacts] = useState([]);
  const [needOTP, setNeedOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/contacts").then(res => setContacts(res.data));
  }, []);

  const handleTransfer = async e => {
    e.preventDefault();
    setMsg("");
    setNeedOTP(false);
    try {
      await api.post("/transaction/transfer", {
        to_user_id: Number(toUserId),
        amount: Number(amount),
      });
      setMsg("Chuyển tiền thành công!");
      setToUserId("");
      setAmount("");
    } catch (e) {
      // Nếu BE trả về lỗi đòi OTP
      if (e?.response?.status === 401) {
        setNeedOTP(true);
        setMsg(e.response.data.message || "Vui lòng nhập mã OTP đã gửi về email.");
      } else {
        setMsg(e?.response?.data?.message || "Lỗi chuyển tiền");
      }
    }
  };

  const handleSubmitOTP = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/transaction/transfer", {
        to_user_id: Number(toUserId),
        amount: Number(amount),
        otp: otp,
      });
      setMsg("Chuyển tiền thành công!");
      setToUserId("");
      setAmount("");
      setOTP("");
      setNeedOTP(false);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Xác thực OTP thất bại");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-white bg-glass-secondary rounded-full px-4 py-2 hover:scale-110 transition"
      >
        Quay lại
      </button>
      <GlassCard className="w-[360px] p-7 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white mb-4 text-glow">Chuyển tiền</h3>
        
        {/* Gợi ý danh bạ */}
        <div className="w-full mb-5">
          <div className="text-white/80 mb-2">Gợi ý từ danh bạ:</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {contacts.length === 0 && (
              <span className="text-white/60">Không có bạn bè nào</span>
            )}
            {contacts.map((c) => (
              <button
                key={c.id}
                className={`flex flex-col items-center p-2 rounded-xl bg-white/20 hover:bg-glass-pink/60 transition border border-white/30 min-w-[70px]`}
                title={c.username}
                onClick={() => setToUserId(c.contact_user_id)}
                type="button"
              >
                {c.avatar ? (
                  <img
                    src={
                      c.avatar.startsWith("http")
                        ? c.avatar
                        : "http://localhost:5000" + c.avatar
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-glass-pink"
                  />
                ) : (
                  <FaUserAlt className="text-white text-xl" />
                )}
                <span className="text-white/90 text-xs font-bold mt-1">
                  {c.nickname || c.username}
                </span>
                <span className="text-white/60 text-[11px]">
                  ID: {c.contact_user_id}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!needOTP ? (
          <form onSubmit={handleTransfer} className="flex flex-col gap-4 w-full">
            <input
              type="number"
              className="p-3 rounded-xl bg-white/30 text-white placeholder:text-white/60 outline-none"
              placeholder="ID người nhận"
              value={toUserId}
              onChange={e => setToUserId(e.target.value)}
              required
            />
            <input
              type="number"
              className="p-3 rounded-xl bg-white/30 text-white placeholder:text-white/60 outline-none"
              placeholder="Số tiền"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              className="liquid-gradient py-2 rounded-xl text-white font-semibold hover:scale-105 transition"
            >
              Chuyển
            </button>
            {msg && <div className="mt-2 text-white/80">{msg}</div>}
          </form>
        ) : (
          <form onSubmit={handleSubmitOTP} className="flex flex-col gap-4 w-full">
            <div className="text-white/90 text-sm font-semibold mb-1">Nhập mã OTP đã gửi về email</div>
            <input
              type="text"
              className="p-3 rounded-xl bg-white/30 text-white placeholder:text-white/60 outline-none tracking-widest text-center text-xl"
              placeholder="Mã OTP"
              value={otp}
              onChange={e => setOTP(e.target.value)}
              required
              autoFocus
            />
            <button
              type="submit"
              className="liquid-gradient py-2 rounded-xl text-white font-bold hover:scale-105 transition"
            >
              Xác nhận OTP & chuyển tiền
            </button>
            {msg && <div className="mt-2 text-white/80">{msg}</div>}
          </form>
        )}
      </GlassCard>
    </div>
  );
}
