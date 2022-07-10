export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = useQuery(event);
  return await $fetch(
    `${config.API_BASE_URL}/records?clientId=${query.clientId}&count=25`,
    {
      headers: {
        authorization: `Bearer ${useCookies(event.req).token}`,
      },
    }
  );
});
