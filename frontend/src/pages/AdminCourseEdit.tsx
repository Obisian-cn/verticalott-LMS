import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { Save, ArrowLeft, PlusCircle, Video, FileText, HelpCircle, Layers, Link as LinkIcon } from 'lucide-react';

export default function AdminCourseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  const [newLessonData, setNewLessonData] = useState({
    title: '',
    type: 'video',
    content: ''
  });

  const { data: courseData } = useQuery({
    queryKey: ['course', id],
    queryFn: () => apiMethods.getCourseById(id!),
    enabled: !!id
  });

  const { data: contentData } = useQuery({
    queryKey: ['courseContent', id],
    queryFn: () => apiMethods.getCourseContent(id!),
    enabled: !!id
  });

  const createSectionMutation = useMutation({
    mutationFn: (data: any) => apiMethods.createSection(id!, data),
    onSuccess: () => {
      setNewSectionTitle('');
      queryClient.invalidateQueries({ queryKey: ['courseContent', id] });
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: (data: any) => apiMethods.createLesson(activeSectionId!, data),
    onSuccess: () => {
      setNewLessonData({ title: '', type: 'video', content: '' });
      setActiveSectionId(null);
      queryClient.invalidateQueries({ queryKey: ['courseContent', id] });
    }
  });

  const course = courseData?.data || {};
  const sections = contentData?.data || [];

  const handleAddSection = () => {
    if (!newSectionTitle) return;
    createSectionMutation.mutate({
      title: newSectionTitle,
      order: sections.length + 1
    });
  };

  const handleAddLesson = () => {
    if (!newLessonData.title || !activeSectionId) return;
    const targetSection = sections.find((s: any) => s.id === activeSectionId);
    
    createLessonMutation.mutate({
      ...newLessonData,
      order: (targetSection?.lessons?.length || 0) + 1
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin"
            className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Course Content</h1>
            <p className="text-slate-500 font-medium">Build out the curriculum for{" "}
              <span className="font-bold text-slate-800">{course.title || 'this course'}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/courses/${id}`)}
          className="px-6 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors shadow-sm text-sm"
        >
          Preview Course
        </button>
      </div>

      <div className="space-y-6">
        {/* Sections List */}
        {sections.sort((a: any, b: any) => a.order - b.order).map((section: any, sIdx: number) => (
          <div key={section.id} className="glass rounded-[1.5rem] bg-white border border-slate-200 overflow-hidden shadow-sm group hover:border-teal-200 transition-colors">
            {/* Section Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between group-hover:bg-teal-50/20 transition-colors">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-black">
                  {sIdx + 1}
                </span>
                {section.title}
              </h3>
              <button
                onClick={() => setActiveSectionId(section.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200 rounded-xl font-bold text-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Add Lesson
              </button>
            </div>

            {/* Lesson List */}
            <div className="p-4 space-y-3">
              {section.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, lIdx: number) => (
                <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 flex-wrap sm:flex-nowrap shadow-sm hover:shadow-md transition-shadow">
                  <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                    {lesson.type === 'video' ? <Video className="w-5 h-5 text-teal-500" /> : lesson.type === 'quiz' ? <HelpCircle className="w-5 h-5 text-indigo-500" /> : <FileText className="w-5 h-5 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {sIdx + 1}.{lIdx + 1} - {lesson.title}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{lesson.type}</p>
                  </div>
                  <div className="shrink-0">
                    {lesson.type === 'video' && (
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 rounded-lg text-xs font-bold transition-colors">
                        <LinkIcon className="w-3.5 h-3.5" /> Link Video
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {(!section.lessons || section.lessons.length === 0) && (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                  <p className="text-slate-500 font-medium text-sm">No lessons created yet in this section.</p>
                </div>
              )}

              {/* Add Lesson Form */}
              {activeSectionId === section.id && (
                <div className="mt-4 p-5 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/30 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-sm text-slate-700 mb-3 uppercase tracking-wider pl-1">New Lesson</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        value={newLessonData.title}
                        onChange={e => setNewLessonData({ ...newLessonData, title: e.target.value })}
                      />
                      <select
                        className="w-40 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        value={newLessonData.type}
                        onChange={e => setNewLessonData({ ...newLessonData, type: e.target.value })}
                      >
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                    {newLessonData.type !== 'video' && (
                      <textarea
                        placeholder="Content text..."
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] font-medium resize-none"
                        value={newLessonData.content}
                        onChange={e => setNewLessonData({ ...newLessonData, content: e.target.value })}
                      />
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        onClick={() => setActiveSectionId(null)}
                        className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddLesson}
                        disabled={!newLessonData.title || createLessonMutation.isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 disabled:opacity-50 transition-colors text-sm shadow-md"
                      >
                        <Save className="w-4 h-4" /> Save Lesson
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Section Header */}
        <div className="glass rounded-[1.5rem] p-6 bg-white border border-dashed border-slate-300">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-3 text-slate-500 shrink-0">
              <Layers className="w-6 h-6" />
              <span className="font-bold text-lg">Add Section</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Introduction & Setup"
              className="flex-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              value={newSectionTitle}
              onChange={e => setNewSectionTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSection()}
            />
            <button 
              onClick={handleAddSection}
              disabled={!newSectionTitle || createSectionMutation.isPending}
              className="w-full sm:w-auto px-6 py-3 bg-teal-50 text-teal-600 border border-teal-200 rounded-xl font-bold hover:bg-teal-100 disabled:opacity-50 transition-colors"
            >
              Add Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
