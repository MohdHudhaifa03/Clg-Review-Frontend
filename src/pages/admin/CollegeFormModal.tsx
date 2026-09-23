import React, { useState, useEffect, FormEvent } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import type { College } from '../../types';
import { collegeApi } from '../../api/college.api';
import { getErrorMessage } from '../../api/axios';

interface CollegeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  college: College | null; // null = create mode
}

export default function CollegeFormModal({ open, onClose, onSaved, college }: CollegeFormModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (college) {
      setName(college.name);
      setLocation(college.location);
      setDescription(college.description || '');
      setWebsite(college.website || '');
    } else {
      setName('');
      setLocation('');
      setDescription('');
      setWebsite('');
    }
    setError('');
  }, [college, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { name, location, description: description || undefined, website: website || undefined };
      if (college) {
        await collegeApi.update(college.id, payload);
      } else {
        await collegeApi.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={college ? 'Edit College' : 'Create College'}>
      {error && (
        <div className="mb-3">
          <ErrorMessage message={error} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Website"
          type="url"
          placeholder="https://example.edu"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {college ? 'Save changes' : 'Create college'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
