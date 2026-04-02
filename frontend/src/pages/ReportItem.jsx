// src/pages/ReportItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/api";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Accessories", "ID/Cards", "Keys", "Other"];

export default function ReportItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "", description: "", category: "Other",
    location: "", type: "lost",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);

    try {
      // Must use FormData because of the image file
      const fd = new FormData();
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("category",    form.category);
      fd.append("location",    form.location);
      fd.append("type",        form.type);  // "lost" or "found"
      if (imageFile) fd.append("image", imageFile);  // key must be "image"

      const res = await createItem(fd);
      setSuccess("Item reported! Redirecting…");
      setTimeout(() => navigate(`/items/${res.data.id}`), 1400);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrap" style={{ maxWidth: 560 }}>
      <h2>Report an Item</h2>
      <p className="form-sub">Describe the item you lost or found on campus.</p>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Lost / Found toggle */}
        <div className="form-group">
          <label>I am reporting a…</label>
          <div className="type-toggle">
            {["lost", "found"].map((t) => (
              <div
                key={t}
                className={`type-option ${form.type === t ? `active-${t}` : ""}`}
                onClick={() => setForm({ ...form, type: t })}
              >
                {t === "lost" ? "😔 Lost" : "😊 Found"}
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Item Title *</label>
          <input type="text" name="title" value={form.title}
            onChange={handleChange} required
            placeholder="e.g. Blue HP Laptop, Student ID Card" />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description}
            onChange={handleChange} required
            placeholder="Describe the item — colour, brand, any identifying marks…" />
        </div>

        <div className="form-row">
          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location *</label>
            <input type="text" name="location" value={form.location}
              onChange={handleChange} required
              placeholder="e.g. Library 2nd Floor" />
          </div>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label>Photo (optional)</label>
          <label className="file-label">
            📷 {imageFile ? imageFile.name : "Click to upload a photo"}
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>
          {preview && (
            <img src={preview} alt="preview"
              style={{ marginTop: 10, width: "100%", maxHeight: 200,
                objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting…" : "📌 Submit Report"}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
