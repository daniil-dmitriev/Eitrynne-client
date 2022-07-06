export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = event.context.params.id;

  return await $fetch(`${config.API_BASE_URL}/clients/${id}/lastActivity`);
});
