<template>
  <div>
    <form @submit.prevent="login">
      <div>
        <label>Name</label>
        <input @blur="validateName" minlength="5" v-model="credentials.name.value"
          v-on:invalid="!!credentials.name.error" type="text" placeholder="Enter your name" />
      </div>
      <div>
        <label>Password</label>
        <input @blur="validatePassword" minlength="6" v-model="credentials.password.value"
          v-on:invalid="!!credentials.password.error" type="password" placeholder="Enter your password" />
      </div>
      <div class="error-message">
        <p v-if="!!credentials.name.error">{{ credentials.name.error }}</p>
        <p v-if="!!credentials.password.error">{{ credentials.password.error }}</p>
        <p v-if="status === 'error'">{{ error }}</p>
      </div>
      <button v-bind:disabled="status === 'loading' || !isFormValid" type="submit">Submit</button>
    </form>
    <br />
    <a href="/register">Don't have an account?</a>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';
import { z, ZodError } from 'zod';
const {fetch: refreshSession, loggedIn} = useUserSession();

if (loggedIn.value) {
  await navigateTo('/');
}

const credentials = reactive({
  name: {
    value: '',
    error: ""
  },
  password: {
    value: '',
    error: "",
  },
});

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const error = ref<string | null>(null);

const validateName = () => {
  const schema = z.string()
    .min(5, "Name must be at least 5 characters");
  try {
    schema.parse(credentials.name.value);
    credentials.name.error = "";
  } catch (error: unknown) {
    credentials.name.error = (error as ZodError).issues[0].message;
  }
}

const validatePassword = () => {
  const schema = z.string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters");
  try {
    schema.parse(credentials.password.value);
    credentials.password.error = "";
  } catch (error: unknown) {
    credentials.password.error = (error as ZodError).issues[0].message;
  }
};

const isFormValid = computed(() => {
  return (
    credentials.name.value !== "" &&
    credentials.password.value !== "" &&
    credentials.name.error === "" &&
    credentials.password.error === ""
  );
})

async function login() {
  if (!isFormValid.value) return;
  status.value = 'loading';

  try {
    const result = await $fetch('/api/login', {
      method: 'POST',
      body: {
        password: credentials.password.value,
        name: credentials.name.value
      }
    })

    if (result?.status !== 200) {
      error.value = result?.message;
      status.value = 'error';
      return;
    }

    status.value = 'success';
    error.value = null;
  } catch (e: unknown) {
    status.value = 'error';
    error.value = (e as NuxtError).statusMessage ?? "An error occurred.";
  } finally {
    if (status.value === 'loading') {
      status.value = 'idle';
    }
  }
}
</script>