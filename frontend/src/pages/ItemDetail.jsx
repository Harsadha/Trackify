// src/pages/ItemDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItems, updateStatus, deleteItem } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORY_ICONS = {
  Electronics: "💻", Clothing: "👕", Books: "📚",
  Accessories: "👜", "ID/Cards": "🪪", Keys: "🔑", Other: "📦",
};

export default function ItemDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [item,    setItem]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState(false);

  // Backend has no GET /items/:id — fetch all and filter by id
  useEffect(() => {
    getItems()
      .then((res) => {
        const found = res.data.find((i) => String(i.id) === String(id));
        if (!found) setError("Item not found.");
        else setItem(found);
      })
      .catch(() => setError("Failed to load item."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleStatus = async () => {
    setSaving(true);
    try {
      const newStatus = item.status === "open" ? "resolved" : "open";
      const res = await updateStatus(item.id, newStatus);
      setItem(res.data);
    } catch {
      setError("Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await deleteItem(item.id);
      navigate("/");
    } catch {
      setError("Failed to delete.");
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (error)   return <div className="alert alert-error" style={{ maxWidth: 600, margin: "40px auto" }}>{error}</div>;
  if (!item)   return null;

  const isOwner = user && user.id === item.UserId;
  const icon    = CATEGORY_ICONS[item.category] || "📦";
  const imgSrc  = item.image ? `http://localhost:5000/${item.image}` : null;
  const date    = new Date(item.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      <Link to="/" className="detail-back">← Back to all items</Link>

      <div className="detail-card">
        {/* Left: image */}
        {imgSrc ? (
          <img src={imgSrc} alt={item.title} className="detail-img" />
        ) : (
          <div className="detail-img-placeholder">{icon}</div>
        )}

        {/* Right: info */}
        <div className="detail-body">
          <div className="detail-badges">
            <span className={`badge badge-${item.type}`}>{item.type}</span>
            <span className={`badge badge-${item.status}`}>{item.status}</span>
            <span className="badge" style={{ background: "var(--surface2)", color: "var(--muted)" }}>
              {icon} {item.category}
            </span>
          </div>

          <h1>{item.title}</h1>

          <div className="detail-field">
            <span className="detail-field-label">Description</span>
            <span className="detail-field-value">{item.description}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="detail-field">
              <span className="detail-field-label">Location</span>
              <span className="detail-field-value">📍 {item.location}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Reported On</span>
              <span className="detail-field-value">📅 {date}</span>
            </div>
          </div>

          <div className="detail-field">
            <span className="detail-field-label">Posted By</span>
            <span className="detail-field-value">👤 {item.User?.name || "—"}</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Owner actions */}
          {isOwner ? (
            <div className="detail-actions">
              <button
                className={`btn ${item.status === "open" ? "btn-success" : "btn-outline"}`}
                onClick={handleToggleStatus} disabled={saving}
              >
                {saving ? "Updating…" : item.status === "open" ? "✅ Mark Resolved" : "🔓 Reopen"}
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete</button>
            </div>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              {item.status === "open"
                ? "If this is yours, contact the poster above."
                : "This item has been marked as resolved."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
