<template>
  <div>
    <h2>Hello world!</h2>
    <p>It is currently {{ date }}</p>
    <p v-if="new Date().getHours() == 3">go to sleep!!</p>
  </div>
</template>

<script lang="ts" setup>
  const today = new Date();
  const date = ref();

  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();

  const ampm = hours < 12 ? "AM" : "PM"

  if (ampm == "PM") {
    hours = hours - 12;
  } else {
    // i hate if statements in if statements
    if (hours == 0) {
      hours = hours + 12;
    }
  };

  const now = hours + ":" + minutes + ":" + seconds + " " + ampm;

  date.value = now;
</script>