// config/index.js
// config/index.js
const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "https://task-manager-backend-vqen.onrender.com/api",
  apiVersion: process.env.REACT_APP_API_VERSION || "v1",
  timeout: process.env.REACT_APP_API_TIMEOUT ? parseInt(process.env.REACT_APP_API_TIMEOUT, 10) : 30000,
};

export default config;