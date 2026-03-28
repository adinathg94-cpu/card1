import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./src/config/config.json");


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: "standalone",

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
