// ================================================================
// File: smrita/src/pages/AdminPanel.jsx
// SMRITA Admin Dashboard - Full featured admin panel
// ================================================================

import { useState, useEffect } from "react";
import { orderAPI, productAPI } from "../utils/api";
import API from "../utils/api";

// ── Icons ────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  products: "M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m-8 4l8-4",
  customers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  rupee: "M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 000-8",
  package: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  check: "M20 6L9 17l-5-5",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  x: "M18 6L6 18M6 6l12 12",
};

// ── Status Badge ─────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Shipped: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
      {status}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────
const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 12, padding: "20px 24px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ color: "#888", fontSize: 12, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>{label}</p>
        <p style={{ color: "#fff", fontSize: 28, fontWeight: 700, fontFamily: "serif" }}>{value}</p>
        {sub && <p style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{sub}</p>}
      </div>
      <div style={{ background: `${color}22`, borderRadius: 10, padding: 10, color }}>
        <Icon d={icon} size={22} />
      </div>
    </div>
  </div>
);

// ── Update Order Modal ────────────────────────────────
const UpdateOrderModal = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.orderStatus);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await orderAPI.updateStatus(order._id, { status, trackingId, note });
      onUpdate();
      onClose();
    } catch (err) {
      alert("Failed to update order status");
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 18 }}>Update Order</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>
            <Icon d={icons.x} size={18} />
          </button>
        </div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
          Order: <span style={{ color: "#D4AF37" }}>#{order._id?.slice(-8).toUpperCase()}</span>
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 }}>STATUS</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14 }}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 }}>TRACKING ID (optional)</label>
          <input value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="Enter tracking number"
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14, boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 }}>NOTE (optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..."
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14, resize: "none", height: 80, boxSizing: "border-box" }} />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: "#D4AF37", color: "#000", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
};

// ── Dashboard Tab ─────────────────────────────────────
const DashboardTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getStats().then(r => { setStats(r.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#D4AF37", textAlign: "center", padding: 60 }}>Loading stats...</div>;
  if (!stats) return <div style={{ color: "#f87171", textAlign: "center", padding: 60 }}>Failed to load stats</div>;

  return (
    <div>
      <h2 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 22, marginBottom: 24 }}>Dashboard Overview</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon={icons.rupee} color="#D4AF37" sub="All time" />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={icons.orders} color="#60a5fa" sub="All time" />
        <StatCard label="Pending" value={stats.pendingOrders} icon={icons.package} color="#facc15" sub="Need action" />
        <StatCard label="Delivered" value={stats.deliveredOrders} icon={icons.check} color="#4ade80" sub="Completed" />
        <StatCard label="Cancelled" value={stats.cancelledOrders} icon={icons.x} color="#f87171" sub="Refund may apply" />
      </div>

      {stats.topProducts?.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 16, marginBottom: 16 }}>🏆 Top Selling Products</h3>
          {stats.topProducts.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < stats.topProducts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#D4AF37", fontWeight: 700, fontSize: 16, width: 24 }}>#{i + 1}</span>
                <span style={{ color: "#fff", fontSize: 14 }}>{p._id}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#D4AF37", fontSize: 14, fontWeight: 600 }}>₹{p.revenue}</p>
                <p style={{ color: "#666", fontSize: 12 }}>{p.totalSold} sold</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {stats.monthlyRevenue?.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 12, padding: 24, marginTop: 16 }}>
          <h3 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 16, marginBottom: 16 }}>📈 Monthly Revenue</h3>
          {stats.monthlyRevenue.map((m, i) => {
            const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const maxRev = Math.max(...stats.monthlyRevenue.map(x => x.revenue));
            const pct = (m.revenue / maxRev) * 100;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#aaa", fontSize: 13 }}>{months[m._id.month]} {m._id.year}</span>
                  <span style={{ color: "#D4AF37", fontSize: 13, fontWeight: 600 }}>₹{m.revenue} ({m.orders} orders)</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 8 }}>
                  <div style={{ background: "linear-gradient(90deg, #D4AF37, #f0d060)", borderRadius: 4, height: 8, width: `${pct}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Orders Tab ────────────────────────────────────────
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const r = await orderAPI.getAll(params);
      setOrders(r.data.orders || []);
      setTotalPages(r.data.pages || 1);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const statuses = ["", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 22 }}>All Orders</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ background: "#1a1a1a", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, color: "#fff", padding: "8px 12px", fontSize: 13 }}>
            {statuses.map(s => <option key={s} value={s}>{s || "All Status"}</option>)}
          </select>
          <button onClick={fetchOrders} style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, color: "#D4AF37", padding: "8px 12px", cursor: "pointer" }}>
            <Icon d={icons.refresh} size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#D4AF37", textAlign: "center", padding: 60 }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ color: "#666", textAlign: "center", padding: 60 }}>No orders found</div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                  {["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Date", "Action"].map(h => (
                    <th key={h} style={{ color: "#888", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", padding: "10px 12px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px", color: "#D4AF37", fontSize: 13, fontFamily: "monospace" }}>
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <p style={{ color: "#fff", fontSize: 13 }}>{order.user?.name || "N/A"}</p>
                      <p style={{ color: "#666", fontSize: 11 }}>{order.user?.email || ""}</p>
                    </td>
                    <td style={{ padding: "12px", color: "#aaa", fontSize: 13 }}>
                      {order.items?.length} item(s)
                    </td>
                    <td style={{ padding: "12px", color: "#D4AF37", fontSize: 13, fontWeight: 600 }}>
                      ₹{order.totalAmount}
                    </td>
                    <td style={{ padding: "12px", color: "#aaa", fontSize: 12, textTransform: "uppercase" }}>
                      {order.paymentMethod}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td style={{ padding: "12px", color: "#666", fontSize: 12, whiteSpace: "nowrap" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => setSelectedOrder(order)}
                        style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 6, color: "#D4AF37", padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, color: "#D4AF37", padding: "6px 14px", cursor: "pointer" }}>
              Prev
            </button>
            <span style={{ color: "#aaa", padding: "6px 12px", fontSize: 13 }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6, color: "#D4AF37", padding: "6px 14px", cursor: "pointer" }}>
              Next
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <UpdateOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={fetchOrders} />
      )}
    </div>
  );
};

// ── Products Tab ──────────────────────────────────────
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await productAPI.getAll();
      setProducts(r.data.products || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productAPI.delete(id);
      fetchProducts();
    } catch { alert("Failed to delete product"); }
  };

  const handleToggleStock = async (id, current) => {
    try {
      await productAPI.update(id, JSON.stringify({ inStock: !current }));
      fetchProducts();
    } catch { alert("Failed to update stock"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 22 }}>Products ({products.length})</h2>
        <button onClick={fetchProducts}
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, color: "#D4AF37", padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#D4AF37", textAlign: "center", padding: 60 }}>Loading products...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ color: "#fff", fontSize: 15, fontFamily: "serif", marginBottom: 2 }}>{p.name}</h3>
                  <p style={{ color: "#888", fontSize: 12 }}>{p.nameHindi} • {p.category}</p>
                </div>
                <span style={{ background: p.inStock ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: p.inStock ? "#4ade80" : "#f87171", fontSize: 11, padding: "2px 8px", borderRadius: 20, border: `1px solid ${p.inStock ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}` }}>
                  {p.inStock ? "In Stock" : "Out"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#D4AF37", fontSize: 16, fontWeight: 700 }}>₹{p.price}</span>
                <span style={{ color: "#666", fontSize: 13, textDecoration: "line-through" }}>₹{p.mrp}</span>
              </div>

              <div style={{ display: "flex", gap: 6, fontSize: 12, color: "#666", marginBottom: 14 }}>
                <span>⭐ {p.rating}</span>
                <span>•</span>
                <span>{p.numReviews} reviews</span>
                <span>•</span>
                <span>Stock: {p.stockCount}</span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleToggleStock(p._id, p.inStock)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#aaa", padding: "7px", cursor: "pointer", fontSize: 12 }}>
                  {p.inStock ? "Mark Out" : "Mark In Stock"}
                </button>
                <button onClick={() => handleDelete(p._id, p.name)}
                  style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 6, color: "#f87171", padding: "7px 10px", cursor: "pointer" }}>
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Customers Tab ─────────────────────────────────────
const CustomersTab = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users").then(r => { setCustomers(r.data.users || r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleToggle = async (id, isActive) => {
    try {
      await API.put(`/users/${id}/toggle-status`);
      setCustomers(prev => prev.map(c => c._id === id ? { ...c, isActive: !isActive } : c));
    } catch { alert("Failed to update user"); }
  };

  return (
    <div>
      <h2 style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 22, marginBottom: 20 }}>Customers ({customers.length})</h2>

      {loading ? (
        <div style={{ color: "#D4AF37", textAlign: "center", padding: 60 }}>Loading customers...</div>
      ) : customers.length === 0 ? (
        <div style={{ color: "#666", textAlign: "center", padding: 60 }}>No customers found</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                {["Name", "Email", "Phone", "Role", "Status", "Joined", "Action"].map(h => (
                  <th key={h} style={{ color: "#888", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", padding: "10px 12px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px", color: "#fff", fontSize: 14 }}>{c.name}</td>
                  <td style={{ padding: "12px", color: "#aaa", fontSize: 13 }}>{c.email}</td>
                  <td style={{ padding: "12px", color: "#aaa", fontSize: 13 }}>{c.phone || "—"}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: c.role === "admin" ? "#D4AF37" : "#888", fontSize: 12, textTransform: "uppercase", fontWeight: c.role === "admin" ? 700 : 400 }}>
                      {c.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: c.isActive !== false ? "#4ade80" : "#f87171", fontSize: 12 }}>
                      {c.isActive !== false ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#666", fontSize: 12 }}>
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {c.role !== "admin" && (
                      <button onClick={() => handleToggle(c._id, c.isActive !== false)}
                        style={{ background: c.isActive !== false ? "rgba(248,113,113,0.1)" : "rgba(74,222,128,0.1)", border: `1px solid ${c.isActive !== false ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.3)"}`, borderRadius: 6, color: c.isActive !== false ? "#f87171" : "#4ade80", padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>
                        {c.isActive !== false ? "Block" : "Unblock"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Main Admin Panel ──────────────────────────────────
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = (() => { try { return JSON.parse(localStorage.getItem("smrita_user")); } catch { return null; } })();

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#D4AF37" }}>
          <p style={{ fontFamily: "serif", fontSize: 24, marginBottom: 8 }}>Access Denied</p>
          <p style={{ color: "#666", fontSize: 14 }}>Admin access required</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
    { id: "orders", label: "Orders", icon: icons.orders },
    { id: "products", label: "Products", icon: icons.products },
    { id: "customers", label: "Customers", icon: icons.customers },
  ];

  const handleLogout = () => {
    localStorage.removeItem("smrita_token");
    localStorage.removeItem("smrita_user");
    window.location.href = "/";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 64, transition: "width 0.3s", background: "#0d0d0d",
        borderRight: "1px solid rgba(212,175,55,0.15)", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 16px", borderBottom: "1px solid rgba(212,175,55,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #D4AF37, #f0d060)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>🪔</span>
          </div>
          {sidebarOpen && (
            <div>
              <p style={{ color: "#D4AF37", fontFamily: "serif", fontSize: 16, fontWeight: 700 }}>SMRITA</p>
              <p style={{ color: "#666", fontSize: 10, letterSpacing: 1 }}>ADMIN PANEL</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 8px" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
                borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left",
                background: activeTab === tab.id ? "rgba(212,175,55,0.12)" : "transparent",
                color: activeTab === tab.id ? "#D4AF37" : "#666",
                borderLeft: activeTab === tab.id ? "2px solid #D4AF37" : "2px solid transparent",
                transition: "all 0.2s"
              }}>
              <Icon d={tab.icon} size={18} />
              {sidebarOpen && <span style={{ fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400 }}>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
          {sidebarOpen && (
            <div style={{ padding: "8px 12px", marginBottom: 8 }}>
              <p style={{ color: "#aaa", fontSize: 12 }}>{user.name}</p>
              <p style={{ color: "#666", fontSize: 11 }}>{user.email}</p>
            </div>
          )}
          <button onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#f87171", cursor: "pointer" }}>
            <Icon d={icons.logout} size={18} />
            {sidebarOpen && <span style={{ fontSize: 14 }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(212,175,55,0.1)", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: 4 }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div style={{ marginLeft: "auto" }}>
            <a href="/" style={{ color: "#666", fontSize: 13, textDecoration: "none" }}>← Back to Store</a>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "28px 24px" }}>
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "customers" && <CustomersTab />}
        </div>
      </div>
    </div>
  );
}
