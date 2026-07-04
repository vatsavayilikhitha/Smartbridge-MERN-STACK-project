import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#FDF9F5',
                color: '#1A0B0F',
                border: '1px solid #D4C4A8',
                borderRadius: '8px',
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.9375rem',
              },
              success: {
                iconTheme: { primary: '#3D7A5C', secondary: '#EBF7F2' },
              },
              error: {
                iconTheme: { primary: '#A52A2A', secondary: '#FDECEA' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
