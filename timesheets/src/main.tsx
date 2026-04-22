import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './lib/store';
import './index.css';

// HashRouter is used for the no-server CDN preview (raw.githack / statically.io
// can't do SPA fallback). BrowserRouter is used for real hosting (Pages, Vercel).
const useHashRouter = import.meta.env.VITE_USE_HASH_ROUTER === '1';
const Router = useHashRouter ? HashRouter : BrowserRouter;
const basename = useHashRouter
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename={basename}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Router>
  </React.StrictMode>,
);
