import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import LeadForm from '../components/LeadForm';
import Pagination from '../components/Pagination';
import { Lead, LeadSource, LeadStatus, PaginatedLeads } from '../types';

const statusOptions: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sourceOptions: LeadSource[] = ['Website', 'Instagram', 'Referral'];

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('sort', sort);
    if (status) params.set('status', status);
    if (source) params.set('source', source);
    if (debouncedSearch) params.set('search', debouncedSearch);
    return params.toString();
  }, [page, sort, status, source, debouncedSearch]);

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get<PaginatedLeads>(`/leads?${queryParams}`);
        setLeads(response.data.leads);
        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Unable to load leads');
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [queryParams]);

  async function handleCreateOrUpdate(data: { name: string; email: string; status: LeadStatus; source: LeadSource }) {
    setSubmitting(true);
    setError('');

    try {
      if (selectedLead) {
        const response = await api.put<{ lead: Lead }>(`/leads/${selectedLead._id}`, data);
        setLeads((current) => current.map((lead) => (lead._id === response.data.lead._id ? response.data.lead : lead)));
        setSelectedLead(null);
      } else {
        const response = await api.post<{ lead: Lead }>('/leads', data);
        setLeads((current) => [response.data.lead, ...current]);
        setTotal((value) => value + 1);
      }
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Unable to save lead');
    } finally {
      setSubmitting(false);
    }
  }

  function exportCsv() {
    if (!leads.length) {
      return;
    }

    const rows = [
      ['Name', 'Email', 'Status', 'Source', 'Created At'],
      ...leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, new Date(lead.createdAt).toLocaleString()])
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-export-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    setError('');
    try {
      await api.delete(`/leads/${id}`);
      setLeads((current) => current.filter((lead) => lead._id !== id));
      setTotal((value) => Math.max(0, value - 1));
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Unable to delete lead');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
          <h2 className="text-2xl font-semibold">{user?.name || 'Sales User'}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Role: {user?.role}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportCsv} className="rounded-full border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            Export CSV
          </button>
          <button onClick={() => navigate('/')} className="rounded-full border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            Refresh
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Create / Edit Lead</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use the form to add a new lead or update the selected lead from the table.</p>
          </div>
          <LeadForm
            lead={selectedLead ?? undefined}
            onSubmit={handleCreateOrUpdate}
            buttonLabel={selectedLead ? 'Update Lead' : 'Add Lead'}
            submitting={submitting}
          />
        </div>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Lead list</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filter, search, and manage leads quickly.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {total} leads
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">All statuses</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">All sources</option>
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as 'latest' | 'oldest')}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or email"
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">{error}</div> : null}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <span>Name</span>
              <span>Email</span>
              <span>Status</span>
              <span>Source</span>
              <span>Actions</span>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-600 dark:text-slate-400">Loading leads…</div>
            ) : leads.length === 0 ? (
              <div className="p-10 text-center text-slate-500 dark:text-slate-400">No leads found. Adjust your filters or create a new lead.</div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {leads.map((lead) => (
                  <div key={lead._id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-4 py-4 text-sm text-slate-700 dark:text-slate-200">
                    <div>{lead.name}</div>
                    <div>{lead.email}</div>
                    <div>{lead.status}</div>
                    <div>{lead.source}</div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="rounded-full border border-sky-500 px-3 py-1 text-xs font-semibold text-sky-600 transition hover:bg-sky-50 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead._id)}
                        className="rounded-full border border-rose-500 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-400 dark:text-rose-300 dark:hover:bg-slate-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
