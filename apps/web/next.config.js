/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@tesland/database', '@tesland/dto', '@tesland/config'],
};

module.exports = nextConfig;
