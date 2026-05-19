import { useState, type FormEvent } from 'react';
import { Lead, LeadSource, LeadStatus } from '../types';

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface LeadFormProps {
  lead?: Partial<Lead>;
  onSubmit: (data: { name: string; email: string; status: LeadStatus; source: LeadSource }) => void;
  buttonLabel: string;
  submitting: boolean;
}

function LeadForm({ lead, onSubmit, buttonLabel, submitting }: LeadFormProps) {
  const [name, setName] = useState(lead?.name ?? '');
  const [email, setEmail] = useState(lead?.email ?? '');
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? 'New');
  const [source, setSource] = useState<LeadSource>(lead?.source ?? 'Website');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ name, email, status, source });
  }

  return (
    <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Source</label>
          <select
            value={source}
            onChange={(event) => setSource(event.target.value as LeadSource)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {sources.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Saving…' : buttonLabel}
      </button>
    </form>
  );
}

export default LeadForm;
