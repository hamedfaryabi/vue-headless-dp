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
      external: ["vue", "date-fns", "defu"],
      output: {
        globals: {
          vue: "Vue",
          "date-fns": "date-fns",
          defu: "defu",
        },
      },
    },
  },
});

