import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  UploadCloud,
  Layers,
  HelpCircle,
  CheckSquare,
  BrainCircuit,
  Lightbulb,
  BarChart3,
  User,
  Sparkles } from
'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
const navItems = [
{
  path: '/dashboard',
  icon: LayoutDashboard,
  label: 'Dashboard'
},
{
  path: '/library',
  icon: Library,
  label: 'Library'
},
{
  path: '/upload',
  icon: UploadCloud,
  label: 'Upload'
},
{
  path: '/flashcards',
  icon: Layers,
  label: 'Flashcards'
},
{
  path: '/quiz',
  icon: HelpCircle,
  label: 'Quiz'
},
{
  path: '/review',
  icon: CheckSquare,
  label: 'Review'
},
{
  path: '/mnemonics',
  icon: BrainCircuit,
  label: 'Mnemonics'
},
{
  path: '/insights',
  icon: Lightbulb,
  label: 'Insights'
},
{
  path: '/analytics',
  icon: BarChart3,
  label: 'Analytics'
},
{
  path: '/profile',
  icon: User,
  label: 'Profile'
}];

export function Sidebar() {
  const { user } = useAuth();
  const initials = user?.full_name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'MA';
  return (
    <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-50">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Mnemo<span className="text-accent-pink">AI</span>
          </span>
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) =>
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
              ${isActive ? 'text-white font-medium shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}>
          
            {({ isActive }) =>
          <>
                {isActive &&
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-xl gradient-bg"
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }} />

            }
                <item.icon
              size={20}
              className={`relative z-10 ${isActive ? 'text-white' : ''}`} />
            
                <span className="relative z-10">{item.label}</span>
              </>
          }
          </NavLink>
        )}
      </div>

      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 flex items-center justify-center text-accent-purple font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user?.full_name ?? 'Mnemo Learner'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>);

}
