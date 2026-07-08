import React from 'react';
import { LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export function TopBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18} />
        
        <input
          type="text"
          placeholder="Search notes, flashcards, or topics..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink/30 transition-all placeholder:text-slate-400" />
        
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
          title="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </div>);

}
