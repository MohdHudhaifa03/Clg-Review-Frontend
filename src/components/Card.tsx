import React, { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>{children}</div>;
}
