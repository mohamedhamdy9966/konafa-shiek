import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "@rollup/plugin-commonjs"; // Add this

export default defineConfig({
  plugins: [
    react(),
    commonjs(), // Add this to handle CommonJS modules
  ],
  server: {
    port: 5173,
  },
});