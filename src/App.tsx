import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AppProviders } from './context/AppProviders';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Upload } from './pages/Upload';
import { DocumentDetail } from './pages/Document';
import { Flashcards } from './pages/Flashcards';
import { Quiz } from './pages/Quiz';
import { Review } from './pages/Review';
import { Mnemonics } from './pages/Mnemonics';
import { Insights } from './pages/Insights';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
export function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/review" element={<Review />} />
              <Route path="/mnemonics" element={<Mnemonics />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AppProviders>);

}
