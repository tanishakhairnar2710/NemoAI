import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Layers, ChevronLeft, HelpCircle, Sparkles, BrainCircuit } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LoadingState } from '../../components/common/LoadingState';
import { useDocuments } from '../../hooks/useDocuments';
import type { Document } from '../../services/types';

export function DocumentDetail() {
  const { id } = useParams();
  const { getDocument } = useDocuments();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDocument(Number(id)).then(setDocument).finally(() => setLoading(false));
  }, [id, getDocument]);

  if (loading) return <LoadingState label="Loading document..." />;
  if (!document) return <div className="text-slate-500">Document not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <Link to="/library" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
        <ChevronLeft size={16} /> Back to Library
      </Link>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <FileText size={32} />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mb-3">
                {document.category || 'General'}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-2">{document.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} /> {new Date(document.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={16} /> {document.page_count || 1} pages
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <Link to={`/flashcards?documentId=${document.id}`} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg transition-all">
              <Layers size={18} /> Study Flashcards
            </Link>
            <Link to={`/quiz?documentId=${document.id}`} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-pink-100 text-accent-pink font-medium hover:bg-pink-50 transition-all">
              <HelpCircle size={18} /> Start Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-100 pt-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-accent-pink" /> AI Summary
              </h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>{document.summary || 'Summary will appear after the AI pipeline processes readable text from this document.'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {(document.keywords.length ? document.keywords : ['General']).map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Generated Materials</h3>
              <div className="space-y-3">
                <Link to={`/flashcards?documentId=${document.id}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-accent-pink flex items-center justify-center">
                      <Layers size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Flashcards</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{document.flashcard_count} cards</span>
                </Link>
                <Link to={`/quiz?documentId=${document.id}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-accent-purple flex items-center justify-center">
                      <HelpCircle size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Quiz</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{document.quiz_count} Qs</span>
                </Link>
                <Link to={`/mnemonics?documentId=${document.id}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                      <BrainCircuit size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Mnemonics</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{document.mnemonic_count} items</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
