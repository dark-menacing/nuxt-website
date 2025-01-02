<template>
  <div>
    <h2>Hello world!</h2>
    <p>It is currently {{ date }}</p>
  </div>
</template>

<script lang="ts" setup>
  const today = new Date();
  const date = ref();

  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();

  const ampm = hours < 12 ? "AM" : "PM"

  const now = hours + ":" + minutes + ":" + seconds + " " + ampm

  date.value = now
</script>