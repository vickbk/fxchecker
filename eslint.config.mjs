import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import { defineConfig, globalIgnores } from "eslint/config";
import { parser, plugin } from "typescript-eslint";

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
    "coverage/",
    "playwright-report/",
    "test-results/",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": plugin,
      boundaries,
    },
    settings: {
      // 2. The crucial piece: instructs ESLint resolution engines
      // to read your tsconfig.json compilerOptions.paths
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          // Point to your config if it's named differently,
          // but true defaults to checking the root tsconfig.json
        },
      },
      "boundaries/elements": [
        {
          type: "feature",
          pattern: "features/*",
          capture: ["featureName"],
        },
        {
          type: "shared",
          pattern: "shared/*",
          capture: ["moduleName"],
        },
        {
          type: "infra",
          pattern: "infra/*",
        },
        {
          type: "app",
          pattern: "app/*",
        },
        {
          type: "tests",
          pattern: "tests/*",
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "feature" } },
              disallow: { to: { element: { type: "feature" } } },
              message:
                'Cross-feature contamination: "{{from.captured.featureName}}" cannot import from "{{to.captured.featureName}}".',
            },
            {
              from: { element: { type: "shared" } },
              disallow: { to: { element: { type: "shared" } } },
              message:
                'Cross-shared contamination: "{{from.captured.moduleName}}" cannot import from "{{to.captured.moduleName}}".',
            },
            {
              from: { element: { type: "shared" } },
              disallow: [
                { to: { element: { type: "feature" } } },
                { to: { element: { type: "infra" } } },
                { to: { element: { type: "app" } } },
                { to: { element: { type: "tests" } } },
              ],
              message:
                'Layer Violation: Foundation "shared/{{from.captured.moduleName}}" cannot depend on outer scopes.',
            },
            {
              from: { element: { type: "infra" } },
              disallow: [
                { to: { element: { type: "feature" } } },
                { to: { element: { type: "app" } } },
              ],
              message:
                "Layer Violation: Infrastructure elements cannot depend on domain features or application roots.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
