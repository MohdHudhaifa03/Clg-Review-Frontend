import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collegeApi } from '../api/college.api';
import { reviewApi } from '../api/review.api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorMessage } from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2, MessageSquareText, Star, GraduationCap, TrendingUp, Clock, User } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [totalColleges, setTotalColleges] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<{ name: string; reviews: number; colleges: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ title: string; time: string; type: string }[]>([]);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError('');
      try {
        const [collegesRes, reviewsRes] = await Promise.all([
          collegeApi.list({ page: 1, limit: 100 }),
          reviewApi.list({ page: 1, limit: 100 }),
        ]);
        const allColleges = collegesRes.data.data;
        const allReviews = reviewsRes.data.data;
        const collegeCount = collegesRes.data.pagination?.total || 0;
        const reviewCount = reviewsRes.data.pagination?.total || 0;

        let overallAvg = 0;
        if (allColleges.length > 0) {
          const rated = allColleges.filter((c) => c.reviewCount > 0);
          if (rated.length > 0) {
            overallAvg = rated.reduce((sum, c) => sum + c.averageRating, 0) / rated.length;
          }
        }

        setTotalColleges(collegeCount);
        setTotalReviews(reviewCount);
        setAvgRating(Math.round(overallAvg * 10) / 10);

        // Process recent activity
        const recentItems: { title: string; time: string; type: string; date: Date }[] = [];
        allColleges.forEach(c => {
          recentItems.push({
            title: `${c.name} Profile Added`,
            time: '',
            type: 'college',
            date: new Date(c.createdAt)
          });
        });
        allReviews.forEach(r => {
          const collegeName = r.college?.name || 'a college';
          recentItems.push({
            title: `New Review on ${collegeName}`,
            time: '',
            type: 'review',
            date: new Date(r.createdAt)
          });
        });

        if (user) {
          recentItems.push({
            title: `You joined EduReview`,
            time: '',
            type: 'user',
            date: new Date(user.createdAt)
          });
        }

        recentItems.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        const timeAgo = (date: Date) => {
          const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
          let interval = seconds / 31536000;
          if (interval >= 1) return Math.floor(interval) + ' years ago';
          interval = seconds / 2592000;
          if (interval >= 1) return Math.floor(interval) + ' months ago';
          interval = seconds / 86400;
          if (interval >= 1) return Math.floor(interval) + ' days ago';
          interval = seconds / 3600;
          if (interval >= 1) return Math.floor(interval) + ' hours ago';
          interval = seconds / 60;
          if (interval >= 1) return Math.floor(interval) + ' minutes ago';
          return 'just now';
        };

        const formattedActivity = recentItems.slice(0, 5).map(item => ({
          ...item,
          time: timeAgo(item.date)
        }));
        
        setRecentActivity(formattedActivity);

        // Process chart data (last 6 months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartDataMap = new Map<string, { name: string; reviews: number; colleges: number }>();
        
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = monthNames[d.getMonth()];
          chartDataMap.set(`${d.getFullYear()}-${d.getMonth()}`, { name: monthStr, reviews: 0, colleges: 0 });
        }

        allColleges.forEach(c => {
          const d = new Date(c.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (chartDataMap.has(key)) {
            chartDataMap.get(key)!.colleges++;
          }
        });

        allReviews.forEach(r => {
          const d = new Date(r.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (chartDataMap.has(key)) {
            chartDataMap.get(key)!.reviews++;
          }
        });

        setChartData(Array.from(chartDataMap.values()));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner label="Loading your workspace..." />;

  return (
    <div className="animate-scale-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here is what's happening with your colleges today.</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Colleges</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{totalColleges}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500 font-medium">+4%</span>
            <span className="ml-2 text-muted-foreground">from last month</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{totalReviews}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary-foreground">
              <MessageSquareText size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500 font-medium">+12%</span>
            <span className="ml-2 text-muted-foreground">from last month</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{avgRating || '—'}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Star size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">Across all colleges</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Role</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground capitalize">{user?.role?.toLowerCase() || 'Student'}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <GraduationCap size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-primary font-medium cursor-pointer hover:underline">
            View Role Permissions &rarr;
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="glass lg:col-span-2 rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Overview</h2>
            <select className="rounded-lg border-border bg-transparent px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-primary">
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="reviews" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="colleges" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-6 text-lg font-bold text-foreground">Recent Activity</h2>
          <div className="space-y-6">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start">
                <div className="relative mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  {activity.type === 'review' ? (
                    <MessageSquareText size={16} className="text-primary" />
                  ) : activity.type === 'college' ? (
                    <Building2 size={16} className="text-secondary-foreground" />
                  ) : (
                    <User size={16} className="text-indigo-600" />
                  )}
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute top-10 bottom-[-24px] left-1/2 w-[2px] -translate-x-1/2 bg-slate-100" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl bg-slate-50 py-2 text-sm font-medium text-primary hover:bg-slate-100 transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
