<template>
  <div>
    <header>
      <a href="/">
        <Icon name="ri:sun-fill" style="color:black; font-size: 6em;"/>
      </a>
    </header>
    <slot />
    <footer>
      <a href="github.com/dark-menacing/nuxt-website">
        <Icon name="ri:github-fill" style="color: black; font-size: 3em;"/>
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
  import '~/assets/css/index.css';
</script>