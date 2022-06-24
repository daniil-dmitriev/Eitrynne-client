import { defineNuxtConfig } from "nuxt";
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  buildModules: ["@pinia/nuxt"],
  plugins: ["@/plugins/maska.ts", "@/plugins/vue-toastification.ts"],
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["@/assets/styles/main.css"],
  meta: {
    link: [
      {
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
        rel: "stylesheet",
      },
    ],
  },
});
