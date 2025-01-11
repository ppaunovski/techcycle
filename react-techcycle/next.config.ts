import type {NextConfig} from "next";

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', 
                destination: 'http://backend:8080/api/:path*', 
            },
        ];
    },
    output: 'standalone', 
    typescript: {
        
        
        
        
        ignoreBuildErrors: true,
    },
    eslint: {
        
        
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;

export default nextConfig;
