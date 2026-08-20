/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Shared-Hosting (Infomaniak) hat wenig RAM: Build ohne parallele Worker,
  // sonst stirbt "Generating static pages" mit SIGABRT.
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
