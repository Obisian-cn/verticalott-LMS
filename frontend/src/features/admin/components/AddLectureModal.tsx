import { useState, useMemo } from 'react';
import { X, Save, Video as VideoIcon, UploadCloud, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import VideoUploader from './VideoUploader';
import { apiMethods } from '../../../lib/api';

export default function AddLectureModal({ sectionId, onClose, onSave, isLoading }: any) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourcePdfFile, setResourcePdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState('');
  const [endGoal, setEndGoal] = useState('');
  
  const [tab, setTab] = useState<'select' | 'upload'>('select');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const { data: videosData, isLoading: isLoadingVideos } = useQuery({
    queryKey: ['instructorVideos'],
    queryFn: apiMethods.getVideos
  });

  const uploadVideoMutation = useMutation({
    mutationFn: ({ file, title, description }: any) => apiMethods.uploadVideo(file, title, description),
    onSuccess: (video, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['instructorVideos'] });
      // Call save with the newly created video ID
      onSave({ sectionId, title, description, videoId: video.data.id, resourcePdfUrl: variables.resourcePdfUrl, endGoal: variables.endGoal });
    }
  });

  const handleSave = async () => {
    let finalPdfUrl = '';
    
    if (resourcePdfFile) {
      try {
        const res = await apiMethods.uploadPdf(resourcePdfFile);
        finalPdfUrl = res.data.url;
      } catch (err) {
        setPdfError('Failed to upload PDF');
        return;
      }
    }
    setPdfError('');

    if (tab === 'upload') {
      if (!file) {
        setFileError('Video file is required');
        return;
      }
      setFileError('');
      // Triggers upload, which then triggers onSave
      uploadVideoMutation.mutate({ file, title, description, resourcePdfUrl: finalPdfUrl, endGoal });
    } else {
      if (!selectedVideoId) {
        setFileError('Please select a video');
        return;
      }
      onSave({ sectionId, title, description, videoId: selectedVideoId, resourcePdfUrl: finalPdfUrl, endGoal });
    }
  };

  const isSaving = isLoading || uploadVideoMutation.isPending;

  const filteredVideos = useMemo(() => {
    if (!videosData?.data) return [];
    return videosData.data.filter((v: any) => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [videosData, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#151518] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#0a0a0b] shrink-0">
          <h2 className="font-bold text-lg text-slate-200">Add New Lecture (Video)</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Tabs */}
          <div className="flex bg-[#0a0a0b] p-1 rounded-xl">
            <button
              onClick={() => setTab('select')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'select' ? 'bg-[#151518] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <VideoIcon className="w-4 h-4" /> Select Video
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'upload' ? 'bg-[#151518] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <UploadCloud className="w-4 h-4" /> Upload New
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Lesson Title *</label>
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
              className="w-full px-4 py-3 bg-[#151518] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[80px] resize-none"
              placeholder="What will be covered in this lesson?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Resource PDF</label>
            <input 
              type="file"
              accept=".pdf"
              className="w-full px-4 py-3 bg-[#151518] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-300"
              onChange={e => setResourcePdfFile(e.target.files?.[0] || null)}
            />
            {pdfError && <p className="text-red-400 text-xs mt-2">{pdfError}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">End Goal</label>
            <input 
              type="text"
              className="w-full px-4 py-3 bg-[#151518] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Understand asynchronous javascript"
              value={endGoal}
              onChange={e => setEndGoal(e.target.value)}
            />
          </div>

          {tab === 'select' ? (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Select Video *</label>
              {isLoadingVideos ? (
                <p className="text-sm text-slate-400">Loading your videos...</p>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search videos by title..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#151518] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-200"
                    />
                  </div>
                  
                  <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map((video: any) => (
                        <div 
                          key={video.id}
                          onClick={() => { setSelectedVideoId(video.id); setFileError(''); }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedVideoId === video.id ? 'border-teal-500 bg-teal-500/10 shadow-sm' : 'border-white/5 bg-[#151518] hover:border-white/20'}`}
                        >
                          <div className="flex items-center gap-3">
                            <VideoIcon className={`w-5 h-5 ${selectedVideoId === video.id ? 'text-teal-400' : 'text-slate-400'}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold truncate ${selectedVideoId === video.id ? 'text-teal-400' : 'text-slate-300'}`}>
                                {video.title}
                              </p>
                              {video.description && (
                                <p className="text-xs text-slate-500 truncate mt-0.5">{video.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center bg-[#151518] rounded-xl border border-dashed border-white/10">
                        <p className="text-slate-400 text-sm">No videos match your search.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
               {fileError && <p className="text-red-400 text-xs mt-2">{fileError}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Upload Video *</label>
              <VideoUploader file={file} setFile={(f: File) => { setFileError(''); setFile(f); }} error={fileError} />
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 bg-[#0a0a0b] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 disabled:opacity-50 transition-colors shadow-md"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}
