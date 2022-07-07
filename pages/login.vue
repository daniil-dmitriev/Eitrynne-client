<script setup>
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="items=center flex w-full justify-end bg-red-50">
    <div></div>
    <div class="flex h-screen basis-1/2 items-center justify-center">
      <UIContainer class="">
        <UIContainerHeader
          title="Для продолжения работы необходимо пройти авторизацию в системе"
          description="Заполните необходимые поля. В случае возникновения трудностей обратитесь к администратору."
        ></UIContainerHeader>
      </UIContainer>
    </div>
  </div>
</template>
