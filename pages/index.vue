<template>
  <div>
    <h2>Hello world!</h2>
    <p>It is currently {{ date }}</p>
    <p v-if="new Date().getHours() == 3" style="color: red;">go to sleep!!</p>
  </div>
</template>

<script lang="ts" setup>
  const date = ref("");

  const updateTime = () => {
    const today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    const ampm = hours < 12 ? "AM" : "PM";

    if (ampm === "PM") {
      hours = hours - 12;
    } else {
      if (hours === 0) {
        hours = hours + 12;
      }
    }

    // Format time with leading zeros
    date.value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;
  };

  let intervalId: ReturnType<typeof setInterval> | undefined;

  const synchronizeClock = () => {
    updateTime(); // Update time immediately
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();

    setTimeout(() => {
      updateTime(); // Align to the next second
      intervalId = setInterval(updateTime, 1000); // Update every second
    }, msUntilNextSecond);
  };

  onMounted(() => {
    synchronizeClock(); // Start clock on component mount
  });

  onUnmounted(() => {
    if (intervalId !== undefined) {
      clearInterval(intervalId); // Clear interval when component unmounts
    }
  });
</script>