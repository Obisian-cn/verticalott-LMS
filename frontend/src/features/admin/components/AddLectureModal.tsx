import { useState } from 'react';
import { X, Save } from 'lucide-react';
import VideoUploader from './VideoUploader';

export default function AddLectureModal({ sectionId, onClose, onSave, isLoading }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const handleSave = () => {
    if (!file) {
      setFileError('Video file is required');
      return;
    }
    setFileError('');
    onSave({ sectionId, title, description, file });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#151518] rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#0a0a0b] shrink-0">
          <h2 className="font-bold text-lg text-slate-200">Add New Lecture (Video)</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Lecture Title *</label>
            <input 
              type="text"
              autoFocus
              className="w-full px-4 py-3 bg-[#151518] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Installing Node.js"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-3 bg-[#151518] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] resize-none"
              placeholder="What will be covered in this video?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Upload Video *</label>
            <VideoUploader file={file} setFile={(f: File) => { setFileError(''); setFile(f); }} error={fileError} />
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-[#0a0a0b] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || !file || isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 disabled:opacity-50 transition-colors shadow-md"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save className="w-4 h-4" />}
            {isLoading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </div>
    </div>
  );
}
