export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  return await $fetch(config.API_BASE_URL + "/categories/", {
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });
});
