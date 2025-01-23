// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: false, // Desactiva el Strict Mode de React
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'app');
    return config;
  },
}
