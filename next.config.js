/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    URL:`http://192.168.1.8:3000`,
    API:`http://192.168.1.8:3333`,
  }
}

module.exports = nextConfig
