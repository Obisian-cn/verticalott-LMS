
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { apiMethods } from '../lib/api';
import { BookOpen, Trophy, Clock, ArrowRight, PlayCircle, Compass } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch enrollments
  const { data, isLoading } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: () => apiMethods.getEnrollments(user?.id || ''),
    enabled: !!user?.id
  });

  const enrollments = data?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="glass rounded-[2rem] p-8 sm:p-10 relative overflow-hidden shadow-xl shadow-indigo-900/5 border-t border-l border-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="mt-3 text-lg text-slate-600 font-medium max-w-2xl">
            You're making great progress. Ready to continue your learning journey today?
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/courses" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-1 group">
              Explore New Courses <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Courses in Progress', value: enrollments.filter((e: any) => e.progress > 0 && e.progress < 100).length || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'from-amber-500/20 to-orange-500/5' },
          { label: 'Completed Courses', value: enrollments.filter((e: any) => e.progress === 100).length || 0, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/20 to-teal-500/5' },
          { label: 'Total Enrolled', value: enrollments.length || 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', gradient: 'from-indigo-500/20 to-blue-500/5' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Learning Path</h2>
          <Link to="/courses" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center group">
            View all <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-64 rounded-2xl bg-white/40" />
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => (
              <div key={enrollment.id} className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col">
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md text-xs font-bold text-white shadow-sm border border-white/10">
                    {enrollment.course?.category || 'General'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {enrollment.course?.title || 'Untitled Course'}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                    {enrollment.course?.description || 'Continue your learning journey with this course.'}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 shadow-inner overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => navigate('/learn/' + enrollment.course?.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm group/btn"
                    >
                      <PlayCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 group-hover/btn:text-indigo-600 transition-transform" />
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center border-dashed border-2 border-slate-200">
            <div className="inline-flex w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
              <Compass className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No courses yet</h3>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">You haven't enrolled in any courses yet. Explore our catalog to start learning.</p>
            <Link to="/courses" className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all hover:-translate-y-0.5">
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
