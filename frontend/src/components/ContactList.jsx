import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import { FaUserAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [id, setId] = useState(""); const [nick, setNick] = useState(""); const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const loadContacts = () => api.get("/user/contacts").then(res => setContacts(res.data));

  useEffect(() => { loadContacts(); }, []);

  const addContact = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/user/contacts", { contact_user_id: Number(id), nickname: nick });
      setMsg("Đã thêm bạn bè!"); setId(""); setNick("");
      loadContacts();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Lỗi thêm bạn bè");
    }
  };
  const removeContact = async (contact_user_id) => {
    await api.delete("/user/contacts", { data: { contact_user_id } });
    loadContacts();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={() => navigate('/dashboard')} className="mb-6 text-white bg-glass-secondary rounded-full px-4 py-2 hover:scale-110 transition">Quay lại</button>
      <GlassCard className="w-[370px] p-7">
        <h3 className="text-2xl font-bold text-white mb-4">Danh bạ bạn bè</h3>
        <form onSubmit={addContact} className="flex gap-2 mb-4">
          <input type="number" placeholder="ID bạn bè" className="p-2 rounded-lg bg-white/30 text-white w-24" value={id} onChange={e=>setId(e.target.value)} />
          <input placeholder="Tên gợi nhớ" className="p-2 rounded-lg bg-white/30 text-white w-32" value={nick} onChange={e=>setNick(e.target.value)} />
          <button className="liquid-gradient py-2 px-4 rounded-xl text-white font-semibold">Thêm</button>
        </form>
        {msg && <div className="mb-2 text-white/80">{msg}</div>}
        <div className="flex flex-col gap-2">
          {contacts.length === 0 && <div className="text-white/60">Chưa có bạn bè</div>}
          {contacts.map(c=>(
            <div key={c.id} className="flex gap-2 items-center bg-white/10 p-2 rounded-xl">
              <FaUserAlt className="text-glass-secondary"/>
              <span className="text-white font-semibold">{c.username}</span>
              <span className="text-white/70 ml-2">{c.nickname}</span>
              <button className="ml-auto" onClick={()=>removeContact(c.contact_user_id)}><FaTrash color="#E0C3FC"/></button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
