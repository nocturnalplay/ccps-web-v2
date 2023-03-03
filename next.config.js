/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    URL:`http://192.168.1.20:3001`,
    API:`http://192.168.1.20:3334`,
  }
}

module.exports = nextConfig
