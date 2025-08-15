import React, { useEffect, useState } from 'react';
import './Assignments.css';
import { Paper, Stack, TextField, MenuItem, Button, Typography, Divider } from '@mui/material';
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
    <Stack spacing={4}>
      <Paper sx={{ p:3, maxWidth: 720 }}>
        <Typography variant="h6" gutterBottom>Assign Assets</Typography>
        <form onSubmit={submitA}>
          <Stack spacing={2}>
            <TextField label="Personnel Name" name="personnelName" value={assignForm.personnelName} onChange={changeA} required />
            <TextField select label="Base" name="base" value={assignForm.base} onChange={changeA} required>
              {bases.map(b=><MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
            </TextField>
            <TextField select label="Asset" name="asset" value={assignForm.asset} onChange={changeA} required>
              {assets.map(a=><MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>)}
            </TextField>
            <TextField type="number" label="Quantity" name="quantity" value={assignForm.quantity} onChange={changeA} inputProps={{ min:1 }} required />
            <TextField type="date" label="Date" name="date" value={assignForm.date} onChange={changeA} InputLabelProps={{ shrink:true }} />
            <Button variant="contained" type="submit">Save Assignment</Button>
            {msgA && <Typography>{msgA}</Typography>}
          </Stack>
        </form>
      </Paper>

      <Divider />

      <Paper sx={{ p:3, maxWidth: 720 }}>
        <Typography variant="h6" gutterBottom>Record Expenditure</Typography>
        <form onSubmit={submitE}>
          <Stack spacing={2}>
            <TextField select label="Base" name="base" value={expForm.base} onChange={changeE} required>
              {bases.map(b=><MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
            </TextField>
            <TextField select label="Asset" name="asset" value={expForm.asset} onChange={changeE} required>
              {assets.map(a=><MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>)}
            </TextField>
            <TextField type="number" label="Quantity" name="quantity" value={expForm.quantity} onChange={changeE} inputProps={{ min:1 }} required />
            <TextField type="date" label="Date" name="date" value={expForm.date} onChange={changeE} InputLabelProps={{ shrink:true }} />
            <Button variant="contained" type="submit">Record</Button>
            {msgE && <Typography>{msgE}</Typography>}
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
