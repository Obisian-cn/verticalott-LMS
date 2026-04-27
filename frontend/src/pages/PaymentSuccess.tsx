import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiMethods } from '../lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [countdown, setCountdown] = useState(5);

  const orderId = searchParams.get('order_id');
  const courseId = localStorage.getItem('pending_enrollment_course_id');

  const enrollMutation = useMutation({
    mutationFn: () => apiMethods.enroll(courseId!),
    onSuccess: () => {
      setStatus('success');
      localStorage.removeItem('pending_enrollment_course_id');
    },
    onError: (error: any) => {
      if (error?.response?.data?.message === 'Already enrolled in this course') {
        setStatus('success');
        localStorage.removeItem('pending_enrollment_course_id');
      } else {
        setStatus('failed');
      }
    }
  });

  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    if (orderId && courseId) {
      enrollMutation.mutate();
    } else {
      setStatus('failed');
    }
  }, [orderId, courseId]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-3xl p-10 max-w-md w-full relative overflow-hidden bg-slate-900 border border-slate-700/50 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />

        {status === 'processing' && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
            <h2 className="text-2xl font-bold text-white">Verifying Payment</h2>
            <p className="text-slate-400">Please wait while we confirm your payment and set up your enrollment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Payment Successful!</h2>
            <p className="text-slate-300">You have been successfully enrolled in the course. You can now start learning.</p>
            <p className="text-sm text-slate-400 mt-2">Redirecting to dashboard in {countdown} seconds...</p>
            <Link
              to="/dashboard"
              className="mt-4 w-full inline-block py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.2)]">
              <XCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Enrollment Failed</h2>
            <p className="text-slate-300">We couldn't verify your payment or missing session details. Please try again or contact support.</p>
            <Link
              to="/dashboard"
              className="mt-4 w-full inline-block py-3 px-6 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all border border-slate-700"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
