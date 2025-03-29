<template>
  <div>
    <form @submit.prevent="register">
      <div>
        <label>Name</label>
        <input @blur="validateName" v-on:invalid="!!credentials.name.error" v-model="credentials.name.value"
          minlength="5" type="text" placeholder="Enter your name here" required />
      </div>
      <div>
        <label>Email</label>
        <input @blur="validateEmail" v-on:invalid="!!credentials.email.error" v-model="credentials.email.value"
          type="email" placeholder="Enter your email here" required />
      </div>
      <div>
        <label>Password</label>
        <input @blur="validatePassword" v-on:invalid="!!credentials.password.error" minlength="6"
          v-model="credentials.password.value" type="password" placeholder="Enter your password here" required />
      </div>
      <p>Please meet the following requirements:</p>
      <ul style="list-style-position: inside;">
        <li>Name must be at least 5 letters long</li>
        <li>Email must be valid</li>
        <li>Password must be at least 6 letters long</li>
      </ul>
      <div class="error-message">
        <p v-if="!!credentials.name.error">{{ credentials.name.error }}</p>
        <p v-if="!!credentials.password.error">{{ credentials.password.error }}</p>
        <p v-if="status === 'error'">{{ error }}</p>
      </div>
      <!-- insert captcha here-->
      <button v-bind:disabled="status === 'loading' || !isFormValid" type="submit">Submit</button>
      <br />
      <a href="/login">Already have an account?</a>
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';
import { z, ZodError } from 'zod';
const { fetch: refreshSession } = useUserSession()

const credentials = reactive({
  name: {
    value: '',
    error: "",
  },
  email: {
    value: '',
    error: "",
  },
  password: {
    value: '',
    error: ""
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

const validateEmail = () => {
  const schema = z.string().email("Invalid email");
  try {
    schema.parse(credentials.email.value);
    credentials.email.error = "";
  } catch (error: unknown) {
    credentials.email.error = (error as ZodError).issues[0].message;
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
    credentials.email.value !== "" &&
    credentials.password.value !== "" &&
    credentials.name.value !== "" &&
    credentials.email.error === "" &&
    credentials.password.error === "" &&
    credentials.name.error === ""
  );
});

async function register() {
  if (!isFormValid.value) return;
  status.value = 'loading';

  try {
    const result = await $fetch('/api/register', {
      method: 'POST',
      body: {
        email: credentials.email.value,
        password: credentials.password.value,
        name: credentials.name.value
      }
    });

    if (result?.status !== 200) {
      error.value = result?.message;
      status.value = 'error';
      return;
    }

    await refreshSession();

    status.value = 'success';
    error.value = null;

    await navigateTo('/')
  } catch (e: unknown) {
    status.value = 'error';
    error.value = (e as NuxtError).statusMessage ?? "An error occurred, please contact support.";
  } finally {
    if (status.value === 'loading') {
      status.value = 'idle';
    }
  }
}
</script>