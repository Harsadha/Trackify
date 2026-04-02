// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getItems } from "../services/api";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["", "Electronics", "Clothing", "Books", "Accessories", "ID/Cards", "Keys", "Other"];

export default function Dashboard() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [type,     setType]     = useState("");
  const [category, setCategory] = useState("");
  const [status,   setStatus]   = useState("");
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = {};
      if (search)   params.search   = search;
      if (type)     params.type     = type;
      if (category) params.category = category;
      if (status)   params.status   = status;
      const res = await getItems(params);
      setItems(res.data);
    } catch {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  }, [search, type, category, status]);

  // Debounce search input; immediate on dropdown changes
  useEffect(() => {
    const t = setTimeout(fetchItems, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchItems, search]);

  const hasFilters = search || type || category || status;

  return (
    <div>
      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text" placeholder="Search title, description, location…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c || "All Categories"}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
        {hasFilters && (
          <button className="btn btn-outline btn-sm"
            onClick={() => { setSearch(""); setType(""); setCategory(""); setStatus(""); }}>
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && (
        <p className="items-count">{items.length} item{items.length !== 1 ? "s" : ""} found</p>
      )}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🗂️</div>
          <p>No items match your search.</p>
          {user && (
            <Link to="/report" className="btn btn-primary" style={{ marginTop: 8 }}>
              Report an Item
            </Link>
          )}
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
