/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // pdfjs
  experimental: {
    appDir: true,
  },
  future: { webpack5: true },

    // (Optional) Export as a static site
    // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
    // output: 'export', // Feel free to modify/remove this option

    // Override the default webpack configuration
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // See https://webpack.js.org/configuration/resolve/#resolvealias
      config.resolve.alias = {
          ...config.resolve.alias,
          "sharp$": false,
          "onnxruntime-node$": false,
      }

      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config;
  },
}

module.exports = nextConfig
