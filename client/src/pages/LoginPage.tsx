import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-2xl font-semibold">Login to your account</h2>
      {error ? <div className="mb-4 rounded-xl bg-rose-100 p-3 text-sm text-rose-800 dark:bg-rose-950 dark:text-rose-200">{error}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        New here?{' '}
        <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
