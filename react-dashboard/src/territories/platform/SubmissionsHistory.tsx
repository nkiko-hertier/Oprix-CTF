import { useEffect, useState } from 'react';
import getApiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Submission, PaginatedResponse } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleApiError } from '@/lib/error-handler';
import { CheckCircle2, XCircle, Clock, Filter, Search } from 'lucide-react';
import { formatTimeAgoOrRemaining } from '@/lib/utils';

export default function SubmissionsHistory() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompetition, setFilterCompetition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSubmissions();
  }, [page, filterCompetition, filterStatus]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filterCompetition !== 'all') {
        params.append('competitionId', filterCompetition);
      }

      const response = await getApiClient().get<PaginatedResponse<Submission>>(
        `${API_ENDPOINTS.SUBMISSIONS.GET_MY}?${params.toString()}`
      );

      let filteredSubmissions = response.data.data || [];

      // Client-side filtering for status
      if (filterStatus !== 'all') {
        filteredSubmissions = filteredSubmissions.filter((sub) => {
          if (filterStatus === 'correct') return sub.isCorrect;
          if (filterStatus === 'incorrect') return !sub.isCorrect;
          return true;
        });
      }

      // Client-side search
      if (searchTerm) {
        filteredSubmissions = filteredSubmissions.filter((sub) =>
          sub.flag.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.challengeId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setSubmissions(filteredSubmissions);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && submissions.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton height={60} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={100} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Submission History</h1>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by flag or challenge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="correct">Correct</SelectItem>
              <SelectItem value="incorrect">Incorrect</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={fetchSubmissions}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <p className="text-gray-400">No submissions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {submission.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="font-semibold text-white">
                      Challenge: {submission.challengeId.slice(0, 8)}...
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        submission.isCorrect
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {submission.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTimeAgoOrRemaining(submission.submittedAt)}
                    </div>
                    {submission.pointsEarned > 0 && (
                      <div className="text-green-400 font-medium">
                        +{submission.pointsEarned} points
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {page} of {totalPages} ({total} total)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

