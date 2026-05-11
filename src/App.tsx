import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import AuthGate from './components/AuthGate';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Home from './pages/Home';
import NQueens from './pages/NQueens';
import LCS from './pages/LCS';
import Trie from './pages/Trie';
import WordLadder from './pages/WordLadder';
import TrappingWater from './pages/TrappingWater';
import RottingOranges from './pages/RottingOranges';
import SuperEggDrop from './pages/SuperEggDrop';
import MergeIntervals from './pages/MergeIntervals';
import SlidingWindow from './pages/SlidingWindow';
import CourseSchedule from './pages/CourseSchedule';
import CoinChange from './pages/CoinChange';
import LIS from './pages/LIS';
import Dijkstra from './pages/Dijkstra';
import Knapsack from './pages/Knapsack';
import EditDistance from './pages/EditDistance';
import KthLargest from './pages/KthLargest';
import LearningPath from './pages/LearningPath';
import Glossary from './pages/Glossary';
import FeedbackInbox from './pages/FeedbackInbox';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <LearningProvider>
          <Router>
            <AuthGate>
              <Layout>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/nqueens" element={<NQueens />} />
                    <Route path="/lcs" element={<LCS />} />
                    <Route path="/trie" element={<Trie />} />
                    <Route path="/word-ladder" element={<WordLadder />} />
                    <Route path="/trapping-water" element={<TrappingWater />} />
                    <Route path="/rotting-oranges" element={<RottingOranges />} />
                    <Route path="/super-egg-drop" element={<SuperEggDrop />} />
                    <Route path="/merge-intervals" element={<MergeIntervals />} />
                    <Route path="/sliding-window" element={<SlidingWindow />} />
                    <Route path="/course-schedule" element={<CourseSchedule />} />
                    <Route path="/coin-change" element={<CoinChange />} />
                    <Route path="/lis" element={<LIS />} />
                    <Route path="/dijkstra" element={<Dijkstra />} />
                    <Route path="/knapsack" element={<Knapsack />} />
                    <Route path="/edit-distance" element={<EditDistance />} />
                    <Route path="/kth-largest" element={<KthLargest />} />
                    <Route path="/learning-path" element={<LearningPath />} />
                    <Route path="/glossary" element={<Glossary />} />
                    <Route path="/admin/feedback" element={<FeedbackInbox />} />
                    {/* 404 fallback */}
                    <Route
                      path="*"
                      element={
                        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                          <p className="text-6xl">🗺️</p>
                          <h2 className="text-2xl font-bold text-white">Page not found</h2>
                          <a href="/" className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                            Go Home
                          </a>
                        </div>
                      }
                    />
                  </Routes>
                </ErrorBoundary>
              </Layout>
            </AuthGate>
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
        </LearningProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;