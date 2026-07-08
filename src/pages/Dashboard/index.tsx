import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, Flame, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { LoadingState } from '../../components/common/LoadingState';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/analyticsService';
import type { Analytics as AnalyticsData } from '../../services/types';

export function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.get().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading dashboard..." />;

  const stats = analytics?.stats ?? {};
  const progress = analytics?.progress?.length ? analytics.progress : [{ name: 'Today', score: 0 }];
  const recentActivity = analytics?.recent_activity ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] ?? 'Learner'}!
          </h1>
          <p className="text-slate-500 mt-1">
            You have {stats.due_cards ?? 0} cards due for review today.
          </p>
        </div>
        <Link to="/review" className="px-6 py-2.5 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg transition-all">
          Start Review
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Documents</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.documents ?? 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Mastery</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.mastery ?? 0}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-accent-purple">
            <Target size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Current Streak</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {stats.current_streak ?? 0} <span className="text-lg text-slate-400 font-normal">days</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Flame size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Study Time</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {stats.study_time_hours ?? 0}<span className="text-lg text-slate-400 font-normal">h</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-accent-pink">
            <Clock size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-soft border border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Learning Progress</h2>
            <span className="text-sm bg-slate-50 rounded-lg px-3 py-1.5 text-slate-600">This Week</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="score" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            <Link to="/analytics" className="text-sm text-accent-pink font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-5">
            {recentActivity.length === 0 && <p className="text-sm text-slate-500">No activity yet. Upload a PDF to begin.</p>}
            {recentActivity.map((activity) => (
              <div key={String(activity.id)} className="flex items-start gap-4 group">
                <div className="w-2 h-2 rounded-full bg-slate-200 mt-2 group-hover:bg-accent-pink transition-colors"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{activity.type}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs text-slate-400">{new Date(String(activity.time)).toLocaleDateString()}</span>
                  </div>
                </div>
                {activity.score !== null && (
                  <div className="text-sm font-semibold text-accent-purple bg-purple-50 px-2 py-1 rounded-md">{activity.score}%</div>
                )}
              </div>
            ))}
          </div>

          <Link to="/library" className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Browse Library <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
