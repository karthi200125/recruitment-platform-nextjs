import { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

// ✅ CRITICAL (Above the fold → NO dynamic)
import HeroSection from "./(pages)/home/Hero";
import TrustedBy from "./(pages)/home/TrustedBy";
import JobCategories from "./(pages)/home/JobCategories";


const SectionSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4 py-20 animate-pulse">
    <div className="h-6 w-40 bg-white/10 rounded mb-6 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-40 bg-white/10 rounded-xl" />
      <div className="h-40 bg-white/10 rounded-xl" />
      <div className="h-40 bg-white/10 rounded-xl" />
    </div>
  </div>
);


const FeaturedJobs = dynamic(() => import("./(pages)/home/FeaturedJobs"), {
  loading: () => <SectionSkeleton />,
});

const HowItWorks = dynamic(() => import("./(pages)/home/HowItWorks"), {
  loading: () => <SectionSkeleton />,
});

const WhyChooseUs = dynamic(() => import("./(pages)/home/WhyChooseUs"), {
  loading: () => <SectionSkeleton />,
});

const ForRecruiters = dynamic(() => import("./(pages)/home/ForRecruiters"), {
  loading: () => <SectionSkeleton />,
});

const Testimonials = dynamic(() => import("./(pages)/home/Testimonials"), {
  loading: () => <SectionSkeleton />,
});

const Newsletter = dynamic(() => import("./(pages)/home/Newsletter"), {
  loading: () => <SectionSkeleton />,
});

const Pricing = dynamic(() => import("./(pages)/home/Pricing"), {
  loading: () => <SectionSkeleton />,
});

const Footer = dynamic(() => import("./(pages)/home/Footer"), {
  loading: () => <div className="h-40" />, // ultra-light fallback
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};


export const metadata: Metadata = {
  title: {
    absolute: "Jobify — Find Your Dream Job, Easy & Fast",
    template: "%s | Jobify",
  },
  description:
    "Find jobs, hire talent, and grow your career with Jobify. Browse verified listings from top companies worldwide.",
  keywords: [
    "job board",
    "jobs",
    "remote jobs",
    "career growth",
    "hiring platform",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL ?? "https://job-portal-hmif.vercel.app"
  ),
  alternates: { canonical: "/" },
};


const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jobify",
  url: process.env.NEXT_PUBLIC_URL ?? "https://job-portal-hmif.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_URL ?? "https://job-portal-hmif.vercel.app"
        }/jobs?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};


export default function Home() {
  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <main className="w-full min-h-screen text-white bg-black overflow-hidden pb-10">

        
        <HeroSection />
        <TrustedBy />
        <JobCategories />
        
        <FeaturedJobs />
        <HowItWorks />
        <WhyChooseUs />
        <ForRecruiters />
        <Testimonials />
        {/* <Pricing /> */}
        <Newsletter />

      </main>

      <Footer />
    </>
  );
}