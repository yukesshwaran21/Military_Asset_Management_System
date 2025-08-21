import React, { useState, useEffect } from "react";
import { apiGet } from "../api";

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
    <div>
      <form onSubmit={e => { e.preventDefault(); fetchMetrics(filters); }}>
        <div>
          <label htmlFor="base">Base</label>
          <select id="base" value={filters.base} onChange={e => setFilters(f => ({...f, base: e.target.value}))}>
            <option value="">All</option>
            {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="asset">Equipment Type</label>
          <select id="asset" value={filters.asset} onChange={e => setFilters(f => ({...f, asset: e.target.value}))}>
            <option value="">All</option>
            {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="from">From Date</label>
          <input type="date" id="from" value={filters.from} onChange={e => setFilters(f => ({...f, from: e.target.value}))} />
        </div>
        <div>
          <label htmlFor="to">To Date</label>
          <input type="date" id="to" value={filters.to} onChange={e => setFilters(f => ({...f, to: e.target.value}))} />
        </div>
        <div>
          <button type="button" onClick={setThisMonth}>This Month</button>
          <button type="button" onClick={setLast7Days}>Last 7 Days</button>
          <button type="submit">Apply</button>
        </div>
      </form>

      <div>
        <div onClick={handleDetailsOpen}>
          <span>Opening Balance</span>
          <span>{metrics?.openingBalance ?? '-'}</span>
        </div>
        <div onClick={handleDetailsOpen}>
          <span>Closing Balance</span>
          <span>{metrics?.closingBalance ?? '-'}</span>
        </div>
        <div onClick={handleDetailsOpen}>
          <span>Net Movement</span>
          <span>{netSign}{metrics?.netMovement ?? '-'}</span>
        </div>
        <div onClick={handleDetailsOpen}>
          <span>Assigned / Expended</span>
          <span>{metrics?.assigned ?? 0} / {metrics?.expended ?? 0}</span>
        </div>
      </div>

  <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title"><h3>Assets by Type</h3></div>
          </div>
          <div className="metric-value">[Bar Chart]</div>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title"><h3>Asset Movement Over Time</h3></div>
          </div>
          <div className="metric-value">[Line Chart]</div>
        </div>
      </div>

      {isDetailsOpen && (
        <div className="activity-section" onClick={() => setIsDetailsOpen(false)}>
          <div className="activity-feed" onClick={e => e.stopPropagation()}>
            <div className="section-header">
              <div className="section-title"><h2>Net Movement Details</h2></div>
              <button className="view-all-btn" onClick={() => setIsDetailsOpen(false)}>&times;</button>
            </div>
            <div>
              <div className="activity-item">
                  <h4>Purchases</h4>
                  {purchaseDetails.length > 0 ? purchaseDetails.map((p, idx) => (
                      <div key={p._id || idx} className="activity-content">
                          <span>{p.quantity}x {p.asset?.name} at {p.base?.name}</span>
                          <span className="activity-meta">{new Date(p.date).toLocaleDateString()}</span>
                      </div>
                  )) : <p className="activity-meta">No purchases in this period.</p>}
              </div>
              <div className="activity-item">
                  <h4>Transfers</h4>
                  {transferDetails.length > 0 ? transferDetails.map((t, idx) => (
                      <div key={t._id || idx} className="activity-content">
                          <span>{t.quantity}x {t.asset?.name}: {t.fromBase?.name} → {t.toBase?.name}</span>
                          <span className="activity-meta">{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                  )) : <p className="activity-meta">No transfers in this period.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}