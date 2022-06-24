export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return await $fetch(config.API_BASE_URL + "/categories/");
});
