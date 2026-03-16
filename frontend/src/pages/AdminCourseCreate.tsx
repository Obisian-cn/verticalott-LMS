import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { Save, ArrowLeft, BookOpen, Layers, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminCourseCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Technology'
  });

  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: any) => apiMethods.createCourse(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      // Go to builder page to add curriculum
      if (data.data?.id) {
        navigate(`/admin/courses/${data.data.id}/builder`);
      } else {
        navigate('/admin/courses');
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'Failed to create course');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    createMutation.mutate({
      ...formData,
      price: Number(formData.price),
      instructorId: user?.id
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin"
          className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create a New Course</h1>
          <p className="text-slate-500 font-medium">Define the core identity of your new educational offering.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-8 sm:p-10 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold text-sm flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Course Title *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium"
              placeholder="e.g. Advanced JavaScript Patterns"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description *</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium resize-none"
              placeholder="What will students learn in this course?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Classification & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-800">Classification</h2>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Course Category</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium appearance-none"
              // value={formData.category}
              // onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Personal Development">Personal Development</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-800">Pricing</h2>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Course Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-black text-lg"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
              <p className="mt-2 text-xs font-semibold text-slate-500 flex justify-between">
                <span>Set to 0 for free courses</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-end gap-4">
          <Link
            to="/admin"
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {createMutation.isPending ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</span>
            ) : (
              <><Save className="w-5 h-5" /> Save and Continue to Curriculum</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
