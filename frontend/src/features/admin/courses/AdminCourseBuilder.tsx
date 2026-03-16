import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiMethods } from '../../../lib/api';
import { ArrowLeft, PlusCircle, Layers, BookOpen } from 'lucide-react';
import SectionItem from '../components/SectionItem';
import AddSectionModal from '../components/AddSectionModal';
import AddLectureModal from '../components/AddLectureModal';

export default function AdminCourseBuilder() {
  const { courseId } = useParams<{ courseId: string }>();
  const queryClient = useQueryClient();

  // Modals state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [activeSectionIdForLecture, setActiveSectionIdForLecture] = useState<string | null>(null);

  const { data: courseData } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => apiMethods.getCourseById(courseId!),
    enabled: !!courseId
  });

  const { data: curriculumData, isLoading: curriculumLoading } = useQuery({
    queryKey: ['curriculum', courseId],
    queryFn: () => apiMethods.getCurriculum(courseId!),
    enabled: !!courseId
  });

  const createSectionMutation = useMutation({
    mutationFn: (data: any) => apiMethods.createSection(courseId!, data),
    onSuccess: () => {
      setIsSectionModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['curriculum', courseId] });
    }
  });

  const createLectureMutation = useMutation({
    mutationFn: ({ sectionId, formData }: any) => apiMethods.createMultipartLesson(sectionId, formData),
    onSuccess: () => {
      setActiveSectionIdForLecture(null);
      queryClient.invalidateQueries({ queryKey: ['curriculum', courseId] });
    }
  });

  const handleCreateSection = (data: { title: string }) => {
    const sections = curriculumData?.data?.sections || [];
    createSectionMutation.mutate({ ...data, order: sections.length + 1 });
  };

  const handleCreateLecture = ({ sectionId, title, description, file }: any) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    createLectureMutation.mutate({ sectionId, formData });
  };

  const sections = curriculumData?.data?.sections || [];
  const course = courseData?.data || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/courses"
            className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Course Curriculum Builder</h1>
            <p className="text-slate-500 font-medium">Build out the modules and videos for{" "}
              <span className="font-bold text-slate-800">{course.title || 'this course'}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.open(`/courses/${courseId}`, '_blank')}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors shadow-sm text-sm"
        >
          <BookOpen className="w-4 h-4" /> Preview Course
        </button>
      </div>

      <div className="space-y-6">
        {curriculumLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[1.5rem]"></div>)}
          </div>
        ) : sections.length > 0 ? (
          sections.map((section: any, index: number) => (
            <SectionItem 
              key={section.id} 
              section={section} 
              index={index} 
              onAddLecture={setActiveSectionIdForLecture}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem]">
            <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Empty Curriculum</h3>
            <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">This course doesn't have any sections yet. Start by creating your first module.</p>
          </div>
        )}

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
          onSave={handleCreateSection}
          isLoading={createSectionMutation.isPending}
        />
      )}

      {activeSectionIdForLecture && (
        <AddLectureModal
          sectionId={activeSectionIdForLecture}
          onClose={() => setActiveSectionIdForLecture(null)}
          onSave={handleCreateLecture}
          isLoading={createLectureMutation.isPending}
        />
      )}
    </div>
  );
}
