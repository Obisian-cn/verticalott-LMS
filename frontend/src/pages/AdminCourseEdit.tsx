import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { ArrowLeft, PlusCircle, Video, FileText, HelpCircle, Link as LinkIcon } from 'lucide-react';
import AddLectureModal from '../features/admin/components/AddLectureModal';
import AddSectionModal from '../features/admin/components/AddSectionModal';

export default function AdminCourseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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

  console.log("contentData---->", contentData);

  const createSectionMutation = useMutation({
    mutationFn: (data: any) => apiMethods.createSection(id!, data),
    onSuccess: () => {
      setIsSectionModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['courseContent', id] });
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: ({ sectionId, payload }: any) => apiMethods.createLesson(sectionId, payload),
    onSuccess: () => {
      setActiveSectionId(null);
      queryClient.invalidateQueries({ queryKey: ['courseContent', id] });
    }
  });

  const course = courseData?.data || {};
  const sections = contentData?.data || [];

  const handleAddSection = (data: { title: string }) => {
    createSectionMutation.mutate({
      ...data,
      courseId: id,
      order: sections.length + 1
    });
  };

  const handleCreateLecture = ({ sectionId, title, description, videoId, resourcePdfUrl, endGoal }: any) => {
    createLessonMutation.mutate({ 
      sectionId, 
      payload: { title, description, videoId, resourcePdfUrl, endGoal } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 bg-[#151518] rounded-full shadow-sm border border-white/10 text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Access Course Content</h1>
            <p className="text-slate-400 font-medium">Build out the curriculum for{" "}
              <span className="font-bold text-slate-200">{course.title || 'this course'}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="px-6 py-2 bg-indigo-50 border border-indigo-100 text-[#b57bff] rounded-xl font-bold hover:bg-indigo-100 transition-colors shadow-sm text-sm"
        >
          Preview Course
        </button>
      </div>

      <div className="space-y-6">
        {/* Sections List */}
        {sections.sort((a: any, b: any) => a.order - b.order).map((section: any, sIdx: number) => (
          <div key={section.id} className="glass rounded-[1.5rem] bg-[#151518] border border-white/10 overflow-hidden shadow-sm group hover:border-teal-200 transition-colors">
            {/* Section Header */}
            <div className="bg-[#0a0a0b] border-b border-slate-100 p-5 flex items-center justify-between group-hover:bg-teal-50/20 transition-colors">
              <h3 className="text-xl font-bold text-slate-200 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#151518] border border-white/10 shadow-sm text-slate-300 text-sm font-black">
                  {sIdx + 1}
                </span>
                {section.title}
              </h3>
              <button
                onClick={() => setActiveSectionId(section.id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#151518] border border-white/10 text-slate-400 hover:text-teal-600 hover:border-teal-200 rounded-xl font-bold text-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Add Lesson
              </button>
            </div>

            {/* Lesson List */}
            <div className="p-4 space-y-3">
              {section.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, lIdx: number) => (
                <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#151518] border border-slate-100 hover:border-white/10 flex-wrap sm:flex-nowrap shadow-sm hover:shadow-md transition-shadow">
                  <div className="shrink-0 w-10 h-10 bg-[#0a0a0b] rounded-lg flex items-center justify-center border border-slate-100">
                    {lesson.type === 'video' ? <Video className="w-5 h-5 text-teal-500" /> : lesson.type === 'quiz' ? <HelpCircle className="w-5 h-5 text-[#b57bff]" /> : <FileText className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-200 truncate">
                      {sIdx + 1}.{lIdx + 1} - {lesson.title}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{lesson.type}</p>
                  </div>
                  <div className="shrink-0">
                    {lesson.type === 'video' && (
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0b] border border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-400 rounded-lg text-xs font-bold transition-colors">
                        <LinkIcon className="w-3.5 h-3.5" /> Link Video
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {(!section.lessons || section.lessons.length === 0) && (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-[#0a0a0b]/50">
                  <p className="text-slate-400 font-medium text-sm">No lessons created yet in this section.</p>
                </div>
              )}


            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <button
          onClick={() => setIsSectionModalOpen(true)}
          className="w-full flex items-center justify-center p-6 bg-[#151518] border-2 border-dashed border-white/20 rounded-[1.5rem] text-slate-400 font-bold hover:bg-[#0a0a0b] hover:text-teal-600 hover:border-teal-300 transition-colors group"
        >
          <PlusCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
          Add New Section
        </button>
      </div>

      {isSectionModalOpen && (
        <AddSectionModal
          onClose={() => setIsSectionModalOpen(false)}
          onSave={handleAddSection}
          isLoading={createSectionMutation.isPending}
        />
      )}

      {activeSectionId && (
        <AddLectureModal
          sectionId={activeSectionId}
          onClose={() => setActiveSectionId(null)}
          onSave={handleCreateLecture}
          isLoading={createLessonMutation.isPending}
        />
      )}
    </div>
  );
}
