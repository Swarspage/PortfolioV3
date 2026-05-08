import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
  },
  plugins: [react(), tailwindcss()],
  build: {
    // Pin vendor chunks to stable names so the user's browser cache survives
    // your code changes without re-downloading React, GSAP, or Lenis.
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-gsap":  ["gsap", "@gsap/react"],
          "vendor-lenis": ["lenis"],
        },
      },
    },
  },
});
