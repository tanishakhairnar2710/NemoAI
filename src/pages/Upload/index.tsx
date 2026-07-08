import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import { errorMessage } from '../../services/api';

export function Upload() {
  const { uploadDocument } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedId, setUploadedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const document = await uploadDocument(file);
      setUploadedId(document.id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Upload Notes</h1>
        <p className="text-slate-500 mt-1">Upload PDFs or text files to generate study materials.</p>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div>}

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all duration-200 bg-white ${
            isDragging ? 'border-accent-pink bg-pink-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${isDragging ? 'bg-pink-100 text-accent-pink' : 'bg-slate-100 text-slate-400'}`}>
            <UploadCloud size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Drag & drop your files here</h3>
          <p className="text-slate-500 mb-8">or click to browse from your computer</p>
          <label className="px-8 py-3 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg transition-all cursor-pointer">
            Browse Files
            <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf,.txt" />
          </label>
          <p className="text-xs text-slate-400 mt-6">Supported formats: PDF, TXT (Max 50MB)</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
          {uploadedId ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Complete!</h3>
              <p className="text-slate-500 mb-8">Your document has been processed successfully.</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                  onClick={() => {
                    setFile(null);
                    setUploadedId(null);
                  }}
                >
                  Upload Another
                </button>
                <Link to={`/documents/${uploadedId}`} className="px-6 py-2.5 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg transition-all">
                  View Document
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-800">Selected File</h3>
                <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors" disabled={isUploading}>
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-accent-pink">
                  <File size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {isUploading ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-slate-600">Uploading and processing...</span>
                    <span className="text-accent-pink">AI pipeline running</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div className="h-full gradient-bg rounded-full" initial={{ width: '0%' }} animate={{ width: '85%' }} transition={{ duration: 1.2 }} />
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button onClick={handleUpload} className="px-8 py-3 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg transition-all flex items-center gap-2">
                    <UploadCloud size={18} /> Start Upload
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
