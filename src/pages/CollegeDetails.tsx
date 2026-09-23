import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';

// Helper to get image based on college ID
const getCollegeImage = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }
  const imageNum = (hash % 3) + 1;
  return `/images/college-${imageNum}.jpg`;
};
import { collegeApi } from '../api/college.api';
import { reviewApi } from '../api/review.api';
import { useAuth } from '../context/AuthContext';
import type { College, Review } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import RatingStars from '../components/RatingStars';
import { getErrorMessage } from '../api/axios';

export default function CollegeDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadData(collegeId: string) {
    setLoading(true);
    setError('');
    try {
      const [collegeRes, reviewsRes] = await Promise.all([
        collegeApi.getById(collegeId),
        reviewApi.list({ collegeId, page: 1, limit: 50 }),
      ]);
      setCollege(collegeRes.data.data);
      setReviews(reviewsRes.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (editingReviewId) {
        await reviewApi.update(editingReviewId, { rating: parseInt(rating, 10), comment });
        setSuccess('Review updated successfully');
      } else {
        await reviewApi.create({ collegeId: id, rating: parseInt(rating, 10), comment });
        setSuccess('Review submitted successfully');
      }
      setComment('');
      setRating('5');
      setEditingReviewId(null);
      await loadData(id);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(review: Review) {
    setEditingReviewId(review.id);
    setRating(String(review.rating));
    setComment(review.comment);
  }

  async function handleDelete(reviewId: string) {
    if (!id) return;
    if (!confirm('Delete this review?')) return;
    try {
      await reviewApi.remove(reviewId);
      await loadData(id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <LoadingSpinner label="Loading college details..." />;
  if (!college) return <EmptyState title="College not found" />;

  return (
    <div>
      <Link to="/colleges" className="text-sm text-primary font-medium hover:underline">
        ← Back to colleges
      </Link>

      <div className="mt-4 relative h-64 md:h-80 w-full overflow-hidden rounded-2xl shadow-sm">
        <img 
          src={getCollegeImage(college.id)} 
          alt={college.name} 
          className="h-full w-full object-cover" 
          loading="lazy" 
        />
      </div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{college.name}</h1>
            <p className="text-sm text-muted-foreground">{college.location}</p>
          </div>
          <RatingStars rating={college.averageRating} size="lg" />
        </div>
        {college.description && <p className="mt-4 text-sm text-muted-foreground">{college.description}</p>}
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-primary font-medium hover:underline"
          >
            {college.website}
          </a>
        )}
        <p className="mt-3 text-xs text-muted-foreground">{college.reviewCount} review(s)</p>
      </Card>

      {user && (
        <Card className="mt-6">
          <h2 className="mb-3 font-semibold text-foreground">
            {editingReviewId ? 'Edit your review' : 'Write a review'}
          </h2>
          {error && (
            <div className="mb-3">
              <ErrorMessage message={error} />
            </div>
          )}
          {success && (
            <div className="mb-3">
              <SuccessMessage message={success} />
            </div>
          )}
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <Select
              label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              options={[1, 2, 3, 4, 5].map((n) => ({ label: `${n} star${n > 1 ? 's' : ''}`, value: String(n) }))}
            />
            <Input
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              minLength={3}
            />
            <div className="flex gap-2">
              <Button type="submit" loading={submitting}>
                {editingReviewId ? 'Update review' : 'Submit review'}
              </Button>
              {editingReviewId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingReviewId(null);
                    setComment('');
                    setRating('5');
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      <h2 className="mb-3 mt-6 font-semibold text-foreground">Reviews</h2>
      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Be the first to review this college." />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const isOwner = user?.id === review.userId;
            const isAdmin = user?.role === 'ADMIN';
            return (
              <Card key={review.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{review.reviewer?.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                {(isOwner || isAdmin) && (
                  <div className="mt-3 flex gap-2">
                    {isOwner && (
                      <Button size="sm" variant="secondary" onClick={() => startEdit(review)}>
                        Edit
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(review.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
