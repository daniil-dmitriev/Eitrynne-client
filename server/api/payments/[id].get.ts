import { NuxtRuntimeConfig } from "@nuxt/types/config/runtime";

export default defineEventHandler(async (event) => {
  const config: NuxtRuntimeConfig = useRuntimeConfig();
  const id: string = event.context.params.id;

  return await $fetch(`${config.API_BASE_URL}/payments/${id}`, {
    headers: {
      authorization: `Bearer ${useCookies(event.req).token}`,
    },
  });
});
