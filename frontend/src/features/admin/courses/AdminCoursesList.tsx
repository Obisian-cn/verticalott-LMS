import { useQuery } from '@tanstack/react-query';
import { apiMethods } from '../../../lib/api';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, BookOpen, Layout } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminCoursesList() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiMethods.getCourses()
  });

  const courses = data?.data?.courses || [];
  const myCourses = user?.role === 'admin' ? courses : courses.filter((c: any) => c.instructorId === user?.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      <div className="glass rounded-[2rem] p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between text-left">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-indigo-400/20 to-purple-400/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 w-full max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Courses <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b57bff] to-[#e79a6d]">Management</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 font-medium">Control panel for all your educational content.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex shrink-0">
          <Link 
            to="/admin/courses/create"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#b57bff] to-[#e79a6d] text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-lg">Create Course</span>
          </Link>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-8 bg-[#151518] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl"></div>)}
          </div>
        ) : myCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Course Title</th>
                  <th className="py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Instructor</th>
                  <th className="py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Category</th>
                  <th className="py-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myCourses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-[#0a0a0b]/50 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#b57bff] flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-200">{course.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400 font-medium text-sm">
                      {course.instructor?.name || 'Self'}
                    </td>
                    <td className="py-4 font-medium">
                      <span className="bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">{course.category || 'General'}</span>
                    </td>
                    <td className="py-4 pl-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/courses/${course.id}/edit`}
                          className="p-2 text-slate-400 hover:text-[#b57bff] hover:bg-white/5 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="w-5 h-5" />
                        </Link>
                        <Link 
                          to={`/admin/courses/${course.id}/builder`}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                        >
                          <Layout className="w-4 h-4" /> Curriculum
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-200">No courses available.</h3>
            <p className="text-slate-400 mt-2">Create your first course to populate the list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
