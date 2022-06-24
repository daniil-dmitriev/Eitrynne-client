export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await useBody(event);

  return await $fetch(`${config.API_BASE_URL}/payments`, {
    method: "post",
    body,
  });
});
