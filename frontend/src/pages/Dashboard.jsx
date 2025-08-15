import React, { useEffect, useState } from 'react';
import { Paper, Grid, Typography, Stack, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem } from '@mui/material';
import { apiGet } from '../api';

export default function Dashboard() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ base:'', asset:'', from:'', to:'' });
  const [metrics, setMetrics] = useState(null);
  const [open, setOpen] = useState(false);

  const loadRefs = async () => {
    const [b, a] = await Promise.all([apiGet('/api/bases'), apiGet('/api/assets')]);
    setBases(b); setAssets(a);
  };

  const loadMetrics = async () => {
    const m = await apiGet('/api/metrics', filters);
    setMetrics(m);
  };

  useEffect(()=>{ loadRefs(); },[]);
  useEffect(()=>{ loadMetrics(); /* eslint-disable-next-line */ },[]);

  const apply = async () => loadMetrics();

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField select fullWidth label="Base" value={filters.base} onChange={e=>setFilters(f=>({...f, base:e.target.value}))}>
              <MenuItem value="">All</MenuItem>
              {bases.map(b=> <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField select fullWidth label="Asset" value={filters.asset} onChange={e=>setFilters(f=>({...f, asset:e.target.value}))}>
              <MenuItem value="">All</MenuItem>
              {assets.map(a=> <MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField type="date" fullWidth label="From" InputLabelProps={{ shrink:true }} value={filters.from} onChange={e=>setFilters(f=>({...f, from:e.target.value}))}/>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField type="date" fullWidth label="To" InputLabelProps={{ shrink:true }} value={filters.to} onChange={e=>setFilters(f=>({...f, to:e.target.value}))}/>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={apply}>Apply</Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}><Typography variant="overline">Opening Balance</Typography><Typography variant="h4">{metrics?.openingBalance ?? '-'}</Typography></Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}><Typography variant="overline">Closing Balance</Typography><Typography variant="h4">{metrics?.closingBalance ?? '-'}</Typography></Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline">Net Movement</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4">{metrics?.netMovement ?? '-'}</Typography>
              <Button size="small" onClick={()=>setOpen(true)}>Details</Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}><Typography variant="overline">Assigned / Expended</Typography><Typography variant="h6">{metrics?.assigned ?? 0} / {metrics?.expended ?? 0}</Typography></Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Net Movement Breakdown</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography>Purchases: <b>{metrics?.breakdown?.purchases ?? 0}</b></Typography>
            <Typography>Transfer In: <b>{metrics?.breakdown?.transferIn ?? 0}</b></Typography>
            <Typography>Transfer Out: <b>{metrics?.breakdown?.transferOut ?? 0}</b></Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
