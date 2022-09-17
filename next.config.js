if (!process.env.WORDPRESS_BASE_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_BASE_URL.
  `)
}

module.exports = {
  compiler: {
    emotion: true,
  },
  images: {
    domains: [
      process.env.WORDPRESS_BASE_URL.match(/(http(?:s)?:\/\/)(.*)/)[2], // Valid WP Image domain.
      '2.gravatar.com',
      'secure.gravatar.com',
    ],
    deviceSizes: [3840],
  },
  eslint: {
    dirs: ['components', 'hooks', 'lib', 'pages', 'schema', 'styles', 'utils'],
  },
}
