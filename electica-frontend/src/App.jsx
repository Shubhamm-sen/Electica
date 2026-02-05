import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreatePollPage from './pages/CreatePollPage';
import PollListPage from './pages/PollListPage';
import PollDetailsPage from './pages/PollDetailsPage';
import PollResultsPage from './pages/PollResultsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="about" element={<div className="p-8 dark:text-white">About Page</div>} />
              <Route path="contact" element={<div className="p-8 dark:text-white">Contact Page</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Authenticated Routes with Sidebar */}
            <Route element={
              <ProtectedRoute>
                <AuthLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-poll" element={<CreatePollPage />} />
              <Route path="polls" element={<PollListPage />} />
              <Route path="polls/:id" element={<PollDetailsPage />} />
              <Route path="polls/:id/results" element={<PollResultsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
