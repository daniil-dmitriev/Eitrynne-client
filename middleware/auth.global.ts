export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!useCookie("token").value && to.path !== "/login") {
    return navigateTo("/login");
  }
  const response = $fetch("/api/records");
  response.catch(async () => {
    await $fetch("/api/auth", {method: "DELETE"});
    return navigateTo("/login");
  });
});
