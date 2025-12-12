
export default function StatusCard({ title, value, change, isPositive }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-full">
      <h4 className="text-slate-500 font-semibold mb-2">{title}</h4>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {change}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2">Last 7 days</p>
    </div>
  );
}