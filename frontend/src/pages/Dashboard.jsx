import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Paper, Grid, Typography, Stack, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Divider } from '@mui/material';
import { apiGet } from '../api';

export default function Dashboard() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ base:'', asset:'', from:'', to:'' });
  const [metrics, setMetrics] = useState(null);
  const [open, setOpen] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [transferDetails, setTransferDetails] = useState([]);

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

  const handleDetailsOpen = async () => {
    setOpen(true);
    // Fetch purchases and transfers for current filters
    const [purchases, transfers] = await Promise.all([
      apiGet('/api/purchases', filters),
      apiGet('/api/transfers', filters)
    ]);
    setPurchaseDetails(purchases);
    setTransferDetails(transfers);
  };

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
              <Button size="small" onClick={handleDetailsOpen}>Details</Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}><Typography variant="overline">Assigned / Expended</Typography><Typography variant="h6">{metrics?.assigned ?? 0} / {metrics?.expended ?? 0}</Typography></Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Net Movement Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle1">Purchases</Typography>
            {purchaseDetails.length === 0 ? (
              <Typography color="text.secondary">No purchases found.</Typography>
            ) : (
              <Stack spacing={1}>
                {purchaseDetails.map((p, idx) => (
                  <Paper key={p._id || idx} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 18 }}><span style={{ color: '#90caf9' }}>Base:</span> {p.base?.name ?? '-'}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#ffb74d' }}>Asset:</span> {p.asset?.name ?? '-'}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#81c784' }}>Quantity:</span> {p.quantity}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#e57373' }}>Date:</span> {new Date(p.date).toLocaleDateString()}</Typography>
                  </Paper>
                ))}
              </Stack>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Transfers</Typography>
            {transferDetails.length === 0 ? (
              <Typography color="text.secondary">No transfers found.</Typography>
            ) : (
              <Stack spacing={1}>
                {transferDetails.map((t, idx) => (
                  <Paper key={t._id || idx} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 18 }}><span style={{ color: '#90caf9' }}>From Base:</span> {t.fromBase?.name ?? '-'}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#90caf9' }}>To Base:</span> {t.toBase?.name ?? '-'}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#ffb74d' }}>Asset:</span> {t.asset?.name ?? '-'}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#81c784' }}>Quantity:</span> {t.quantity}</Typography>
                    <Typography sx={{ fontWeight: 600 }}><span style={{ color: '#e57373' }}>Date:</span> {new Date(t.date).toLocaleDateString()}</Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
