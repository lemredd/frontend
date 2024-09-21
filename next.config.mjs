/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  experimental: {
    turbo: {
      rules: {
        '.svg': {
          loaders: ['@svgr/webpack'],
          as: '.js',
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
        hostname: '**',
      },
    ],
  },

  redirects: async () => [
    {
      source: "/",
      has: [
        {
          type: "query",
          key: "token",
          value: undefined
        }
      ],
      destination: "/auth/verify",
      permanent: true
    }
  ]
}

export default nextConfig
