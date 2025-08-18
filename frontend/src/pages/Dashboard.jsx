import React, { useState, useEffect } from "react";
// import { apiGet } from "../api"; // Assuming api.js is in the same directory or configured
import './Dashboard.css';

// Mock apiGet for demonstration since we don't have the backend
const apiGet = async (url, params) => {
  console.log(`Fetching ${url} with params`, params);
  await new Promise(res => setTimeout(res, 500)); // Simulate network delay
  if (url.includes('bases')) return [{ _id: '1', name: 'Main Base' }, { _id: '2', name: 'Forward Outpost' }];
  if (url.includes('assets')) return [{ _id: '1', name: 'Vehicles' }, { _id: '2', name: 'Comms Gear' }];
  if (url.includes('metrics')) return { openingBalance: 0, closingBalance: 0, netMovement: 2, assigned: 1, expended: 1 };
  if (url.includes('purchases')) return [{ _id: 'p1', base: { name: 'Main Base' }, asset: { name: 'Vehicles' }, quantity: 5, date: new Date() }];
  if (url.includes('transfers')) return [{ _id: 't1', fromBase: { name: 'Main Base' }, toBase: { name: 'Forward Outpost' }, asset: { name: 'Vehicles' }, quantity: 3, date: new Date() }];
  return [];
};


export default function Dashboard() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ base:'', asset:'', from:'', to:'' });
  const [metrics, setMetrics] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [transferDetails, setTransferDetails] = useState([]);

  useEffect(()=>{
    (async()=>{
      const [b, a] = await Promise.all([apiGet('/api/bases'), apiGet('/api/assets')]);
      setBases(b); setAssets(a);
    })();
  },[]);

  const fetchMetrics = async (currentFilters) => {
    const m = await apiGet('/api/metrics', currentFilters);
    setMetrics(m);
  };

  useEffect(()=>{
    fetchMetrics(filters);
  },[filters]);

  const setDateRange = (from, to) => {
    setFilters(f => ({ ...f, from, to }));
  };

  const setThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    setDateRange(firstDay, lastDay);
  };

  const setLast7Days = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setDateRange(sevenDaysAgo, today);
  };

  const handleDetailsOpen = async () => {
    setIsDetailsOpen(true);
    const [purchases, transfers] = await Promise.all([
      apiGet('/api/purchases', filters),
      apiGet('/api/transfers', filters)
    ]);
    setPurchaseDetails(purchases);
    setTransferDetails(transfers);
  };

  const netSign = metrics?.netMovement > 0 ? '+' : '';

  return (
  <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="dashboard-title">Military Asset Management</h1>
        <div className="nav-links">
          <a href="#dashboard" className="active">Dashboard</a>
          <a href="#purchases">Purchases</a>
          <a href="#transfers">Transfers</a>
          <a href="#assignments">Assignments</a>
          <a href="#logout">Logout</a>
        </div>
      </nav>

      <form className="filter-form" onSubmit={e => { e.preventDefault(); fetchMetrics(filters); }}>
        <div className="filter-group">
          <label htmlFor="base">Base</label>
          <select id="base" value={filters.base} onChange={e => setFilters(f => ({...f, base: e.target.value}))}>
            <option value="">All</option>
            {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="asset">Equipment Type</label>
          <select id="asset" value={filters.asset} onChange={e => setFilters(f => ({...f, asset: e.target.value}))}>
            <option value="">All</option>
            {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="from">From Date</label>
          <input type="date" id="from" value={filters.from} onChange={e => setFilters(f => ({...f, from: e.target.value}))} />
        </div>
        <div className="filter-group">
          <label htmlFor="to">To Date</label>
          <input type="date" id="to" value={filters.to} onChange={e => setFilters(f => ({...f, to: e.target.value}))} />
        </div>
        <div className="filter-actions">
            <button type="button" className="action-btn secondary" onClick={setThisMonth}>This Month</button>
            <button type="button" className="action-btn secondary" onClick={setLast7Days}>Last 7 Days</button>
            <button type="submit" className="action-btn primary">Apply</button>
        </div>
      </form>

      <div className="kpi-grid">
        <button className="kpi-card" onClick={handleDetailsOpen}>
          <span className="kpi-title">Opening Balance</span>
          <span className="kpi-value">{metrics?.openingBalance ?? '-'}</span>
        </button>
        <button className="kpi-card" onClick={handleDetailsOpen}>
          <span className="kpi-title">Closing Balance</span>
          <span className="kpi-value">{metrics?.closingBalance ?? '-'}</span>
        </button>
        <button className="kpi-card" onClick={handleDetailsOpen}>
          <span className="kpi-title">Net Movement</span>
          <span className={`kpi-value ${metrics?.netMovement > 0 ? 'positive' : metrics?.netMovement < 0 ? 'negative' : ''}`}>
            {netSign}{metrics?.netMovement ?? '-'}
          </span>
        </button>
        <button className="kpi-card" onClick={handleDetailsOpen}>
          <span className="kpi-title">Assigned / Expended</span>
          <span className="kpi-value small">{metrics?.assigned ?? 0} / {metrics?.expended ?? 0}</span>
        </button>
      </div>

      <div className="visualization-section">
        <div className="chart-container">
          <h3 className="chart-title">Assets by Type</h3>
          <div className="chart-placeholder">[Bar Chart]</div>
        </div>
        <div className="chart-container">
          <h3 className="chart-title">Asset Movement Over Time</h3>
          <div className="chart-placeholder">[Line Chart]</div>
        </div>
      </div>

      {isDetailsOpen && (
        <div className="popup-overlay" onClick={() => setIsDetailsOpen(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Net Movement Details</h2>
              <button className="popup-close-btn" onClick={() => setIsDetailsOpen(false)}>&times;</button>
            </div>
            <div className="popup-body">
              <div className="popup-section">
                  <h4>Purchases</h4>
                  {purchaseDetails.length > 0 ? purchaseDetails.map((p, idx) => (
                      <div key={p._id || idx} className="popup-item">
                          <span>{p.quantity}x {p.asset?.name} at {p.base?.name}</span>
                          <span className="popup-date">{new Date(p.date).toLocaleDateString()}</span>
                      </div>
                  )) : <p className="no-data">No purchases in this period.</p>}
              </div>
              <div className="popup-section">
                  <h4>Transfers</h4>
                  {transferDetails.length > 0 ? transferDetails.map((t, idx) => (
                      <div key={t._id || idx} className="popup-item">
                          <span>{t.quantity}x {t.asset?.name}: {t.fromBase?.name} → {t.toBase?.name}</span>
                          <span className="popup-date">{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                  )) : <p className="no-data">No transfers in this period.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}