import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Config files outside the main app module graph.
    "next.config.mjs",
    "postcss.config.mjs",
    // Auto-generated PWA service worker bundles (Serwist).
    "public/sw.js",
    "public/sw.js.map",
  ]),
]);

export default eslintConfig;
