
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Navbar from './components/Navbar';

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
