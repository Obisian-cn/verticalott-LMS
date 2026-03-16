
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Compass, Settings } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, children }: any) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium",
          isActive 
            ? "bg-indigo-600/10 text-indigo-600 shadow-sm" 
            : "text-slate-600 hover:bg-slate-100/80 hover:text-indigo-600"
        )}
      >
        <Icon className="w-4 h-4" />
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-indigo-100/50 supports-backdrop-blur:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-xl group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Celarinn LMS
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/courses" icon={Compass}>Explore</NavLink>
                {(user?.role === 'admin' || user?.role === 'instructor') && (
                  <NavLink to="/admin" icon={Settings}>Instructor</NavLink>
                )}
                
                <div className="h-6 w-px bg-slate-200 mx-2" />
                
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-slate-200/60 bg-white/50 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 pr-1">{user?.name}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="ml-2 p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-xl shadow-indigo-600/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
