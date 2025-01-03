<script lang="ts" setup>
  import '/assets/scss/index.scss';
</script>

<template>
  <div>
    <header>
      <NuxtLink to="/">Home</NuxtLink>
      <AuthState v-slot="{loggedIn}">
        <NuxtLink v-if="loggedIn" to="/settings">Settings</NuxtLink>
        <div v-else>
          <NuxtLink id="login" to="/login">Login</NuxtLink>
          <NuxtLink style="float: right;" to="/register">Register</NuxtLink>
        </div>
      </AuthState>
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
