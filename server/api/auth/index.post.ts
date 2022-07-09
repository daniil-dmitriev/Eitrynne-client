export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await useBody(event);

  return await $fetch(`${config.API_BASE_URL}/auth/login`, {
    method: "POST",
    body,
  });
});
