import React, { useEffect, useState } from 'react';
import './Transfers.css';
import { Paper, Stack, TextField, MenuItem, Button, Typography } from '@mui/material';
import { apiGet, apiPost } from '../api';

export default function Transfers() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ fromBase:'', toBase:'', asset:'', quantity:1, date:'' });
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
    try { await apiPost('/api/transfers', form); setMessage('Transfer recorded'); }
    catch (e) { setMessage('Error: ' + e.message); }
  };

  return (
    <Paper sx={{ p:3, maxWidth: 640 }}>
      <Typography variant="h6" gutterBottom>Transfer Assets</Typography>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <TextField select label="From Base" name="fromBase" value={form.fromBase} onChange={onChange} required>
            {bases.map(b=><MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
          </TextField>
          <TextField select label="To Base" name="toBase" value={form.toBase} onChange={onChange} required>
            {bases.map(b=><MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
          </TextField>
          <TextField select label="Asset" name="asset" value={form.asset} onChange={onChange} required>
            {assets.map(a=><MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>)}
          </TextField>
          <TextField type="number" label="Quantity" name="quantity" value={form.quantity} onChange={onChange} inputProps={{ min:1 }} required />
          <TextField type="date" label="Date" name="date" value={form.date} onChange={onChange} InputLabelProps={{ shrink:true }} />
          <Button variant="contained" type="submit">Submit</Button>
          {message && <Typography>{message}</Typography>}
        </Stack>
      </form>
    </Paper>
  );
}
