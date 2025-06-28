// src/main.tsx

// 👇 Código de redirecionamento (adicione no topo)
const redirect = sessionStorage.redirectTo;
if (redirect) {
  history.replaceState(null, '', redirect);
  sessionStorage.removeItem('redirectTo');
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
