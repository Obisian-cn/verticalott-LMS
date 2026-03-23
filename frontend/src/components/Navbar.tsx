
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
            ? "bg-gradient-to-r from-[#b57bff]/10 to-[#e79a6d]/10 text-[#b57bff] shadow-sm" 
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className="w-4 h-4" />
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 supports-backdrop-blur:bg-[#151518]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-r from-[#b57bff] to-[#e79a6d] rounded-xl group-hover:opacity-90 transition-colors shadow-lg shadow-[#b57bff]/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#b57bff] to-[#e79a6d]">
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
                
                <div className="h-6 w-px bg-white/10 mx-2" />
                
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10/60 bg-[#151518]/50 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b57bff] to-[#e79a6d] flex items-center justify-center text-white text-sm font-bold shadow-inner">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-300 pr-1">{user?.name}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="ml-2 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors border border-white/10 rounded-xl hover:bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-black bg-gradient-to-r from-[#b57bff] to-[#e79a6d] hover:opacity-90 rounded-xl shadow-md hover:shadow-xl shadow-[#b57bff]/20 transition-all duration-300 flex items-center gap-1"
                >
                  Start Free <span className="text-black">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
