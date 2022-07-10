export default defineEventHandler(async (event) => {
  const { token } = await useBody(event);

  setCookie(event, "token", token);
  return true;
});
