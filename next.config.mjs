import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "img.freepik.com" },
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "utfs.io" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "api.dicebear.com", },
            { protocol: "https", hostname: "cdn.simpleicons.org", },
        ],
    },

    reactStrictMode: process.env.NODE_ENV !== "development",

    experimental: {
        turbo: {
            enabled: true,
        },
    },
};

export default withBundleAnalyzer(nextConfig);