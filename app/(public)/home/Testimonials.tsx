import { testimonialsdata } from "@/lib/data/testimonial-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


function Avatar({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  return (
    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.03]">
      {image ? (
        <Image
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          fill
          sizes="48px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
      )}
    </div>
  );
}

const Testimonials = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-[#09090B] py-28"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-black" />

      {/* TOP GLOW */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_72%)]" />

      {/* SIDE GLOW */}
      <div className="absolute left-1/2 top-1/3 -z-10 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* EYEBROW */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-violet-400" />

            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Trusted by professionals
            </span>
          </div>
        </div>

        {/* HEADING */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="testimonials-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
          >
            Career growth stories
            <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              from real people
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Thousands of professionals and hiring teams use
            Jobify to discover better opportunities, move
            faster, and grow their careers with confidence.
          </p>
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-24 grid grid-cols-1 gap-5 lg:grid-cols-3">

          {testimonialsdata.map((item, index) => {
            const featured =
              index === 0;

            return (
              <article
                key={item.id}
                className={`
                                    group relative overflow-hidden rounded-[30px]
                                    border border-white/[0.08]
                                    bg-white/[0.03]
                                    p-8
                                    backdrop-blur-xl
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:border-white/[0.14]
                                    hover:bg-white/[0.05]
                                    ${featured ? "lg:col-span-2 lg:p-10" : ""
                  }}
                                `}
              >
                {/* TOP HAIRLINE */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* GLOW */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* QUOTE */}
                <div className="text-3xl font-serif leading-none text-white/10">
                  &ldquo;
                </div>

                {/* CONTENT */}
                <blockquote
                  className={`
                                        mt-5 text-white/65

                                        ${featured
                      ? "max-w-3xl text-lg leading-9"
                      : "text-sm leading-8"
                    }
                                    `}
                >
                  {item.content}
                </blockquote>

                {/* USER */}
                <div className="mt-10 flex items-center gap-4 border-t border-white/[0.05] pt-6">

                  <Avatar
                    name={item.name}
                    image={item.image}
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      {item.role} ·{" "}
                      {item.company}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">

          <p className="text-sm text-white/40">
            Join thousands already building their future
            with Jobify.
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/signin"
              className="
                                inline-flex items-center justify-center
                                rounded-2xl
                                border border-white/[0.08]
                                bg-white
                                px-7 py-3.5
                                text-sm font-medium text-black
                                transition-all duration-300
                                hover:bg-white/90
                            "
            >
              Get started for free

              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;