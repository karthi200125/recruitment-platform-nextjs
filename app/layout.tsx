import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-quill/dist/quill.snow.css';
import RootLayoutClient from "@/components/RootLayoutClient";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Find Your Dream Job | JOBIFY",
  description: "Browse thousands of job listings from top companies. Apply for jobs and get hired today!",
  keywords: "jobs, hiring, careers, job listings, remote jobs",
  openGraph: {
    title: "Find Your Dream Job | JOBIFY",
    description: "Browse thousands of job listings from top companies. Apply for jobs and get hired today!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Dream Job | JOBIFY",
    description: "Browse thousands of job listings from top companies. Apply for jobs and get hired today!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RootLayoutClient>
            <Toaster />
            {children}
          </RootLayoutClient>
        </Providers>
      </body>
    </html >
  );
}
