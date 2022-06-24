export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const response = await $fetch(`${config.API_BASE_URL}/prices`, {
    method: "get",
  });

  return response;
});
