
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Navbar from './components/Navbar';
import CourseDetails from './pages/CourseDetails';
import CoursePlayer from './pages/CoursePlayer';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseCreate from './pages/AdminCourseCreate';
import AdminCourseEdit from './pages/AdminCourseEdit';
import AdminCoursesList from './features/admin/courses/AdminCoursesList';
import AdminCourseBuilder from './features/admin/courses/AdminCourseBuilder';
import PaymentSuccess from './pages/PaymentSuccess';

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("=== PrivateRoutes ===", { isAuthenticated, isLoading });
  debugger; // ← freeze here

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
    // <Router>
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
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/learn/:courseId" element={<CoursePlayer />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCoursesList />} />
            <Route path="/admin/courses/create" element={<AdminCourseCreate />} />
            <Route path="/admin/courses/:id/edit" element={<AdminCourseEdit />} />
            <Route path="/admin/courses/:courseId/builder" element={<AdminCourseBuilder />} />
          </Route>

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

      </main>
    </div>
    // </Router>
  );
}

export default App;
