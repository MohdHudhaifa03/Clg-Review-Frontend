import React from 'react';

export default function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';
  const rounded = Math.round(rating);

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass}`} title={`${rating} out of 5`}>
      <span className="text-yellow-500">
        {'★'.repeat(rounded)}
        <span className="text-gray-300">{'★'.repeat(5 - rounded)}</span>
      </span>
      <span className="text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}
