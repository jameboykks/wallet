import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotificationList() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/notification").then(res => setList(res.data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={() => navigate('/dashboard')} className="mb-6 text-white bg-glass-secondary rounded-full px-4 py-2 hover:scale-110 transition">Quay lại</button>
      <GlassCard className="w-[370px] p-7">
        <h3 className="text-2xl font-bold text-white mb-4 flex gap-2 items-center"><FaBell/>Thông báo</h3>
        <div className="flex flex-col gap-2">
          {list.length === 0 && <div className="text-white/70">Không có thông báo</div>}
          {list.map(n=>(
            <div key={n.id} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
              <span className="font-bold text-glass-pink">{n.type}</span>
              <span className="text-white">{n.message}</span>
              <span className="text-white/60 ml-auto">{(new Date(n.created_at)).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
