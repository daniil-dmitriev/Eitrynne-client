<template>
  <header>
    <UI-container class="flex items-center justify-between !py-2.5 shadow-sm">
      <!-- Search -->
      <div class="relative flex basis-1/4 items-center text-gray-600">
        <UI-input
          type="text"
          placeholder="Поиск в системе..."
          icon="search"
          :loading="loading"
        />
      </div>

      <!-- User -->
      <div class="flex items-center space-x-6">
        <!-- DarkMode Button -->
        <button class="group">
          <UI-icon name="dark_mode" class="w-5" :loading="loading" />
        </button>

        <!-- Notification Button -->
        <button class="group relative">
          <!-- Badge (counter) -->
          <span
            class="absolute top-1 right-0 z-10 h-1.5 w-1.5 rounded-full bg-orange-400 font-bold group-hover:scale-110"
          ></span>
          <UI-icon name="notification" class="w-5" :loading="loading"></UI-icon>
        </button>

        <div class="flex flex-col text-right text-xs">
          <!-- UserName -->
          <span class="text-sm font-bold text-gray-700">Даня Дмитриев</span>

          <!-- User Role -->
          <span class="font-light text-gray-500">Администратор</span>
        </div>

        <!-- UserAvatar -->
        <img
          src="https://placekitten.com/500/500"
          class="h-10 w-10 cursor-pointer rounded-full"
        />
      </div>
    </UI-container>
  </header>
</template>
<script setup>
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});
</script>
