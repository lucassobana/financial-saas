export default function HistoryLoading() {
  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-6 px-4 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-2">
        <div className="space-y-4 p-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>

                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-100 rounded"></div>
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-slate-100 rounded-full"></div>
                <div className="h-8 w-8 bg-slate-100 rounded-full hidden sm:block"></div>
                <div className="h-8 w-8 bg-slate-100 rounded-full hidden sm:block"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
