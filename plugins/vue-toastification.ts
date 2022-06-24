import Toast, { PluginOptions, POSITION } from "vue-toastification";
import "@/assets/styles/vue-toastification.scss";

const options: PluginOptions = {
  timeout: 5000,
  position: POSITION.BOTTOM_RIGHT,
  draggable: true,
  transition: "Vue-Toastification__fade",
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options);
});
