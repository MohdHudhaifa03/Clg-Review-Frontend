import React, { useEffect, useState } from 'react';
import { collegeApi } from '../../api/college.api';
import type { College, Pagination as PaginationType } from '../../types';
import Button from '../../components/Button';
import Table, { Column } from '../../components/Table';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';
import RatingStars from '../../components/RatingStars';
import CollegeFormModal from './CollegeFormModal';
import { getErrorMessage } from '../../api/axios';

export default function ManageColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  useEffect(() => {
    loadColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadColleges() {
    setLoading(true);
    setError('');
    try {
      const res = await collegeApi.list({ page, limit: 10 });
      setColleges(res.data.data);
      setPagination(res.data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingCollege(null);
    setModalOpen(true);
  }

  function openEdit(college: College) {
    setEditingCollege(college);
    setModalOpen(true);
  }

  async function handleDelete(college: College) {
    if (!confirm(`Delete "${college.name}"? This will also delete its reviews.`)) return;
    try {
      await collegeApi.remove(college.id);
      loadColleges();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const columns: Column<College>[] = [
    { header: 'Name', render: (c) => <span className="font-medium text-foreground">{c.name}</span> },
    { header: 'Location', render: (c) => c.location },
    { header: 'Rating', render: (c) => <RatingStars rating={c.averageRating} size="sm" /> },
    { header: 'Reviews', render: (c) => c.reviewCount },
    {
      header: 'Actions',
      render: (c) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(c)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Manage Colleges</h1>
        <Button onClick={openCreate}>+ Create College</Button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading colleges..." />
      ) : colleges.length === 0 ? (
        <EmptyState
          title="No colleges yet"
          description="Create your first college to get started."
          action={<Button onClick={openCreate}>+ Create College</Button>}
        />
      ) : (
        <>
          <Table columns={columns} data={colleges} keyField={(c) => c.id} />
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </>
      )}

      <CollegeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadColleges}
        college={editingCollege}
      />
    </div>
  );
}
