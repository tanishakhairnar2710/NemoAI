import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, MoreVertical, Clock, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingState } from '../../components/common/LoadingState';
import { useDocuments } from '../../hooks/useDocuments';

const colors = [
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700'
];

export function Library() {
  const { documents, loading, loadDocuments, deleteDocument } = useDocuments();
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filtered = useMemo(() => {
    return documents.filter((document) => document.title.toLowerCase().includes(query.toLowerCase()));
  }, [documents, query]);

  if (loading && documents.length === 0) return <LoadingState label="Loading library..." />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Library</h1>
          <p className="text-slate-500 mt-1">Manage your uploaded documents and notes.</p>
        </div>
        <Link to="/upload" className="px-6 py-2.5 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg transition-all text-center">
          Upload New
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search documents..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink/30 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-10 text-center text-slate-500">
          Your library is empty. Upload a PDF or text file to generate study material.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 flex flex-col group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${colors[index % colors.length]}`}>
                  {doc.category || 'General'}
                </div>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete document"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-6 flex-1">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <FileText size={24} />
                </div>
                <Link to={`/documents/${doc.id}`} className="font-semibold text-slate-800 leading-snug group-hover:text-accent-pink transition-colors line-clamp-2">
                  {doc.title}
                </Link>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={14} />
                  <span>{doc.page_count || 1} pages</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
