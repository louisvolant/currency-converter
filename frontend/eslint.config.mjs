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
    // CommonJS config files with no "type": "module" in package.json.
    "next.config.js",
    "postcss.config.mjs",
    // Auto-generated PWA service worker bundles (next-pwa & workbox).
    "public/sw.js",
    "public/workbox-*.js",
  ]),
]);

export default eslintConfig;
