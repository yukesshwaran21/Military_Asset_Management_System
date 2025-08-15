import React, { useState } from 'react';
import { Paper, TextField, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (e) { setErr(e.message); }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 420, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Sign in</Typography>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <TextField label="Username" name="username" value={form.username} onChange={onChange} required />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={onChange} required />
          {err && <Typography color="error">{err}</Typography>}
          <Button variant="contained" type="submit">Login</Button>
        </Stack>
      </form>
    </Paper>
  );
}
