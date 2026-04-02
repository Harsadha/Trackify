// src/pages/MyItems.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyItems, updateStatus, deleteItem } from "../services/api";

const CATEGORY_ICONS = {
  Electronics: "💻", Clothing: "👕", Books: "📚",
  Accessories: "👜", "ID/Cards": "🪪", Keys: "🔑", Other: "📦",
};

export default function MyItems() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    getMyItems()
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load your items."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (item) => {
    const newStatus = item.status === "open" ? "resolved" : "open";
    try {
      const res = await updateStatus(item.id, newStatus);
      setItems(items.map((i) => (i.id === item.id ? res.data : i)));
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deleteItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete.");
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My Posts</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: 4 }}>
            {items.length} post{items.length !== 1 ? "s" : ""} by you
          </p>
        </div>
        <Link to="/report" className="btn btn-primary">+ New Report</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>You haven't posted anything yet.</p>
          <Link to="/report" className="btn btn-primary" style={{ marginTop: 8 }}>
            Report your first item
          </Link>
        </div>
      ) : (
        <div className="my-items-list">
          {items.map((item) => {
            const icon   = CATEGORY_ICONS[item.category] || "📦";
            const imgSrc = item.image ? `http://localhost:5000/${item.image}` : null;
            const date   = new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <div key={item.id} className="my-item-row">
                {/* Thumbnail */}
                <div className="my-item-img">
                  {imgSrc
                    ? <img src={imgSrc} alt={item.title} />
                    : icon}
                </div>

                {/* Info */}
                <div className="my-item-info">
                  <span className="my-item-title">{item.title}</span>
                  <span className="my-item-sub">📍 {item.location} · 📅 {date}</span>
                </div>

                {/* Badges */}
                <div className="my-item-badges">
                  <span className={`badge badge-${item.type}`}>{item.type}</span>
                  <span className={`badge badge-${item.status}`}>{item.status}</span>
                </div>

                {/* Actions */}
                <div className="my-item-actions">
                  <Link to={`/items/${item.id}`} className="btn btn-ghost btn-sm">View</Link>
                  <button
                    className={`btn btn-sm ${item.status === "open" ? "btn-success" : "btn-outline"}`}
                    onClick={() => handleToggle(item)}
                    title={item.status === "open" ? "Mark resolved" : "Reopen"}
                  >
                    {item.status === "open" ? "✅" : "🔓"}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
