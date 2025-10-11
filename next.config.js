/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // فعال کردن حالت strict در React
  images: {
    unoptimized: true, // اگر می‌خوای از تصاویر خارجی یا مسیرهای سفارشی استفاده کنی
  },
  experimental: {
    appDir: true, // فعال کردن App Router (پوشه app/)
  },
};

module.exports = nextConfig;