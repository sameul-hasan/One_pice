import { useState } from "react";
import { registerUser } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name);
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
        <div className="skull-icon">🏴‍☠️</div>
        <h1>Join the Crew!</h1>
        <p className="subtitle">Register to begin your pirate coding adventure</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Pirate Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monkey D. Luffy"
              required
            />
          </div>
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
              placeholder="At least 6 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Secret Code</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your secret code"
              required
            />
          </div>
          <button className="btn-pirate" type="submit" disabled={loading}>
            {loading ? "Recruiting..." : "Join the Grand Line!"}
          </button>
        </form>

        <p className="toggle-link">
          Already a pirate?{" "}
          <Link to="/login">Set Sail</Link>
        </p>
      </div>
    </div>
  );
}
