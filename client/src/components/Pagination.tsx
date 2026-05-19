interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <span>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
