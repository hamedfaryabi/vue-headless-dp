import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "use-headless-date-picker",
    },
    rollupOptions: {
      external: ["vue", "defu", "@date-io/core"],
      output: {
        globals: {
          vue: "Vue",
          "@date-io/core": "@date-io/core",
          defu: "defu",
        },
      },
    },
  },
});

