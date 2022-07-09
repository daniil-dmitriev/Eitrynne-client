<script setup>
const config = useRuntimeConfig();
// const { data: clients } = useFetch(`${config.API_BASE_URL}/clients`, {
//   method: "get",

//   headers: {
//     Authorization: "Bearer " + useCookie("token").value,
//   },
// });

// TODO: GET CLIENTS FROM API WITH AUTH
const response = $fetch(`api/clients`, {
  method: "get",
});

console.log(response);
</script>

<template>
  <UI-container> This is main page </UI-container>
</template>
