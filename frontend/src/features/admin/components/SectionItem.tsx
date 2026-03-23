import { PlusCircle, Trash2 } from 'lucide-react';
import LectureItem from './LectureItem';

export default function SectionItem({ section, index, onAddLecture }: any) {
  return (
    <div className="glass rounded-[1.5rem] bg-[#151518] border border-white/10 overflow-hidden shadow-sm group">
      {/* Section Header */}
      <div className="bg-[#0a0a0b] border-b border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-200 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#151518] border border-white/10 shadow-sm text-slate-300 text-sm font-black">
            {index + 1}
          </span>
          {section.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onAddLecture(section.id)}
            className="flex items-center gap-2 px-4 py-2 bg-[#151518] border border-white/10 text-slate-400 hover:text-teal-600 hover:border-teal-200 rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Lecture
          </button>
          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lectures List */}
      <div className="p-4 space-y-3">
        {section.lessons && section.lessons.length > 0 ? (
          section.lessons.map((lesson: any, lIdx: number) => (
            <LectureItem key={lesson.id} lesson={lesson} index={lIdx} />
          ))
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-[#0a0a0b]/50">
            <p className="text-slate-400 font-medium text-sm">No lectures created yet. Click "Add Lecture" to upload a video.</p>
          </div>
        )}
      </div>
    </div>
  );
}
