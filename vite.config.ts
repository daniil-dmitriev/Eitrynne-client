import { defineConfig } from "vitest/config";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  test: {
    include: ["./stores/*.test.ts"],
  },

  plugins: [svgLoader({})],
});
