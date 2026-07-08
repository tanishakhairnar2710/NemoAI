import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { analyticsService } from '../../services/analyticsService';
import type { Analytics } from '../../services/types';

export function Insights() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.get().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading insights..." />;

  const weakTopics = analytics?.weak_topics ?? [];
  const strongTopics = analytics?.strong_topics ?? [];
  const focusTopic = weakTopics[0]?.topic ?? 'your newest document';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Learning Insights</h1>
        <p className="text-slate-500 mt-1">AI-driven analysis of your learning patterns and weak areas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> Areas for Improvement
            </h2>
            <div className="space-y-4">
              {weakTopics.length === 0 && <p className="text-sm text-slate-500">Weak areas will appear after quiz attempts are recorded.</p>}
              {weakTopics.map((item) => (
                <div key={String(item.topic)} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.topic}</h3>
                    <p className="text-sm text-slate-500">{item.attempts} attempts</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${item.accuracy}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-10">{item.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> Strongest Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {strongTopics.length === 0 && <p className="text-sm text-slate-500">Strong topics will appear as you answer more questions correctly.</p>}
              {strongTopics.map((item) => (
                <div key={String(item.topic)} className="p-4 rounded-xl border border-green-100 bg-green-50/30 flex items-center justify-between">
                  <span className="font-medium text-slate-800">{item.topic}</span>
                  <span className="text-sm font-bold text-green-600">{item.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-soft p-8 text-white relative overflow-hidden">
            <Lightbulb size={32} className="mb-4 text-pink-200" />
            <h3 className="text-xl font-bold mb-2">AI Suggestion</h3>
            <p className="text-pink-50 text-sm leading-relaxed mb-6">
              Focus your next review on {String(focusTopic)}. Adaptive learning will surface weaker topics more often.
            </p>
            <a href="/review" className="block w-full py-2.5 bg-white text-accent-purple font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              Start Focused Review
            </a>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Learning Trend
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your current mastery score is <span className="font-bold text-green-500">{analytics?.stats.mastery ?? 0}%</span>. Keep reviewing due cards to improve retention.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
