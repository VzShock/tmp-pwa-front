// Note : To required('next-pwa') you should install that package as explain
// above. If you miss that please install it with npm i next-pwa command.

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  typescript: {
    // Ignore TypeScript errors on build
    ignoreBuildErrors: "true",
  },
  // other next.js config here
});
