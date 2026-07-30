import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";

import Providers from "@/components/Providers";
import RootLayoutClient from "@/components/RootLayoutClient";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "Jobify";
const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://www.jobify.com";

const SITE_DESCRIPTION =
  "Find your dream job with verified companies. Search thousands of jobs, connect with recruiters, and grow your career with Jobify.";

const OG_IMAGE = `${SITE_URL}/og-image.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    default: "Jobify | Find Your Dream Job",
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  keywords: [
    "Jobify",
    "Jobs",
    "Careers",
    "Hiring",
    "Job Board",
    "Remote Jobs",
    "Tech Jobs",
    "Software Engineer",
    "Developer Jobs",
    "Recruitment",
    "Employment",
    "Companies",
    "Internships",
  ],

  authors: [
    {
      name: "Jobify",
      url: SITE_URL,
    },
  ],

  creator: "Jobify",
  publisher: "Jobify",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Jobify | Find Your Dream Job",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Jobify",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jobify | Find Your Dream Job",
    description: SITE_DESCRIPTION,
    creator: "@jobify",
    images: [OG_IMAGE],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366F1",
  colorScheme: "light",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <RootLayoutClient>
            {children}
            <Toaster />
          </RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}