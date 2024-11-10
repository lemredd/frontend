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
      source: '/skr/setup/',
      destination: '/skr/setup/profile',
      permanent: true,
    },
    {
      source: '/pdr/setup/',
      destination: '/pdr/setup/project',
      permanent: true,
    },
    {
      source: '/admin/settings/',
      destination: '/admin/settings/account',
      permanent: true,
    }
  ]
}

export default nextConfig
