export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  return await $fetch(
    `${config.API_BASE_URL}/clients/${event.context.params.id}/employee`
  );
});
