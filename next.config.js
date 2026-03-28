import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./src/config/config.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: "standalone",

  images: {
    // Allow images served from your Hostinger domain
    domains: ["darkviolet-seal-509592.hostingersite.com"],
  },

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
