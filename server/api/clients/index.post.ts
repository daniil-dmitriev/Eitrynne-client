export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const config = useRuntimeConfig();
  const response = $fetch(`${config.API_BASE_URL}/clients`, {
    method: "post",
    body,
  });
  return response;
});
