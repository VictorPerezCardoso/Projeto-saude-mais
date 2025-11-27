export function StatsCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
      <p className="text-[#7B8198] font-inter text-sm mb-2">{label}</p>
      <p className={`text-3xl font-poppins font-bold ${color}`}>{value}</p>
    </div>
  );
}
