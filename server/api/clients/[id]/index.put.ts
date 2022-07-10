export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const id = event.context.params.id;
  const body = await useBody(event);
  return $fetch(config.API_BASE_URL + "/clients/" + id, {
    method: "put",
    body,
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });
});
