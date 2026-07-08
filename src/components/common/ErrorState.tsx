import React from 'react';

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">{message}</div>;
}
