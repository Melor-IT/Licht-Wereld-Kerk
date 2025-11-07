/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,        // فعال کردن حالت سختگیرانه React
  swcMinify: true,              // فعال کردن minify با SWC
  output: 'standalone',         // مناسب برای دیپلوی روی Vercel یا Docker

  // experimental options در Next.js 15 تغییر کرده‌اند
  experimental: {
    // appDir دیگر پشتیبانی نمی‌شود، پس حذف شد
    // اگر نیاز به serverActions یا serverComponents دارید، می‌توانید اضافه کنید
    serverActions: true,         
    serverComponents: true,      
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // برای تصاویر remote
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // جلوگیری از fail شدن build به خاطر lint
  },
};

module.exports = nextConfig;
