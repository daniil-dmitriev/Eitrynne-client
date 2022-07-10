export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const body = await useBody(event);
  const config = useRuntimeConfig();
  const response = await $fetch(`${config.API_BASE_URL}/categories/${id}`, {
    method: "put",
    body,
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });
  return response;
});
