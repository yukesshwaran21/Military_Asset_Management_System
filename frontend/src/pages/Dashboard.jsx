import React, { useState, useEffect } from "react";
import { apiGet } from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ base:'', asset:'', from:'', to:'' });
  const [metrics, setMetrics] = useState(null);
  const [open, setOpen] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [transferDetails, setTransferDetails] = useState([]);

  useEffect(()=>{
    (async()=>{
      const [b, a] = await Promise.all([apiGet('/api/bases'), apiGet('/api/assets')]);
      setBases(b); setAssets(a);
    })();
  },[]);
  useEffect(()=>{
    (async()=>{
      const m = await apiGet('/api/metrics', filters);
      setMetrics(m);
    })();
  },[filters]);

  const apply = async () => {
    const m = await apiGet('/api/metrics', filters);
    setMetrics(m);
  };

  const handleDetailsOpen = async () => {
    setOpen(true);
    const [purchases, transfers] = await Promise.all([
      apiGet('/api/purchases', filters),
      apiGet('/api/transfers', filters)
    ]);
    setPurchaseDetails(purchases);
    setTransferDetails(transfers);
  };

  return (
    <div className="dashboard-root">
      <form className="dashboard-filters" onSubmit={e=>{e.preventDefault();apply();}}>
        <div>
          <label htmlFor="base">Base</label>
          <select id="base" value={filters.base} onChange={e=>setFilters(f=>({...f, base:e.target.value}))}>
            <option value="">All</option>
            {bases.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="asset">Equipment Type</label>
          <select id="asset" value={filters.asset} onChange={e=>setFilters(f=>({...f, asset:e.target.value}))}>
            <option value="">All</option>
            {assets.map(a=> <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="from">From Date</label>
          <input type="date" id="from" value={filters.from} onChange={e=>setFilters(f=>({...f, from:e.target.value}))}/>
        </div>
        <div>
          <label htmlFor="to">To Date</label>
          <input type="date" id="to" value={filters.to} onChange={e=>setFilters(f=>({...f, to:e.target.value}))}/>
        </div>
        <button className="dashboard-apply-btn" type="submit">Apply</button>
      </form>

      <div className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-title">Opening Balance</div>
          <div className="dashboard-metric-value">{metrics?.openingBalance ?? '-'}</div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-title">Closing Balance</div>
          <div className="dashboard-metric-value">{metrics?.closingBalance ?? '-'}</div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-title">Net Movement</div>
          <div className="dashboard-metric-value">{metrics?.netMovement ?? '-'}</div>
          <button className="dashboard-details-btn" onClick={handleDetailsOpen}>Details</button>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-title">Assigned / Expended</div>
          <div className="dashboard-metric-sub">{metrics?.assigned ?? 0} / {metrics?.expended ?? 0}</div>
        </div>
      </div>

      {open && (
        <div className="dashboard-popup" onClick={e=>{if(e.target.classList.contains('dashboard-popup'))setOpen(false);}}>
          <div className="dashboard-popup-content">
            <div className="dashboard-popup-header">
              <div className="dashboard-popup-title">Net Movement Details</div>
              <button className="dashboard-popup-close" onClick={()=>setOpen(false)}>&times;</button>
            </div>
            <div className="dashboard-popup-section">
              <div className="dashboard-popup-section-title">Purchases</div>
              <div className="dashboard-popup-list">
                {purchaseDetails.length === 0 ? (
                  <div style={{color:'#b0b8c1'}}>No purchases found.</div>
                ) : purchaseDetails.map((p, idx) => (
                  <div key={p._id || idx} className="dashboard-popup-item">
                    <div><span className="dashboard-popup-label">Base:</span> <span className="dashboard-popup-value">{p.base?.name ?? '-'}</span></div>
                    <div><span className="dashboard-popup-label">Asset:</span> <span className="dashboard-popup-value">{p.asset?.name ?? '-'}</span></div>
                    <div><span className="dashboard-popup-label">Quantity:</span> <span className="dashboard-popup-value">{p.quantity}</span></div>
                    <div className="dashboard-popup-date">{new Date(p.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-popup-section">
              <div className="dashboard-popup-section-title">Transfers</div>
              <div className="dashboard-popup-list">
                {transferDetails.length === 0 ? (
                  <div style={{color:'#b0b8c1'}}>No transfers found.</div>
                ) : transferDetails.map((t, idx) => (
                  <div key={t._id || idx} className="dashboard-popup-item">
                    <div><span className="dashboard-popup-label">From Base:</span> <span className="dashboard-popup-value">{t.fromBase?.name ?? '-'}</span></div>
                    <div><span className="dashboard-popup-label">To Base:</span> <span className="dashboard-popup-value">{t.toBase?.name ?? '-'}</span></div>
                    <div><span className="dashboard-popup-label">Asset:</span> <span className="dashboard-popup-value">{t.asset?.name ?? '-'}</span></div>
                    <div><span className="dashboard-popup-label">Quantity:</span> <span className="dashboard-popup-value">{t.quantity}</span></div>
                    <div className="dashboard-popup-date">{new Date(t.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
