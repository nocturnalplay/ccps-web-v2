/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    URL:`http://192.168.1.4:3000`,
    API:`http://192.168.1.4:3333`,
  }
}

module.exports = nextConfig
