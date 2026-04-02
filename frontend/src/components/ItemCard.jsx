// src/components/ItemCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const CATEGORY_ICONS = {
  Electronics: "💻", Clothing: "👕", Books: "📚",
  Accessories: "👜", "ID/Cards": "🪪", Keys: "🔑", Other: "📦",
};

export default function ItemCard({ item }) {
  const icon = CATEGORY_ICONS[item.category] || "📦";
  const date = new Date(item.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const imgSrc = item.image ? `http://localhost:5000/${item.image}` : null;

  return (
    <Link to={`/items/${item.id}`} className="item-card">
      {imgSrc ? (
        <img src={imgSrc} alt={item.title} className="item-card-img" />
      ) : (
        <div className="item-card-img-placeholder">{icon}</div>
      )}

      <div className="item-card-body">
        <div className="item-card-head">
          <span className="item-card-title">{item.title}</span>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <span className={`badge badge-${item.type}`}>{item.type}</span>
            <span className={`badge badge-${item.status}`}>{item.status}</span>
          </div>
        </div>

        <p className="item-card-desc">
          {item.description?.length > 90
            ? item.description.slice(0, 90) + "…"
            : item.description}
        </p>

        <div className="item-card-meta">
          <span>📍 {item.location}</span>
          <span>{icon} {item.category}</span>
        </div>
      </div>

      <div className="item-card-footer">
        <span> {date}</span>
        <span>👤 {item.User?.name || "—"}</span>
      </div>
    </Link>
  );
}
