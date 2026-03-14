import { useState } from "react";
import { loginUser } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="skull-icon">☠️</div>
        <h1>Set Sail!</h1>
        <p className="subtitle">Login to continue your adventure on the Grand Line</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Captain's Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="luffy@grandline.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Secret Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secret code"
              required
            />
          </div>
          <button className="btn-pirate" type="submit" disabled={loading}>
            {loading ? "Setting Sail..." : "Board the Ship!"}
          </button>
        </form>

        <p className="toggle-link">
          New pirate?{" "}
          <Link to="/register">Join the Crew</Link>
        </p>
      </div>
    </div>
  );
}
