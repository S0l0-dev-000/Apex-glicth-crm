const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    uploadUrl: 'http://localhost:3001'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://backend-dfx6bhk1p-solos-projects-3bdcd80e.vercel.app',
    uploadUrl: process.env.REACT_APP_UPLOAD_URL || 'https://backend-dfx6bhk1p-solos-projects-3bdcd80e.vercel.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl;
export const UPLOAD_BASE_URL = config[environment].uploadUrl; 