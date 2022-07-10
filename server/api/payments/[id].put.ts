import { NuxtRuntimeConfig } from "@nuxt/types/config/runtime";

export default defineEventHandler(async (event) => {
  const config: NuxtRuntimeConfig = useRuntimeConfig();
  const id: string = event.context.params.id;
  const body = await useBody(event);

  return await $fetch(`${config.API_BASE_URL}/payments/${id}`, {
    method: "put",
    body,
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });
});
