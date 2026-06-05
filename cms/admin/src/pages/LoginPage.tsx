import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@corebridge.security');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, mfaCode || undefined);
      navigate('/');
    } catch {
      setError('Invalid credentials or MFA code');
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          CMS Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="MFA Code (if enabled)"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained">
            Sign in
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
