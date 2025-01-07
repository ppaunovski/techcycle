import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // The path to match in your Next.js app
                destination: 'http://localhost:8080/api/:path*', // The Spring Boot backend
            },
        ];
    },
};

export default nextConfig;
