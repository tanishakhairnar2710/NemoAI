import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Profile() {
  const { user } = useAuth();
  const names = user?.full_name?.split(' ') ?? ['Mnemo', 'Learner'];
  const initials = names.map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 flex items-center justify-center text-3xl text-accent-purple font-bold shadow-sm">
          {initials}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800">{user?.full_name}</h2>
          <p className="text-slate-500 mb-4">{user?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <span className="px-4 py-2 rounded-lg bg-purple-50 text-accent-purple text-sm font-bold border border-purple-100">
              {user?.study_goal ?? 'General Learning'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {[
            { icon: User, label: 'Personal Info', active: true },
            { icon: Lock, label: 'Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Privacy', active: false }
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-pink-50 text-accent-pink' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Personal Information</h3>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input type="text" value={names[0] ?? ''} readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" value={names.slice(1).join(' ')} readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" value={user?.email ?? ''} readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Study Goal</label>
                <input value={user?.study_goal ?? 'General Learning'} readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
