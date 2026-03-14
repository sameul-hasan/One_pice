import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { onAuth, logoutUser } from "./firebase/auth";
import { getUserProfile } from "./firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChallengePage from "./pages/ChallengePage";
import Rewards from "./pages/Rewards";
import AdminPanel from "./pages/AdminPanel";

function ProtectedRoute({ user, profile, children }) {
  if (user === undefined) return <div className="page-loading">Navigating the seas...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ profile, children }) {
  if (!profile || profile.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
}

function Navbar({ user, profile, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) ? "active" : "";

  return (
    <nav className="pirate-nav">
      <Link to="/dashboard" className="logo">
        <span className="skull">☠️</span> Grand Line Dev
      </Link>

      <ul className="nav-links">
        <li><Link to="/dashboard" className={isActive("/dashboard")}>Map</Link></li>
        <li><Link to="/challenges" className={isActive("/challenges")}>Challenges</Link></li>
        <li><Link to="/rewards" className={isActive("/rewards")}>Rewards</Link></li>
        {profile?.role === "admin" && (
          <li><Link to="/admin" className={isActive("/admin")}>Admin</Link></li>
        )}
      </ul>

      <div className="user-section">
        <span className="bounty-display">💰 {profile?.points ?? 0}</span>
        <button className="btn-logout" onClick={onLogout}>Abandon Ship</button>
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await getUserProfile(firebaseUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
    });
    return unsub;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      setProfile(p);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  const isAuthPage = !user;

  return (
    <div className="app-wrapper">
      {user && profile && <Navbar user={user} profile={profile} onLogout={handleLogout} />}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute user={user} profile={profile}>
            <Dashboard user={user} profile={profile} refreshProfile={refreshProfile} />
          </ProtectedRoute>
        } />

        <Route path="/challenges" element={
          <ProtectedRoute user={user} profile={profile}>
            <ChallengePage user={user} profile={profile} refreshProfile={refreshProfile} />
          </ProtectedRoute>
        } />
        <Route path="/challenges/:islandId" element={
          <ProtectedRoute user={user} profile={profile}>
            <ChallengePage user={user} profile={profile} refreshProfile={refreshProfile} />
          </ProtectedRoute>
        } />

        <Route path="/rewards" element={
          <ProtectedRoute user={user} profile={profile}>
            <Rewards user={user} profile={profile} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute user={user} profile={profile}>
            <AdminRoute profile={profile}>
              <AdminPanel />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}
