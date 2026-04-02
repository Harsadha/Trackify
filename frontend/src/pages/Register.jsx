// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      // Register doesn't auto-login — then call login
      await registerAPI(form);
      // Now login to get token
      const { login: loginAPI } = await import("../services/api");
      const res = await loginAPI({ email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrap">
      <h2>Create account</h2>
      <p className="form-sub">Join the Trackify campus lost &amp; found portal.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={form.name}
            onChange={handleChange} placeholder="Ravi Kumar" required />
        </div>
        <div className="form-group">
          <label>College Email</label>
          <input type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@college.edu" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="Min. 6 characters" required />
        </div>
        <button type="submit" className="btn btn-primary form-full" disabled={loading}>
          {loading ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <p className="auth-foot">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
