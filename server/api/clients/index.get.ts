export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = useQuery(event);

  // const clients = await $fetch(
  //   `${config.API_BASE_URL}/clients?name=${query.name}&role=${query.role}&balance=${query.balance}&count=${query.count}&offset=${query.offset}`,
  //   {
  //     headers: {
  //       Authorization: "Bearer " + useCookie("token").value,
  //     },
  //   }
  // );
  const clients = $fetch(`${config.API_BASE_URL}/clients`, {});
  return query;
});
