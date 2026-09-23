import React, { useEffect, useState } from 'react';
import { collegeApi } from '../../api/college.api';
import { reviewApi } from '../../api/review.api';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { getErrorMessage } from '../../api/axios';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

export default function AdminDashboard() {
  const [totalColleges, setTotalColleges] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [collegesRes, reviewsRes] = await Promise.all([
          collegeApi.list({ page: 1, limit: 1 }),
          reviewApi.list({ page: 1, limit: 1 }),
        ]);
        setTotalColleges(collegesRes.data.pagination?.total || 0);
        setTotalReviews(reviewsRes.data.pagination?.total || 0);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading admin dashboard..." />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Admin Dashboard</h1>
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-muted-foreground">Total Colleges</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{totalColleges}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{totalReviews}</p>
        </Card>
      </div>
      <div className="mt-6">
        <Link to="/admin/colleges">
          <Button>Manage Colleges</Button>
        </Link>
      </div>
    </div>
  );
}
