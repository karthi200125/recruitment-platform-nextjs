'use client';

import { testimonialsdata } from '@/lib/data/testimonial-data'

const INITIALS_COLORS = [
  "bg-indigo-500/20 text-indigo-300",
  "bg-violet-500/20 text-violet-300",
  "bg-sky-500/20 text-sky-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-rose-500/20 text-rose-300",
  "bg-amber-500/20 text-amber-300",
];

function Avatar({ name, image, index }: { name: string; image: string; index: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${INITIALS_COLORS[index % INITIALS_COLORS.length]}`}>
        {initials}
      </div>
    </div>
  );
}

const STATS = [
  { value: "50K+", label: "Job seekers" },
  { value: "12K+", label: "Companies" },
  { value: "98%", label: "Satisfaction" },
];

const Testimonials = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative w-full bg-[#09090b] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-start">
        <div className="w-[600px] h-[300px] rounded-full bg-violet-600/8 blur-[100px] translate-y-12" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Trusted by thousands
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4"
          >
            Real people,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              real results
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Job seekers and recruiters across India use our platform to move faster and hire smarter.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 sm:gap-14 mb-16">
          {STATS.map(({ value, label }, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonialsdata.map((item, index) => (
            <li key={item.id} className={index === 1 ? "sm:translate-y-5" : ""}>
              <article className="group h-full flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 transition-all duration-300 hover:border-white/[0.14] hover:bg-zinc-900/80 hover:-translate-y-1">

                {/* Quote mark */}
                <div className="text-4xl leading-none text-zinc-700 font-serif select-none">
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 -mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${i < item.rating ? "text-amber-400" : "text-zinc-700"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-zinc-400 leading-relaxed flex-1 group-hover:text-zinc-300 transition-colors duration-300">
                  {item.content}
                </p>

                {/* Divider */}
                <div className="h-px bg-white/[0.05]" />

                {/* User */}
                <div className="flex items-center gap-3">
                  <Avatar name={item.name} image={item.image} index={index} />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.role} · {item.company}</p>
                  </div>
                </div>

              </article>
            </li>
          ))}
        </ul>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-500 text-sm mb-4">Join thousands already hired through our platform</p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-lg shadow-indigo-500/20">
            Get started for free
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;