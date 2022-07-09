<script setup>
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="w-full bg-white">
    <div class="relative mx-auto flex max-w-screen-2xl">
      <div
        class="hidden min-h-screen w-1/2 flex-col items-center justify-center p-5 lg:flex"
      >
        <div class="top-2 left-2">
          <!-- ?? position: center -->
          <UILogo />
        </div>
        <div class="my-auto flex w-full items-center justify-center">
          <TheLoginSlider />
        </div>
      </div>
      <div
        class="flex min-h-screen w-full flex-col justify-center p-5 lg:w-1/2"
      >
        <div class="my-6 w-full border-b py-8">
          <h1 class="text-left text-5xl font-bold md:text-6xl lg:text-5xl">
            Салют! <br class="" />
            Рады видеть тебя снова!
          </h1>
          <p class="mt-2 pl-1 text-gray-700">
            Для доступа к системе тебе необходимо авторизоваться.
          </p>
        </div>
        <form>
          <div
            class="relative flex flex-wrap items-center space-y-5 space-x-0 md:flex-nowrap md:space-y-0 md:space-x-5"
          >
            <div class="flex w-full flex-col md:w-1/2">
              <label class="pb-1 pl-1 font-bold text-gray-700"> Email </label>
              <UIInput
                type="email"
                class="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-0"
                placeholder="Введите ваш email"
                icon="email"
              />
            </div>
            <div class="flex w-full flex-col md:w-1/2">
              <label
                htmlFor="passwordAuth"
                class="pb-1 pl-1 font-bold text-gray-700"
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
              />
            </div>
          </div>
          <button
            class="my-10 w-full rounded-lg border-0 bg-black py-2 font-bold text-white focus:border-gray-300 focus:bg-gray-800 focus:outline-none"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
