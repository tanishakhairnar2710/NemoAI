import React from 'react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <div className="py-12 text-center text-sm font-medium text-slate-500">{label}</div>;
}
