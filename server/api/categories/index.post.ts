export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const config = useRuntimeConfig();
  const { id, ...data } = body;
  return $fetch(`${config.API_BASE_URL}/categories/`, {
    method: "post",
    body: data,
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });
});
