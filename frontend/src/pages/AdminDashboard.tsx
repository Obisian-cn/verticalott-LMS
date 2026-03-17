import { useQuery } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Users, DollarSign, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiMethods.getCourses()
  });

  const courses = data?.data || [];
  // Filter courses by the instructor's ID
  const myCourses = user?.role === 'admin' ? courses : courses?.filter((c: any) => c.instructorId === user?.id);

  if (user?.role !== 'admin' && user?.role !== 'instructor') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 mt-2">You do not have permission to view the instructor dashboard.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="glass rounded-[2rem] p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between text-left">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-teal-400/20 to-emerald-400/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 w-full max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Instructor <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Dashboard</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 font-medium">
            Manage your courses, view enrollments, and track your revenue.
          </p>
        </div>

        <div className="relative z-10 mt-6 md:mt-0 flex shrink-0">
          <Link
            to="/admin/courses/create"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-lg">Create New Course</span>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-6 bg-white flex items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Courses</p>
            <p className="text-4xl font-black text-slate-900">{myCourses.length}</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 bg-white flex items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-4xl font-black text-slate-900">0</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 bg-white flex items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-4xl font-black text-slate-900">$0.00</p>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Manage Your Courses</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="glass h-24 rounded-2xl bg-white/40 animate-pulse" />)}
          </div>
        ) : myCourses.length > 0 ? (
          <div className="space-y-4">
            {myCourses.map((course: any) => (
              <div key={course.id} className="glass rounded-2xl p-6 bg-white border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:border-teal-200 transition-all group">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-32 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {course.category || 'Tech'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-teal-600 transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center text-teal-600 bg-teal-50 px-2 py-0.5 rounded relative text-xs font-bold uppercase tracking-wider">${course.price || 'Free'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-slate-100">
                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200"
                  >
                    <Edit3 className="w-4 h-4" /> Manage
                  </Link>
                  <button
                    className="flex items-center justify-center p-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                    title="Delete Course"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-16 text-center border-dashed border-2 border-slate-200 bg-white/50 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-sm">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You haven't created any courses yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Start sharing your knowledge with the world by building your first interactive course.</p>
            <Link
              to="/admin/courses/create"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <PlusCircle className="w-5 h-5" /> Let's Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
