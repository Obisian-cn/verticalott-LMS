import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { Search, Star, Clock, Users, BookOpen, Filter } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiMethods.getCourses()
  });

  const courses = data?.data || [];

  const filteredCourses = courses.filter((course: any) =>
    course.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header and Search */}
      <div className="glass rounded-[2rem] p-8 sm:p-10 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-gradient-to-bl from-teal-400/20 to-emerald-400/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-cyan-400/20 to-blue-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 w-full max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Courses</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 font-medium">
            Discover thousands of courses from top instructors around the world.
          </p>

          <div className="mt-8 relative max-w-2xl mx-auto flex items-center shadow-lg shadow-slate-200/50 rounded-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-500 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="What do you want to learn today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {searchTerm ? 'Search Results' : 'Featured Courses'}
          </h2>
          <div className="text-sm font-medium text-slate-500">
            Showing {filteredCourses.length} courses
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass h-80 rounded-2xl bg-white/40" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course: any) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col cursor-pointer bg-white"
              >
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-bold text-white shadow-sm border border-white/20 flex items-center">
                    <Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400" />
                    4.8
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {course.category || 'Technology'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-teal-600 transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center text-xs text-slate-500 mb-3 space-x-3">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      12h 30m
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      1.2k students
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border-2 border-white shadow-sm">
                        {course.instructor?.name?.charAt(0) || 'I'}
                      </div>
                      <span className="ml-2 text-xs font-medium text-slate-600">
                        {course.instructor?.name || 'Instructor Name'}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      ${course.price || '49.99'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-16 text-center border-dashed border-2 border-slate-200 flex flex-col items-center justify-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-slate-50 items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No courses found</h3>
            <p className="mt-2 text-slate-500 max-w-sm mx-auto">
              We couldn't find any courses matching your search. Try different keywords or browse our categories.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 text-sm font-bold text-teal-600 hover:text-teal-700 underline underline-offset-4 decoration-2 decoration-teal-200 hover:decoration-teal-500 transition-all"
            >
              Clear search filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
