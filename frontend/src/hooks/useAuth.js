import { useState, useEffect } from 'react';
import api from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [loading, setLoading] = useState(true);

  const saveToken = t => {
    console.log("useAuth: Saving token", t ? "(exists)" : "(null)");
    setToken(t);
    if (t) {
      localStorage.setItem('token', t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const login = async ({ email, password }) => {
    console.log("useAuth: login attempt for", email);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        saveToken(res.data.token);
        console.log("useAuth: Token saved, fetching profile...");
        const profileRes = await api.get('/user/profile');
        setUser(profileRes.data);
        console.log("useAuth: Profile fetched:", profileRes.data);
        setLoading(false);
        return profileRes.data;
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error("useAuth: Login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    saveToken("");
    setUser(null);
  };

  // Chỉ chạy một lần khi component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("useAuth: Initial token check:", storedToken ? "(exists)" : "(null)");
    
    if (storedToken) {
      setLoading(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      api.get('/user/profile')
        .then(res => {
          setUser(res.data);
          console.log("useAuth: Initial profile loaded:", res.data);
        })
        .catch(err => {
          console.error("useAuth: Error loading initial profile:", err);
          setUser(null);
          saveToken("");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  console.log("useAuth: Current state -> user:", user ? user.email : "null", "token:", token ? "(exists)" : "(null)", "loading:", loading);
  return { user, token, login, logout, loading };
}
