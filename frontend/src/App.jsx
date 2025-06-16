import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Deposit from "./components/Deposit";
import Transfer from "./components/Transfer";
import ContactList from "./components/ContactList";
import NotificationList from "./components/NotificationList";
import AdminPanel from "./components/AdminPanel";
import { useAuth } from "./hooks/useAuth";
import AnimatedPage from "./components/AnimatedPage";
import BubblesBackground from "./components/BubblesBackground";
import { AnimatePresence } from "framer-motion";

// Component bảo vệ route
function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  console.log("[ProtectedRoute] Rendering with:", {
    token: token ? "(exists)" : "(null)",
    user: user ? user.email : "null",
    adminOnly,
    loading,
    pathname: location.pathname
  });

  // Hiển thị trạng thái loading trong khi xác thực
  if (loading) {
    console.log("[ProtectedRoute] Still loading, showing loading screen");
    return (
      <div className="flex min-h-screen justify-center items-center">
        <h2 className="text-white text-3xl font-bold">Đang tải...</h2>
      </div>
    );
  }

  // Nếu không có token, chuyển hướng về trang login
  if (!token) {
    console.log("[ProtectedRoute] No token, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu route yêu cầu quyền admin nhưng user không phải admin, chuyển hướng về dashboard
  if (adminOnly && !user?.is_admin) {
    console.log("[ProtectedRoute] Not admin, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("[ProtectedRoute] Access granted, rendering children");
  return children;
}

export default function App() {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  console.log("[App] Rendering with:", {
    token: token ? "(exists)" : "(null)",
    user: user ? user.email : "null",
    loading,
    pathname: location.pathname
  });

  // Hiển thị trạng thái loading toàn ứng dụng khi auth đang được xác định
  if (loading) {
    console.log("[App] Still loading auth state, showing loading screen");
    return (
      <div className="flex min-h-screen justify-center items-center">
        <h2 className="text-white text-3xl font-bold">Đang tải ứng dụng...</h2>
      </div>
    );
  }

  console.log("[App] Rendering routes");
  return (
    <>
      <BubblesBackground />
      <AnimatePresence mode="wait">
        <AnimatedPage key={location.pathname}>
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/login" element={!token ? <Login /> : <Navigate to={user?.is_admin ? "/admin" : "/dashboard"} replace />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to={user?.is_admin ? "/admin" : "/dashboard"} replace />} />

            {/* Protected admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* Protected user routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationList /></ProtectedRoute>} />

            {/* Default routes */}
            <Route path="/" element={token ? <Navigate to={user?.is_admin ? "/admin" : "/dashboard"} replace /> : <Navigate to="/login" replace />} />
            <Route path="*" element={token ? <Navigate to={user?.is_admin ? "/admin" : "/dashboard"} replace /> : <Navigate to="/login" replace />} />
          </Routes>
        </AnimatedPage>
      </AnimatePresence>
    </>
  );
}
