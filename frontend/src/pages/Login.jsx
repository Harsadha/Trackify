// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginAPI(form);
      // Backend returns { token, user: { id, name, email } }
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrap">
      <h2>Welcome back</h2>
      <p className="form-sub">Sign in to manage your lost &amp; found posts.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@college.edu" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn btn-primary form-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="auth-foot">
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
