import { PlayCircle } from 'lucide-react';

export default function LectureItem({ lesson, index }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
        <PlayCircle className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 truncate">
          Lecture {index + 1}: {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Video</p>
          {lesson.videoUrl && (
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Stream Ready</span>
          )}
        </div>
      </div>
    </div>
  );
}
