import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function getRole() {
  const t = localStorage.getItem('token');
  if (!t) return null;
  try { return JSON.parse(atob(t.split('.')[1])).role; } catch { return null; }
}

export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
        <Typography variant="h6">Military Asset Management</Typography>
        <Stack direction="row" spacing={1}>
          {role && <Button component={RouterLink} to="/dashboard" color="inherit">Dashboard</Button>}
          {role && <Button component={RouterLink} to="/purchases" color="inherit">Purchases</Button>}
          {role && <Button component={RouterLink} to="/transfers" color="inherit">Transfers</Button>}
          {(role === 'Admin' || role === 'Commander') && (
            <Button component={RouterLink} to="/assignments" color="inherit">Assignments</Button>
          )}
          {!role
            ? <Button component={RouterLink} to="/login" color="inherit">Login</Button>
            : <Button onClick={logout} color="inherit">Logout</Button>}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
