import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { PlayCircle, CheckCircle2, Circle, FileText, HelpCircle, ChevronLeft, Award } from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ['courseContent', courseId],
    queryFn: () => apiMethods.getCourseContent(courseId!)
  });

  const { data: progressData } = useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: () => apiMethods.getProgress(courseId!)
  });

  const updateProgress = useMutation({
    mutationFn: (data: { lessonId: string, completed: boolean }) => apiMethods.updateProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] });
    }
  });

  const sections = contentData?.data || [];
  const completedLessons = Array.isArray(progressData?.data) 
    ? progressData.data.reduce((acc: Record<string, boolean>, p: any) => { acc[p.lessonId] = p.completed; return acc; }, {}) 
    : {};

  const totalLessons = useMemo(() => {
    return sections.reduce((acc: number, section: any) => acc + (section.lessons?.length || 0), 0);
  }, [sections]);

  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  // Set initial lesson
  if (!activeLesson && sections.length > 0) {
    const firstSection = sections.sort((a: any, b: any) => a.order - b.order)[0];
    if (firstSection?.lessons?.length > 0) {
      setActiveLesson(firstSection.lessons.sort((a: any, b: any) => a.order - b.order)[0]);
    }
  }

  const handleToggleComplete = (lessonId: string) => {
    updateProgress.mutate({ lessonId, completed: !completedLessons[lessonId] });
  };

  if (contentLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-8 overflow-hidden bg-slate-950 text-slate-200">
      {/* Top Navbar */}
      <header className="h-16 shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-6 border-l border-slate-700 hidden sm:block"></div>
          <h1 className="font-bold text-lg text-white truncate max-w-[200px] sm:max-w-md">Course Player</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-300">{progressPercent}%</span>
            <div className="w-32 sm:w-48 h-2.5 rounded-full bg-slate-800 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          {progressPercent === 100 && (
            <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <Award className="w-4 h-4 fill-emerald-400" />
              Completed
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Video / Content display (Left) */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          <div className="w-full bg-black aspect-video flex-shrink-0 relative flex justify-center items-center border-b border-slate-800 shadow-2xl">
            {activeLesson?.videoId ? (
              // Replace this with actual Mux component if available
              <div className="text-slate-500 flex flex-col items-center">
                <PlayCircle className="w-20 h-20 text-teal-500/50 mb-4" />
                <p>Mux Video Player for Asset ID: {activeLesson.videoId}</p>
              </div>
            ) : (
              <div className="text-slate-500 flex flex-col items-center p-12 text-center">
                {activeLesson?.type === 'article' ? <FileText className="w-16 h-16 text-slate-600 mb-4" /> : <PlayCircle className="w-16 h-16 text-slate-600 mb-4" />}
                <p className="text-xl font-bold text-slate-300">{activeLesson?.title || "Select a lesson"}</p>
                <p className="text-sm mt-2 text-slate-400 max-w-md">{activeLesson?.content || "No video content provided for this lesson."}</p>
              </div>
            )}
          </div>
          
          <div className="p-8 max-w-4xl mx-auto w-full flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{activeLesson?.title || 'Lesson Title'}</h2>
                <span className="inline-flex px-3 py-1 rounded bg-slate-800 text-xs font-bold text-slate-300 uppercase letter-spacing-wide">
                  {activeLesson?.type || 'Video'}
                </span>
              </div>
              <button 
                onClick={() => activeLesson && handleToggleComplete(activeLesson.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                  completedLessons[activeLesson?.id] 
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 ring-1 ring-emerald-500/50' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 ring-1 ring-slate-700'
                }`}
              >
                {completedLessons[activeLesson?.id] ? (
                  <><CheckCircle2 className="w-5 h-5 fill-emerald-400 text-slate-900" /> Completed</>
                ) : (
                  <><Circle className="w-5 h-5" /> Mark Complete</>
                )}
              </button>
            </div>
            
            <div className="mt-8 prose prose-invert max-w-none prose-teal">
              {activeLesson?.content && (
                <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
              )}
            </div>
          </div>
        </div>

        {/* Course Content Sidebar (Right) */}
        <div className="w-full lg:w-[400px] shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-10 hidden md:flex">
          <div className="p-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 backdrop-blur-md z-10 shrink-0 shadow-sm">
            <h3 className="font-bold text-lg text-white">Course Content</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sections.sort((a: any, b: any) => a.order - b.order).map((section: any, idx: number) => (
              <div key={section.id} className="border-b border-slate-800/50">
                <div className="p-4 bg-slate-800/30 sticky top-0 z-10 border-b border-slate-800/10 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-300">
                    Section {idx + 1}: {section.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{section.lessons?.length || 0} / {section.lessons?.length || 0} | 10min</p>
                </div>
                <div className="flex flex-col">
                  {section.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, lIdx: number) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const isCompleted = completedLessons[lesson.id];
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`text-left p-4 flex items-start gap-3 hover:bg-slate-800 transition-colors group relative ${
                          isActive ? 'bg-slate-800 text-teal-400' : 'text-slate-400'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]" />}
                        <div className="mt-0.5 shrink-0" onClick={(e) => { e.stopPropagation(); handleToggleComplete(lesson.id); }}>
                          {isCompleted ? (
                            <CheckCircle2 className={`w-5 h-5 ${isActive ? 'text-teal-500' : 'text-emerald-500'} hover:scale-110 transition-transform`} />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400 hover:scale-110 transition-transform" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`text-sm font-medium line-clamp-2 leading-snug group-hover:text-slate-200 transition-colors ${isActive ? 'text-teal-100 font-bold' : ''}`}>
                            {lIdx + 1}. {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {lesson.type === 'video' ? <PlayCircle className="w-3.5 h-3.5" /> : lesson.type === 'quiz' ? <HelpCircle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">10:00</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
