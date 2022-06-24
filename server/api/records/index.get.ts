export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = useQuery(event);

  return $fetch(`${config.API_BASE_URL}/records?`);
});
