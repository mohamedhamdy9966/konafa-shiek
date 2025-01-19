import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
  ],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      external: ['react-toastify'], // Add react-toastify here
    },
  },
});