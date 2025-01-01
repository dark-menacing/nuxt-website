<template>
  <div>
    <header>
      <NuxtLink to="/">
        Home
      </NuxtLink>
    </header>
    <br />
    <slot />
    <br />
    <footer>
      <NuxtLink to="https://github.com/dark-menacing/nuxt-website">
        <NuxtImg src="/svg/github.svg" width="40px" height='40px' alt="Source code"/>
      </NuxtLink>
    </footer>
  </div>
</template>

<script lang="ts" setup>
  import '/assets/scss/index.scss';
</script>
