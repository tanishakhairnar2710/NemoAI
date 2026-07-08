import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingState } from '../../components/common/LoadingState';
import { useDocuments } from '../../hooks/useDocuments';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSelectedDocumentId } from '../../hooks/useSelectedDocumentId';

export function Flashcards() {
  const { documents, loadDocuments } = useDocuments();
  const selectedDocumentId = useSelectedDocumentId();
  const { cards, loading, loadFlashcards, reviewFlashcard } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const startedAt = React.useRef(Date.now());

  useEffect(() => {
    if (documents.length === 0) loadDocuments();
  }, [documents.length, loadDocuments]);

  useEffect(() => {
    if (selectedDocumentId) loadFlashcards(selectedDocumentId);
  }, [selectedDocumentId, loadFlashcards]);

  const current = cards[currentIndex];
  const document = documents.find((item) => item.id === selectedDocumentId);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  const handleReview = async (quality: number) => {
    if (!current) return;
    await reviewFlashcard(current.id, quality, (Date.now() - startedAt.current) / 1000);
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, cards.length - 2)));
    startedAt.current = Date.now();
  };

  if (loading) return <LoadingState label="Loading flashcards..." />;
  if (!selectedDocumentId) {
    return <div className="bg-white rounded-2xl p-8 text-center text-slate-500">Upload a document to generate flashcards.</div>;
  }
  if (!current) {
    return <div className="bg-white rounded-2xl p-8 text-center text-slate-500">No flashcards are available for this document yet.</div>;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-8">
      <div className="w-full flex items-center justify-between mb-8">
        <div>
          <Link to={selectedDocumentId ? `/documents/${selectedDocumentId}` : '/library'} className="text-sm text-slate-500 hover:text-slate-800">Back to document</Link>
          <h1 className="text-2xl font-bold text-slate-800">{document?.title ?? 'Flashcard Review'}</h1>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-500 shadow-sm">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      <div className="relative w-full max-w-2xl aspect-[4/3] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 w-full h-full rounded-3xl cursor-pointer glass-panel shadow-glow flex flex-col items-center justify-center p-12 text-center ${isFlipped ? 'bg-white/90' : 'bg-white/70'}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest text-slate-400">
              {isFlipped ? 'Back' : 'Front'}
            </span>
            <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed">
              {isFlipped ? current.back : current.front}
            </p>
            <div className="absolute bottom-6 text-sm text-slate-400 flex items-center gap-2">
              <RotateCcw size={16} /> Click to flip
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-8 mt-12">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          <ChevronLeft size={24} />
        </button>

        {isFlipped && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <button onClick={() => handleReview(2)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors border border-red-100">
              <X size={20} /> Hard
            </button>
            <button onClick={() => handleReview(5)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors border border-green-100">
              <Check size={20} /> Easy
            </button>
          </motion.div>
        )}

        <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
