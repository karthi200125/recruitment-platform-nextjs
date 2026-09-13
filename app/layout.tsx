import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import NetworkStatus from "@/components/NetworkStatus";
import Providers from "@/components/Providers";
import RootLayoutClient from "@/components/RootLayoutClient";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,

  applicationName: siteConfig.applicationName,

  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },

  description: siteConfig.description,

  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  category: siteConfig.category,

  alternates: {
    canonical: siteConfig.url,
  },

  robots: {
    index: siteConfig.robots.index,
    follow: siteConfig.robots.follow,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  manifest: siteConfig.manifest,

  icons: {
    icon: [{ url: siteConfig.favicon }],

    apple: [
      {
        url: siteConfig.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut: [{ url: siteConfig.favicon }],
  },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,

    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.twitterImage],
  },

  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
  viewportFit: "cover",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang={siteConfig.language}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${inter.className} min-h-screen bg-background font-sans antialiased`}
      >
        <Providers>
          <RootLayoutClient>
            <TooltipProvider>
              <ServiceWorkerRegister />
              <NetworkStatus />

              {children}

              <Toaster />
            </TooltipProvider>
          </RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}