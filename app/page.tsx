import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';

import HeroSection from './(public)/home/Hero';
import TrustedBy from './(public)/home/TrustedBy';
import JobCategories from './(public)/home/JobCategories';

const SectionSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4 py-20 animate-pulse">
    <div className="h-6 w-40 rounded bg-white/10 mb-6 mx-auto" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-40 rounded-xl bg-white/10" />
      <div className="h-40 rounded-xl bg-white/10" />
      <div className="h-40 rounded-xl bg-white/10" />
    </div>
  </div>
);

const FooterSkeleton = () => (
  <div className="h-40 w-full" />
);


const FeaturedJobs = dynamic(
  () => import('./(public)/home/FeaturedJobs'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const HowItWorks = dynamic(
  () => import('./(public)/home/HowItWorks'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const WhyChooseUs = dynamic(
  () => import('./(public)/home/WhyChooseUs'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const ForRecruiters = dynamic(
  () => import('./(public)/home/ForRecruiters'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const Testimonials = dynamic(
  () => import('./(public)/home/Testimonials'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const Newsletter = dynamic(
  () => import('./(public)/home/Newsletter'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const Pricing = dynamic(
  () => import('./(public)/home/Pricing'),
  {
    loading: () => <SectionSkeleton />,
  }
);

const Footer = dynamic(
  () => import('./(public)/home/Footer'),
  {
    loading: () => <FooterSkeleton />,
  }
);

/* -------------------------------------------------------------------------- */
/*                                   SEO                                      */
/* -------------------------------------------------------------------------- */

const BASE_URL =
  process.env.NEXT_PUBLIC_URL ??
  'https://job-portal-hmif.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,

  themeColor: [
    {
      media: '(prefers-color-scheme: dark)',
      color: '#000000',
    },

    {
      media: '(prefers-color-scheme: light)',
      color: '#000000',
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    absolute: 'Jobify — Find Your Dream Job, Easy & Fast',
    template: '%s | Jobify',
  },

  description:
    'Find jobs, hire talent, and grow your career with Jobify. Browse verified listings from top companies worldwide.',

  keywords: [
    'job board',
    'jobs',
    'remote jobs',
    'career growth',
    'hiring platform',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'Jobify — Find Your Dream Job, Easy & Fast',

    description:
      'Find jobs, hire talent, and grow your career with Jobify.',

    url: BASE_URL,
    siteName: 'Jobify',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Jobify — Find Your Dream Job, Easy & Fast',

    description:
      'Find jobs, hire talent, and grow your career with Jobify.',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',

  '@type': 'WebSite',

  name: 'Jobify',

  url: BASE_URL,

  potentialAction: {
    '@type': 'SearchAction',

    target: {
      '@type': 'EntryPoint',

      urlTemplate: `${BASE_URL}/jobs?q={search_term_string}`,
    },

    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <main className="w-full min-h-screen overflow-hidden bg-black text-white pb-10">

        {/* Above the fold */}
        <HeroSection />
        <TrustedBy />
        <JobCategories />

        {/* Below the fold */}
        <FeaturedJobs />
        <HowItWorks />
        <WhyChooseUs />
        <ForRecruiters />
        <Testimonials />
        <Pricing />
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}