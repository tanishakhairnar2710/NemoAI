import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LoadingState } from '../../components/common/LoadingState';
import { analyticsService } from '../../services/analyticsService';
import type { Analytics as AnalyticsData } from '../../services/types';

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.get().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading analytics..." />;

  const stats = analytics?.stats ?? {};
  const progress = analytics?.progress?.length ? analytics.progress : [{ name: 'Today', score: 0 }];
  const subjects = analytics?.subjects?.length ? analytics.subjects : [{ name: 'General', score: 0 }];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Analytics</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of your learning performance.</p>
        </div>
        <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 shadow-sm">Last 7 Days</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Study Time</p>
          <h3 className="text-3xl font-bold text-slate-800">{stats.study_time_hours ?? 0}<span className="text-lg text-slate-400 font-normal">h</span></h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50">
          <p className="text-sm font-medium text-slate-500 mb-1">Cards Reviewed</p>
          <h3 className="text-3xl font-bold text-slate-800">{stats.cards_reviewed ?? 0}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50">
          <p className="text-sm font-medium text-slate-500 mb-1">Average Quiz Score</p>
          <h3 className="text-3xl font-bold text-slate-800">{stats.average_quiz_score ?? 0}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Overall Progress</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#A855F7" strokeWidth={3} dot={{ r: 4, fill: '#A855F7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Performance by Topic</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
