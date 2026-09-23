import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collegeApi } from '../api/college.api';
import type { College, Pagination as PaginationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import RatingStars from '../components/RatingStars';
import { getErrorMessage } from '../api/axios';
import { MapPin, Briefcase, Stethoscope, Landmark, TestTube, Microscope, Monitor, Scale, BookOpen } from 'lucide-react';

const CATEGORIES = [
  { name: 'Engineering', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
  { name: 'Doctor', icon: Stethoscope, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { name: 'Management', icon: Landmark, color: 'text-purple-500', bg: 'bg-purple-100' },
  { name: 'Science', icon: TestTube, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  { name: 'Art & Human', icon: Microscope, color: 'text-pink-500', bg: 'bg-pink-100' },
  { name: 'Architecture', icon: BuildingIcon, color: 'text-orange-500', bg: 'bg-orange-100' },
  { name: 'Computer', icon: Monitor, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { name: 'Law', icon: Scale, color: 'text-red-500', bg: 'bg-red-100' },
  { name: 'Teaching', icon: BookOpen, color: 'text-yellow-500', bg: 'bg-yellow-100' },
];

function BuildingIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  );
}

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadColleges();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadColleges() {
    setLoading(true);
    setError('');
    try {
      const res = await collegeApi.list({ page, limit: 9 });
      setColleges(res.data.data);
      setPagination(res.data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Use different photos based on the college ID for variety
  const getCollegeImage = (id: string) => {
    // Generate a simple hash from the ID to pick an image
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
    const imageNum = (hash % 3) + 1; // Returns 1, 2, or 3
    return `/images/college-${imageNum}.jpg`;
  };

  return (
    <div className="animate-scale-in pb-12">
      {/* Hero Banner */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-primary text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img src="/images/college-1.jpg" alt="College" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="relative z-10 p-10 md:p-16 lg:w-2/3">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Select A College Which Is <span className="text-secondary">Best For You!</span>
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl">
            Discover thousands of colleges and read honest reviews from real students. Find your perfect fit today.
          </p>
          


          <div className="mt-10 flex gap-6">
            <div className="glass rounded-xl bg-white/10 p-4 px-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-primary-foreground/80">Colleges on this site.</div>
            </div>
            <div className="glass rounded-xl bg-white/10 p-4 px-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white">1.5k+</div>
              <div className="text-sm text-primary-foreground/80">Reviews on this site.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Find Your Colleges & Exam</h2>
          <p className="mt-2 text-muted-foreground">The most famous colleges in India</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md border border-slate-100">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${cat.bg} ${cat.color}`}>
                <cat.icon size={28} />
              </div>
              <span className="font-semibold text-foreground text-center">{cat.name}</span>
              <span className="mt-1 text-xs text-muted-foreground">10k+ Colleges</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Colleges Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Top Colleges</h2>
          <p className="mt-2 text-muted-foreground">Explore the most highly-rated institutions.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading colleges..." />
      ) : colleges.length === 0 ? (
        <EmptyState title="No colleges found" description="Try adjusting your search criteria." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <div key={college.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-40 w-full overflow-hidden sm:h-48">
                  <img 
                    src={getCollegeImage(college.id)} 
                    alt={college.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-primary backdrop-blur-md shadow-sm">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground line-clamp-1">{college.name}</h3>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <MapPin size={16} className="mr-1 text-primary" />
                    {college.location}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Rating</span>
                      <div className="flex items-center mt-1">
                        <RatingStars rating={college.averageRating} size="sm" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Reviews</span>
                      <span className="mt-1 font-semibold text-foreground">{college.reviewCount}</span>
                    </div>
                  </div>
                  
                  <Link to={`/colleges/${college.id}`}>
                    <button className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      Apply Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
          </div>
        </>
      )}
    </div>
  );
}
