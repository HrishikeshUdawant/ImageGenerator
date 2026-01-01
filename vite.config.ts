import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
  host: "0.0.0.0",
  port: 3000,

  // 🔥 Disable host check completely
  allowedHosts: ["*"],

  // 🔥 Ensure HMR + requests allow Render domain
  hmr: {
    host: "image-generator-qxz7.onrender.com",
    protocol: "https",
  },

  // Optional but helps avoid more errors
  strictPort: true
    },
  };
});
