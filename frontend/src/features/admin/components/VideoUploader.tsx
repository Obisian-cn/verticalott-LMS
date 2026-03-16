import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function VideoUploader({ file, setFile, error }: any) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (inFile: File) => {
    // We allow any video for broad usability, but typical is mp4
    if (inFile.type.startsWith('video/')) {
      setFile(inFile);
    }
  };

  return (
    <div className="space-y-2">
      <div 
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} ${error ? 'border-red-400 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="video/*" onChange={handleChange} className="hidden" />
        
        {file ? (
          <div className="flex flex-col items-center text-teal-600">
            <CheckCircle className="w-10 h-10 mb-2" />
            <p className="font-bold text-sm text-center truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-slate-500 mt-1">{(file.size / (1024*1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <UploadCloud className="w-10 h-10 mb-2 text-slate-400" />
            <p className="font-bold text-sm">Click or drag a video file here</p>
            <p className="text-xs mt-1">Supports MP4, MOV, MKV</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}
