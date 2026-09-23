import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewApi } from '../api/review.api';
import { useAuth } from '../context/AuthContext';
import type { Review, Pagination as PaginationType } from '../types';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import RatingStars from '../components/RatingStars';
import { getErrorMessage } from '../api/axios';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(loadReviews, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, ratingFilter]);

  async function loadReviews() {
    setLoading(true);
    setError('');
    try {
      const res = await reviewApi.list({
        page,
        limit: 10,
        search: search || undefined,
        rating: ratingFilter ? parseInt(ratingFilter, 10) : undefined,
      });
      setReviews(res.data.data);
      setPagination(res.data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewApi.remove(id);
      loadReviews();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Reviews</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="w-64">
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="w-40">
          <Select
            value={ratingFilter}
            onChange={(e) => {
              setPage(1);
              setRatingFilter(e.target.value);
            }}
            options={[
              { label: 'All ratings', value: '' },
              ...[5, 4, 3, 2, 1].map((n) => ({ label: `${n} star`, value: String(n) })),
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews found" description="Try a different search or filter." />
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((review) => {
              const isOwner = user?.id === review.userId;
              const isAdmin = user?.role === 'ADMIN';
              return (
                <Card key={review.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        to={`/colleges/${review.collegeId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {review.college?.name || 'College'}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        by {review.reviewer?.name || 'Anonymous'} ·{' '}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  {(isOwner || isAdmin) && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="danger" onClick={() => handleDelete(review.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
