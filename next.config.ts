import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const repoName = process.env.REPO_NAME || 'pollenAMprice'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
}

export default nextConfig
