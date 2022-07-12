<script setup>
import { useToast } from "vue-toastification";
import {useHead} from "nuxt/app";

useHead({
  title: "Eitrynne. Авторизация пользователя",
});

definePageMeta({
  layout: "auth",
});

const toast = useToast();
const router = useRouter();

const form = ref({
  email: "daniildmitriev8@yandex.ru",
  password: "admin123",
});

async function login() {
  const response = $fetch("/api/auth", {
    method: "POST",
    body: form.value,
  });

  response.then(async (r) => {
    if (r.access_token) {
      await $fetch("/api/auth", {
        method: "PUT",
        body: {
          token: r.access_token,
        },
      });
      router.push("/");
    }
  });

  response.catch((e) => {
    toast.error(
      "Пользователь не найден. Проверьте правильность введенных данных."
    );
  });
}
</script>

<template>
  <div class="w-full bg-white">
    <div class="relative mx-auto flex max-w-screen-2xl">
      <div class="absolute top-4 flex w-full justify-center">
        <UILogo />
      </div>

      <div
        class="hidden min-h-screen w-1/2 flex-col items-center justify-center p-5 lg:flex"
      >
        <div class="my-auto flex w-full items-center justify-center">
          <TheLoginSlider />
        </div>
      </div>
      <div
        class="flex min-h-screen w-full flex-col justify-center space-y-5 p-5 lg:w-1/2"
      >
        <div class="w-full">
          <h1
            class="text-left text-5xl font-bold text-gray-900 md:text-6xl lg:text-5xl"
          >
            Салют! <br class="" />
            Рады видеть тебя снова!
          </h1>
          <p class="mt-2 pl-1 text-gray-600">
            Для доступа к системе тебе необходимо авторизоваться.
          </p>
        </div>
        <div class="h-[0.5px] w-full bg-gray-200"></div>
        <form>
          <div
            class="relative flex flex-wrap items-center space-y-5 space-x-0 md:flex-nowrap md:space-y-0 md:space-x-5"
          >
            <div class="flex w-full flex-col md:w-1/2">
              <label class="pb-1 pl-1 font-bold text-gray-600"> Email </label>
              <UIInput
                type="email"
                class="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-0"
                placeholder="Введите ваш email"
                icon="email"
                v-model="form.email"
              />
            </div>
            <div class="flex w-full flex-col md:w-1/2">
              <label
                htmlFor="passwordAuth"
                class="pb-1 pl-1 font-bold text-gray-600"
              >
                Пароль
              </label>
              <UIInput
                type="password"
                icon="password"
                id="passwordAuth"
                autoComplete="passwordForAProgram"
                class="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-0"
                placeholder="Введите ваш пароль"
                v-model="form.password"
              />
            </div>
          </div>
          <button
            class="my-10 w-full rounded-lg border-0 bg-indigo-600 py-2 font-bold text-white transition-colors ease-in hover:bg-indigo-700 focus:outline-none"
            @click.prevent="login"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
