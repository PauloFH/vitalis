import { defineConfig } from "vite";

// base relativa para funcionar tanto em site de usuario quanto em site de projeto
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
});
