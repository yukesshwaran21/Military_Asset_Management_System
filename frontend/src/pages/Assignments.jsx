import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';

export default function Assignments() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assignForm, setAssignForm] = useState({ personnelName:'', base:'', asset:'', quantity:1, date:'' });
  const [expForm, setExpForm] = useState({ base:'', asset:'', quantity:1, date:'' });
  const [msgA, setMsgA] = useState('');
  const [msgE, setMsgE] = useState('');

  useEffect(()=>{
    (async ()=>{
      const [b,a] = await Promise.all([apiGet('/api/bases'), apiGet('/api/assets')]);
      setBases(b); setAssets(a);
    })();
  },[]);

  const changeA = e => setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  const changeE = e => setExpForm({ ...expForm, [e.target.name]: e.target.value });

  const submitA = async (e) => {
    e.preventDefault(); setMsgA('');
    try { await apiPost('/api/assignments', assignForm); setMsgA('Assignment saved'); }
    catch (e) { setMsgA('Error: ' + e.message); }
  };

  const submitE = async (e) => {
    e.preventDefault(); setMsgE('');
    try { await apiPost('/api/expenditures', expForm); setMsgE('Expenditure recorded'); }
    catch (e) { setMsgE('Error: ' + e.message); }
  };

  return (
    <main>
      <section>
        <h2>Assign Assets</h2>
        <form onSubmit={submitA}>
          <div>
            <label>Personnel Name
              <input name="personnelName" value={assignForm.personnelName} onChange={changeA} required />
            </label>
          </div>
          <div>
            <label>Base
              <select name="base" value={assignForm.base} onChange={changeA} required>
                <option value="">Select Base</option>
                {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </label>
          </div>
          <div>
            <label>Asset
              <select name="asset" value={assignForm.asset} onChange={changeA} required>
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </label>
          </div>
          <div>
            <label>Quantity
              <input type="number" name="quantity" value={assignForm.quantity} onChange={changeA} min={1} required />
            </label>
          </div>
          <div>
            <label>Date
              <input type="date" name="date" value={assignForm.date} onChange={changeA} />
            </label>
          </div>
          <button type="submit">Save Assignment</button>
          {msgA && <div>{msgA}</div>}
        </form>
      </section>

      <hr />

      <section>
        <h2>Record Expenditure</h2>
        <form onSubmit={submitE}>
          <div>
            <label>Base
              <select name="base" value={expForm.base} onChange={changeE} required>
                <option value="">Select Base</option>
                {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </label>
          </div>
          <div>
            <label>Asset
              <select name="asset" value={expForm.asset} onChange={changeE} required>
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </label>
          </div>
          <div>
            <label>Quantity
              <input type="number" name="quantity" value={expForm.quantity} onChange={changeE} min={1} required />
            </label>
          </div>
          <div>
            <label>Date
              <input type="date" name="date" value={expForm.date} onChange={changeE} />
            </label>
          </div>
          <button type="submit">Record</button>
          {msgE && <div>{msgE}</div>}
        </form>
      </section>
    </main>
  );
}