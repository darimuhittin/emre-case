/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "loremflickr.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "/**",
            },
        ],
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
