export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  return await $fetch(`${config.API_BASE_URL}/records?count=1`, {
    headers: {
      authorization: `${useCookies(event).token}`,
    },
  });
});
