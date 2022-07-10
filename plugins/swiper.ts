import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Swiper);
});
