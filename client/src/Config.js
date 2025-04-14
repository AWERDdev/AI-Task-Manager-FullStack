// Environment configuration for the application
const config = {
  // API URLs
  nodeApiUrl: import.meta.env?.VITE_NODE_API_URL || 'http://localhost:3500',
  pythonApiUrl: import.meta.env?.VITE_PYTHON_API_URL || 'http://127.0.0.1:8000',
  
  // Other configuration parameters
  apiTimeout: import.meta.env?.VITE_API_TIMEOUT || 30000,
  enableDebugMode: import.meta.env?.VITE_DEBUG_MODE === 'true' || false,
  
  // Environment detection
  isProduction: import.meta.env?.MODE === 'production',
  isDevelopment: import.meta.env?.MODE === 'development' || true,
};

export default config;
