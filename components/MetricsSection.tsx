'use client';

export default function MetricsSection() {
  const metrics = [
    { value: '15,000+', label: 'Successful Repairs' },
    { value: '1,400+', label: 'Verified Technicians' },
    { value: '98.6%', label: 'Customer Satisfaction' },
    { value: '< 45 mins', label: 'Average Response Time' }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black font-heading text-prussianBlue tracking-tight">
              {m.value}
            </h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
