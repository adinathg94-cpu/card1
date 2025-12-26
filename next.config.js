import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./src/config/config.json");
const WebpackObfuscator = require("webpack-obfuscator");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: "standalone",

  webpack: (config, { isServer, dev }) => {
    // Only apply obfuscation in production builds
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator(
          {
            // Medium obfuscation settings for balanced protection and performance
            compact: true,
            simplify: true,

            // String obfuscation
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            rotateStringArray: true,
            shuffleStringArray: true,

            // Identifier obfuscation
            identifierNamesGenerator: 'hexadecimal',
            identifiersPrefix: `kindora_${Math.random().toString(36).substring(7)}_`,
            renameGlobals: true,

            // Disabled aggressive options for better performance
            controlFlowFlattening: false,
            deadCodeInjection: false,
            selfDefending: false,
            transformObjectKeys: false,
            unicodeEscapeSequence: false,

            // Code optimization
            splitStrings: true,
            splitStringsChunkLength: 10,

            // Source map handling
            sourceMap: false,
            sourceMapMode: 'separate',
          },
          [
            // Exclude patterns
            'node_modules/**/*',
            '**/*.json',
            '**/config*',
            '**/gray-matter*',
            '**/remark*',
            '**/mdx*',
            '**/marked*',
            'vendors*.js',
            'framework*.js',
            'webpack*.js',
          ]
        )
      );
    }

    return config;
  },
};

export default nextConfig;
