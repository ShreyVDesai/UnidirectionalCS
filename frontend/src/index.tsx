import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root')!);
 const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>   
        <CssBaseline />
        <AuthProvider>
        <App />
    </AuthProvider>
    </ThemeProvider>
    
    </BrowserRouter>
  </React.StrictMode>
);
