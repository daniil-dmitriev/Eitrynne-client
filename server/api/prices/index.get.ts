export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await $fetch(`${config.API_BASE_URL}/prices`, {
    method: "get",
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });

  return response;
});
