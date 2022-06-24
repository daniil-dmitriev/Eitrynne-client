export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = useQuery(event);
  const clients = await $fetch(
    `${config.API_BASE_URL}/clients?name=${query.name}&role=${query.role}&balance=${query.balance}&count=${query.count}&offset=${query.offset}`
  );

  return clients;
});
