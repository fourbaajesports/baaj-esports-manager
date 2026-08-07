function StatCard({ title, value }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/20">

      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-400/10 blur-3xl transition-all duration-300 group-hover:bg-yellow-400/20"></div>

      <p className="relative text-sm font-medium tracking-wide text-slate-400 uppercase">
        {title}
      </p>

      <h2 className="relative mt-4 text-4xl font-extrabold text-white transition-colors duration-300 group-hover:text-yellow-400">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;