import React, { useEffect, useState } from 'react';
import { Star, PiggyBank, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

interface StarredMonthRow {
  monthKey: string;
  allocated: number;
}

interface StarredSummary {
  categoryId: string;
  categoryName: string;
  totalAllocated: number;
  byMonth: StarredMonthRow[];
}

const normalizeSummary = (raw: any): StarredSummary => ({
  categoryId: String(raw.categoryId ?? ''),
  categoryName: String(raw.categoryName ?? ''),
  totalAllocated: Number(raw.totalAllocated ?? 0),
  byMonth: (raw.byMonth ?? []).map((row: any) => ({
    monthKey: String(row.monthKey ?? ''),
    allocated: Number(row.allocated ?? 0),
  })),
});

export function GlobalTrackedDashboard() {
  const [rows, setRows] = useState<StarredSummary[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/starred-allocations`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        if (!cancelled) {
          setRows(Array.isArray(data) ? data.map(normalizeSummary) : []);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load');
          setRows([]);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl mb-2 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          Starred funds — running total
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Star Stocks (or any fund) on the Dashboard. Each month, use <strong>Allocate</strong> to add
          money to that fund. Here you see the <strong>sum of every monthly add</strong> so far — not
          expenses, not unspent balance, only what you chose to put in over time.
        </p>

        {loadError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {loadError}
          </div>
        )}

        {!loadError && rows.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nothing starred yet, or no saved months. On Dashboard → Allocate Funds, click the star next
            to a fund, then add amounts across months.
          </div>
        )}

        {rows.length > 0 && (
          <div className="space-y-6">
            {rows.map((row) => {
              const monthsWithAdds = row.byMonth.filter((m) => m.allocated > 0);
              return (
                <div
                  key={row.categoryId}
                  className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-amber-50/40 to-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <PiggyBank className="w-6 h-6 text-amber-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{row.categoryName}</div>
                        <div className="text-sm text-gray-500">All months combined</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Total you have added
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        ₹{row.totalAllocated.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {monthsWithAdds.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        How much you added each month
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {monthsWithAdds.map((m) => (
                          <li
                            key={`${row.categoryId}-${m.monthKey}`}
                            className="flex justify-between px-3 py-2 bg-white rounded border border-gray-100"
                          >
                            <span className="text-gray-600">{m.monthKey}</span>
                            <span className="font-medium text-gray-900">
                              +₹{m.allocated.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
