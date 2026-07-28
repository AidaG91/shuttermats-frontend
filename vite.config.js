import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/shuttermats-frontend/",
  // Workaround: con Vite 8 (rolldown-vite) + Vitest, el runtime automático de
  // JSX no siempre se aplica en el pipeline de tests y los .jsx compilan a
  // React.createElement sin que React quede en scope ("React is not defined").
  // Ver https://github.com/vitejs/rolldown-vite/issues/574
  esbuild: {
    jsxInject: `import React from "react"`,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: true,
  },
});
