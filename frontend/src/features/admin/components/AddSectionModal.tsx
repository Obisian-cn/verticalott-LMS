import { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function AddSectionModal({ onClose, onSave, isLoading }: any) {
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">Add New Section</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Section Title</label>
            <input 
              type="text"
              autoFocus
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Introduction & Setup"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && title && onSave({ title })}
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave({ title })}
            disabled={!title || isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 disabled:opacity-50 transition-colors shadow-md"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save className="w-4 h-4" />}
            Save Section
          </button>
        </div>
      </div>
    </div>
  );
}
