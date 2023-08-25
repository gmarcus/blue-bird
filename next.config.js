/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com"
            }
        ] 
    }
};

module.exports = nextConfig;
