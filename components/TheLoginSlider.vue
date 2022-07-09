<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log("slide change");
};
</script>

<template>
  <Swiper
    :modules="[Pagination, Autoplay]"
    pagination
    :autoplay="{
      delay: 5000,
    }"
    loop
    class="h-[300px] w-full"
  >
    <SwiperSlide>
      <div class="flex items-start justify-center py-5 px-6">
        <div class="w-2/6 bg-white">
          <img
            src="~/assets/gifs/server.gif"
            alt="lock gif"
            width="200"
            height="200"
          />
        </div>
        <div class="w-full space-y-4 pl-4">
          <h2 class="text-3xl font-bold text-gray-900">
            Повышенная безопасность
          </h2>
          <p>
            Все данные, используемые веб-приложением, хранятся на удаленном
            сервере в зашифрованном виде. Нет причин беспокоиться об их
            безопасности и целостности!
          </p>
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div class="flex items-start justify-center py-5 px-6">
        <div class="w-2/6 bg-white">
          <img
            src="~/assets/gifs/rocket.gif"
            alt="lock gif"
            width="200"
            height="200"
          />
        </div>
        <div class="w-full space-y-4 pl-4">
          <h2 class="text-3xl font-bold text-gray-900">
            Высокая скорость работы
          </h2>
          <p>
            <span class="font-bold">ERIYNNE</span> написана с помощью самых
            современных средств и технологий разработки в области программного
            обеспечения, что гарантирует стабильно высокую скорость работы при
            работе с большим количеством данных.
          </p>
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div class="flex items-start justify-center py-5 px-6">
        <div class="w-2/6 bg-white">
          <img
            src="~/assets/gifs/list.gif"
            alt="lock gif"
            width="200"
            height="200"
          />
        </div>
        <div class="w-full space-y-4 pl-4">
          <h2 class="text-3xl font-bold text-gray-900">
            Большая функциональность
          </h2>
          <p>
            <span class="font-bold">EIRYNNE</span> предоставляет пользователям
            широкий набор инструментов для работы с данными. «Все так, как
            должно быть!»
          </p>
          <p>Попробуйте и убедитесь сами!</p>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>
