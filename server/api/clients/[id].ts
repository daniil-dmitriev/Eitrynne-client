export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const id = event.context.params.id;

  return $fetch(config.API_BASE_URL + "/clients/" + id);
});
