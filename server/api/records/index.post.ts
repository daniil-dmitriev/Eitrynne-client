export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await useBody(event);

  // return body;
  return $fetch(`${config.API_BASE_URL}/records`, {
    method: "post",
    body,
  });
});
