import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NQueens from './pages/NQueens';
import LCS from './pages/LCS';
import Trie from './pages/Trie';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nqueens" element={<NQueens />} />
            <Route path="/lcs" element={<LCS />} />
            <Route path="/trie" element={<Trie />} />
          </Routes>
        </Layout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-text)',
              border: '1px solid var(--toast-border)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
      </Router>
    </AppProvider>
  );
}

export default App;