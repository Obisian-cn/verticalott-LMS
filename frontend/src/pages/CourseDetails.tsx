import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { BookOpen, Star, Clock, Users, CheckCircle2, PlayCircle } from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => apiMethods.getCourseById(id!),
    enabled: !!id
  });

  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ['courseContent', id],
    queryFn: () => apiMethods.getCourseContent(id!),
    enabled: !!id
  });

  const enrollMutation = useMutation({
    mutationFn: () => apiMethods.enroll(id!),
    onSuccess: () => {
      navigate('/dashboard');
    }
  });

  const paymentMutation = useMutation({
    mutationFn: (amount: number) => apiMethods.createPayment(id!, amount),
    onSuccess: async (data) => {
      localStorage.setItem('pending_enrollment_course_id', id!);
      const cashfree = await load({
        mode: "production" // using production to match backend keys
      });
      cashfree.checkout({
        paymentSessionId: data.data?.paymentSessionId || data.paymentSessionId,
        returnUrl: `${window.location.origin}/payment/success?order_id={order_id}`
      });
    },
    onError: (error) => {
      console.error("Payment error", error);
      alert("Failed to initialize payment. See console.");
    }
  });

  if (courseLoading || contentLoading) {
    return (
      <div className="flex justify-center items-center h-64 animate-pulse">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  const course = courseData?.data || {};
  const sections = contentData?.data || [];
  
  // Aggregate stats
  const totalLessons = sections.reduce((acc: number, section: any) => acc + (section.lessons?.length || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Hero Section */}
      <div className="glass rounded-[2rem] p-8 sm:p-10 relative overflow-hidden flex flex-col items-start bg-slate-900 text-white">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-teal-500/20 to-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 space-x-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-sm font-semibold border border-teal-500/30">
                {course.category || 'Technology'}
              </span>
              <span className="flex items-center text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400 mr-1" />
                4.8 Rating
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed opacity-90">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-slate-300">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-teal-400" />
                <span>1,234 enrolled</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-teal-400" />
                <span>~ 12 Hours</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-teal-400" />
                <span>{totalLessons} Lessons</span>
              </div>
            </div>
            
            <div className="flex items-center pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {course.instructor?.name?.charAt(0) || 'I'}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Created by</p>
                  <p className="font-semibold text-white">{course.instructor?.name || 'Instructor Name'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-[#151518]/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col">
                <p className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-2">Full Lifetime Access</p>
                <div className="text-4xl font-extrabold text-white mb-6">
                  ${course.price || '49.99'}
                </div>
                
                <button
                  onClick={() => paymentMutation.mutate(Number(course.price || 49.99))}
                  disabled={paymentMutation.isPending || enrollMutation.isPending}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
                >
                  {paymentMutation.isPending || enrollMutation.isPending ? 'Processing...' : 'Enroll Now'}
                </button>
                
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>Access to all curriculum</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-4xl space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-6">Course Content</h2>
          <div className="glass bg-[#151518] rounded-2xl overflow-hidden divide-y divide-slate-100 border border-slate-100 shadow-sm">
            {sections.length > 0 ? sections.sort((a: any, b: any) => a.order - b.order).map((section: any) => (
              <div key={section.id} className="p-6 transition-colors hover:bg-[#0a0a0b]/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 text-teal-700 text-sm font-black">
                      {section.order}
                    </span>
                    {section.title}
                  </h3>
                  <span className="text-sm font-medium text-slate-400 bg-white/5 px-3 py-1 rounded-full">{section.lessons?.length || 0} lessons</span>
                </div>
                
                <div className="space-y-3 pl-11">
                  {section.lessons && section.lessons.length > 0 ? (
                    section.lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0a0b] border border-slate-100 group hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                        <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-teal-500" />
                        <span className="flex-1 font-medium text-slate-300 group-hover:text-teal-700 transition-colors">{lesson.title}</span>
                        {lesson.type && (
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {lesson.type}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-sm">No lessons available yet.</p>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-400 bg-[#0a0a0b] border-dashed border-t border-white/10">
                <p>Course content is being prepared.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
