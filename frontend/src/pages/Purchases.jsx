import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';

export default function Purchases() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ base:'', asset:'', quantity:1, date:'' });
  const [message, setMessage] = useState('');

  useEffect(()=>{
    (async ()=>{
      const [b,a] = await Promise.all([apiGet('/api/bases'), apiGet('/api/assets')]);
      setBases(b); setAssets(a);
    })();
  },[]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try { await apiPost('/api/purchases', form); setMessage('Purchase recorded'); }
    catch (e) { setMessage('Error: ' + e.message); }
  };

  return (
    <div>
      <h2>Record Purchase</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="base">Base</label>
          <select id="base" name="base" value={form.base} onChange={onChange} required>
            <option value="">Select Base</option>
            {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="asset">Asset</label>
          <select id="asset" name="asset" value={form.asset} onChange={onChange} required>
            <option value="">Select Asset</option>
            {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={onChange}
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
          />
        </div>
        <button type="submit">Submit</button>
        {message && <div role="alert">{message}</div>}
      </form>
    </div>
  );
}
