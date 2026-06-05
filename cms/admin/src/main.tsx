import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#22d3ee' },
    secondary: { main: '#8b5cf6' },
    background: { default: '#0b1220', paper: '#111827' },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
