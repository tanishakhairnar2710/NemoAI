import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../services/api';

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studyGoal, setStudyGoal] = useState('College Exams');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup({ full_name: fullName, email, password, study_goal: studyGoal });
      navigate('/dashboard');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-soft border border-slate-100 p-8 space-y-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Mnemo<span className="text-accent-pink">AI</span></span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Create account</h1>
          <p className="text-slate-500 mt-1">Start building your learning library.</p>
        </div>
        {error && <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-pink/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-pink/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-pink/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Study Goal</label>
          <select value={studyGoal} onChange={(e) => setStudyGoal(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-pink/20">
            <option>College Exams</option>
            <option>Medical School Prep</option>
            <option>Language Learning</option>
            <option>General Knowledge</option>
          </select>
        </div>
        <button disabled={loading} className="w-full py-3.5 rounded-full gradient-bg text-white font-medium shadow-glow disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-accent-pink font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
