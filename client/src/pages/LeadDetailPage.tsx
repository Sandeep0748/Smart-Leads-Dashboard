import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Lead } from '../types';

function LeadDetailPage() {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLead() {
      if (!id) return;
      setLoading(true);
      setError('');

      try {
        const response = await api.get<{ lead: Lead }>(`/leads/${id}`);
        setLead(response.data.lead);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Unable to load lead');
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [id]);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Back
      </button>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="text-slate-500 dark:text-slate-400">Loading lead details…</div>
        ) : error ? (
          <div className="rounded-xl bg-rose-100 p-4 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</div>
        ) : lead ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{lead.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</p>
                <p className="mt-2 text-lg font-medium">{lead.email}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</p>
                <p className="mt-2 text-lg font-medium">{lead.status}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Source</p>
                <p className="mt-2 text-lg font-medium">{lead.source}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Created at</p>
                <p className="mt-2 text-lg font-medium">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400">Lead not found.</div>
        )}
      </div>
    </div>
  );
}

export default LeadDetailPage;
