import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './pages/home/contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Subjects from './components/Subjects';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/home/DashboardPage';
import ProfilePage from './pages/home/ProfilePage';
import SettingsPage from './pages/home/SettingsPage';
import SocialStudiesWrapper from './pages/SocialStudiesWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

// Import SciencePage directly instead of lazy loading to avoid dynamic import issues
import SciencePage from './pages/SciencePage';
import MathPage from './pages/MathPage';

// Error Boundary for Science Page
class SciencePageErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SciencePage Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-3xl">⚠</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to Load Science Section
            </h2>
            <p className="text-gray-600 mb-6">
              There was an error loading the science content. Please try refreshing the page.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>Error details:</p>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={
              <div className="min-h-screen bg-primary-bg">
                <CursorTrail />
                <Header />
                <Hero />
                <Features />
                <Subjects />
                <HowItWorks />
                <Testimonials />
                <Footer />
              </div>
            } />
            
            {/* Home Page Routes - Protected */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/science" element={
              <ProtectedRoute>
                <SciencePageErrorBoundary>
                  <SciencePage />
                </SciencePageErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/social-studies" element={
              <ProtectedRoute>
                <SocialStudiesWrapper />
              </ProtectedRoute>
            } />
            <Route path="/math" element={
              <ProtectedRoute>
                <MathPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
