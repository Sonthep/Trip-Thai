/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "*.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "photos.google.com", pathname: "/**" },
      { protocol: "https", hostname: "*.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "*.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "www.tourismthailand.org", pathname: "/**" },
      { protocol: "https", hostname: "*.tourismthailand.org", pathname: "/**" },
      { protocol: "https", hostname: "tat.or.th", pathname: "/**" },
    ],
  },
}

export default nextConfig
