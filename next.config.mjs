/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'img.freepik.com' },
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'utfs.io' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
    },

    reactStrictMode: true,

    experimental: {
        turbo: {
            enabled: true,
        },
    },
};

export default nextConfig;