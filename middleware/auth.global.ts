export default defineNuxtRouteMiddleware(async (to, from) => {
  const response = await $fetch("/api/auth/check");
  console.log("to >>", to);
  // if (true && to.fullPath !== "/") {
  //   return navigateTo("/");
  // }
});
