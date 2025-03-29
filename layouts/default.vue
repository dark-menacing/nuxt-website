<script lang="ts" setup>
  import '~/assets/css/index.css';
  const {user} = useUserSession();
</script>

<template>
  <div>
    <!--header is navigation bar-->
    <header>
      <a href="/">
        <!--jesus christ how the living heck is making the margin negative
        fixes it-->
        <Icon name="ri:sun-fill" style="color: white;margin: -10px ;font-size: 2.3em;"/>
      </a>
      <AuthState v-slot="{loggedIn, clear}">
        <div v-if="loggedIn">
          <button @click="clear">Logout</button>
          <a>Welcome back, user</a>
        </div>
        <div v-else>
          <NuxtLink to="/login">Login</NuxtLink>
          <NuxtLink to="/register">Register</NuxtLink>
        </div>
      </AuthState>
    </header>
    <slot />
    <br />
    <footer>
      <a href="https://github.com/dark-menacing/nuxt-website">
        <Icon name="ri:github-fill" style="color: black; font-size: 3em;"/>
      </a>
    </footer>
  </div>
</template>