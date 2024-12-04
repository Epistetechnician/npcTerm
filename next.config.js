/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DUNE_API_KEY: process.env.NEXT_PUBLIC_DUNE_API_KEY,
    NEXT_PUBLIC_FLIPSIDE_API_KEY: process.env.NEXT_PUBLIC_FLIPSIDE_API_KEY,
  },
  serverRuntimeConfig: {
    DUNE_API_KEY: process.env.NEXT_PUBLIC_DUNE_API_KEY,
    FLIPSIDE_API_KEY: process.env.NEXT_PUBLIC_FLIPSIDE_API_KEY,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_DUNE_API_KEY: process.env.NEXT_PUBLIC_DUNE_API_KEY,
    NEXT_PUBLIC_FLIPSIDE_API_KEY: process.env.NEXT_PUBLIC_FLIPSIDE_API_KEY,
  }
}

module.exports = nextConfig 