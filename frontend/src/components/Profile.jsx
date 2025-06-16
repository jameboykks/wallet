import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import api from "../services/api";
import { FaUserCircle, FaSave, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", phone: "", avatar: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    api.get("/user/profile").then(res => {
      setProfile(res.data);
      setForm({
        username: res.data.username || "",
        phone: res.data.phone || "",
        avatar: res.data.avatar || "",
      });
    });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await api.put("/user/profile", form);
      setMsg("Cập nhật thành công!");
      setEditMode(false);
      loadProfile();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleLockAccount = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn khóa tài khoản? Bạn sẽ không thể đăng nhập cho đến khi admin mở khóa.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/user/lock');
      setSuccess('Đã khóa tài khoản thành công');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể khóa tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-white bg-glass-secondary rounded-full px-4 py-2 hover:scale-110 transition flex items-center gap-2"
      >
        <FaChevronLeft /> Quay lại
      </button>
      <GlassCard className="w-[360px] p-8 flex flex-col items-center">
        {/* Avatar hiện tại */}
        {profile.avatar ? (
          <img
            src={
              profile.avatar.startsWith("http")
                ? profile.avatar
                : "http://localhost:5000" + profile.avatar
            }
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-glass-secondary mb-2"
          />
        ) : (
          <FaUserCircle size={64} color="#48C6EF" />
        )}

        {!editMode ? (
          <>
            <h3 className="text-2xl font-bold mt-3 text-white text-glow">
              {profile.username}
            </h3>
            <div className="text-white/80 mt-1">{profile.email}</div>
            <div className="text-white/80">{profile.phone}</div>
            <div className="mt-6 w-full flex flex-col gap-3">
              <button
                className="liquid-gradient py-2 rounded-xl text-white font-semibold"
                onClick={() => setEditMode(true)}
              >
                Cập nhật thông tin
              </button>
            </div>
          </>
        ) : (
          <>
            <form
              className="w-full flex flex-col gap-3 mt-3"
              onSubmit={handleSave}
            >
              <input
                type="text"
                name="username"
                className="p-3 rounded-xl bg-white/30 text-white placeholder:text-white/60 outline-none"
                placeholder="Họ tên"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                className="p-3 rounded-xl bg-white/30 text-white placeholder:text-white/60 outline-none"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
              />
              {/* Upload avatar file */}
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("avatar", file);
                      try {
                        const res = await api.post(
                          "/user/avatar",
                          formData,
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                        setForm({ ...form, avatar: res.data.url });
                        setMsg("Tải ảnh thành công!");
                      } catch {
                        setMsg("Upload ảnh thất bại");
                      }
                    }
                  }}
                  className="block text-white"
                />
                {form.avatar && (
                  <img
                    src={
                      form.avatar.startsWith("http")
                        ? form.avatar
                        : "http://localhost:5000" + form.avatar
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border border-glass-pink"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="liquid-gradient py-2 px-4 rounded-xl text-white font-bold flex items-center gap-2"
                >
                  <FaSave /> Lưu lại
                </button>
                <button
                  type="button"
                  className="bg-glass-secondary py-2 px-4 rounded-xl text-white font-semibold"
                  onClick={() => setEditMode(false)}
                >
                  Hủy
                </button>
              </div>
              {msg && <div className="text-green-400 mt-2 text-sm">{msg}</div>}
            </form>
          </>
        )}
      </GlassCard>
      <div className="mt-8 space-y-4">
        <button
          onClick={handleLockAccount}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Khóa tài khoản'}
        </button>

        {error && <div className="text-red-400 text-center">{error}</div>}
        {success && <div className="text-green-400 text-center">{success}</div>}
      </div>
    </div>
  );
}
