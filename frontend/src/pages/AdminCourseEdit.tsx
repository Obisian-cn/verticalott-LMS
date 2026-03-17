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
    mutationFn: ({ sectionId, formData }: any) => apiMethods.createMultipartLesson(sectionId, formData),
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

  const handleCreateLecture = ({ sectionId, title, description, file }: any) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    createLessonMutation.mutate({ sectionId, formData });
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


            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <button
          onClick={() => setIsSectionModalOpen(true)}
          className="w-full flex items-center justify-center p-6 bg-white border-2 border-dashed border-slate-300 rounded-[1.5rem] text-slate-500 font-bold hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 transition-colors group"
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
