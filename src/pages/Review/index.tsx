import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { reviewService } from '../../services/reviewService';
import type { Analytics, Flashcard } from '../../services/types';

export function Review() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    reviewService.due().then(setCards);
    analyticsService.get().then(setAnalytics);
  }, []);

  const grouped = cards.reduce<Record<string, Flashcard[]>>((acc, card) => {
    acc[card.topic] = acc[card.topic] ?? [];
    acc[card.topic].push(card);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Daily Review</h1>
        <p className="text-slate-500 mt-1">Stay on top of your spaced repetition schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
            <div className="h-full gradient-bg" style={{ width: `${Math.min(100, cards.length * 8)}%` }}></div>
          </div>
          <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center text-accent-pink mb-6">
            <Clock size={40} />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">{cards.length} Cards</h2>
          <p className="text-slate-500 mb-8">due for review today</p>
          <Link to="/flashcards" className="px-8 py-4 rounded-full gradient-bg text-white font-medium text-lg shadow-glow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            Start Session <ArrowRight size={20} />
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Current Streak</h3>
              <Flame className="text-orange-500" size={24} />
            </div>
            <div className="text-5xl font-bold text-slate-800 mb-2">
              {analytics?.stats.current_streak ?? 0} <span className="text-xl text-slate-400 font-normal">days</span>
            </div>
            <p className="text-sm text-slate-500">Review today to keep your streak alive.</p>
          </div>

          <div className="flex justify-between items-end mt-8">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={`${day}-${i}`} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < (analytics?.stats.current_streak ?? 0) ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                  {i < (analytics?.stats.current_streak ?? 0) ? <CheckCircle size={16} /> : day}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Upcoming Reviews</h3>
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 && <p className="text-sm text-slate-500">No cards are due right now.</p>}
          {Object.entries(grouped).map(([topic, topicCards]) => (
            <div key={topic} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold bg-pink-100 text-accent-pink">{topicCards.length}</div>
                <div>
                  <h4 className="font-semibold text-slate-800">{topic}</h4>
                  <p className="text-sm text-slate-500">Due today</p>
                </div>
              </div>
              <Link to={`/flashcards?documentId=${topicCards[0].document_id}`} className="text-sm font-medium text-accent-pink hover:underline">
                Review
              </Link>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
