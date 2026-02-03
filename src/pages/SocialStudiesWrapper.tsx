import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader, RefreshCw } from 'lucide-react';

// Lazy load the social page component
const SocialPageApp = React.lazy(() => import('../social_page/src/App'));

const SocialStudiesWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading timeout to 3 seconds max
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // ErrorBoundary equivalent for lazy loaded component
  class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("Error in SocialStudiesWrapper:", error, errorInfo);
      handleError();
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to Load Social Studies
              </h2>
              <p className="text-gray-600 mb-6">
                There was an error loading the social studies content. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </button>
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Back to Home Button - Fixed Position */}
      <button
        onClick={handleBackToHome}
        className="fixed top-4 right-4 z-50 flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Loading Social Studies...
              </h2>
              <p className="text-gray-600">
                Please wait a moment while we prepare your learning adventure.
              </p>
            </div>
          </div>
        }>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-40">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Loading Social Studies...
                </h2>
                <p className="text-gray-600">
                  Please wait a moment while we prepare your learning adventure.
                </p>
              </div>
            </div>
          )}
          <div className={isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
            <SocialPageApp />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SocialStudiesWrapper;
