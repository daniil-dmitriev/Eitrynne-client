export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const response = $fetch(
    `${config.API_BASE_URL}/clients/${event.context.params.id}`,
    {
      method: "delete",
    }
  );

  return response;
});
