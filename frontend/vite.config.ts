import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const fastDeepEqualPath = fileURLToPath(
  new URL("./src/lib/fast-deep-equal-esm.ts", import.meta.url)
);

const config = defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: srcPath },
      { find: "#", replacement: srcPath },
      { find: /^fast-deep-equal$/, replacement: fastDeepEqualPath },
      { find: /^fast-deep-equal\/es6\/react\.js$/, replacement: fastDeepEqualPath }
    ],
  },
  plugins: [
    devtools(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    tailwindcss(),
    viteReact(),
  ],
  base: "/",
});

export default config;
