<template>
  <div>
    <h2>Login page</h2>
    <form @submit.prevent="handleSubmitLogin">
      <div>
        <label>Email:</label>
        <input 
        @blur="validateEmail"
        v-model="data.email.value"
        v-on:invalid="!!data.email.error"
        type="email" name="email" placeholder="Enter email" />
      </div>
      <div>
        <label>Password:</label>
        <input 
        @blur="validatePassword"
        v-model="data.password.value"
        v-on:invalid="!!data.password.error"
        type="password" name="password" placeholder="Enter password"/>
      </div>
      <div>
        <p v-if="!!data.email.error">{{data.email.error}}</p>
        <p v-if="!!data.password.error">{{data.password.error}}</p>
        <p v-if="status === 'error'">
          {{error}}
        </p>
      </div>
      <button type="submit"
      :loading="status === 'loading'"
      :disabled="status === 'loading' || !isFormValid">Login</Button>
  </form>
  </div>
</template>

<script lang="ts" setup>
import { z, ZodError } from "zod";
import { computed } from "vue";

const status = ref<"idle" | "loading" | "success" | "error">("idle");
const error = ref<string | null>(null);

const data = reactive({
  email: {
    value: "",
    error: "",
  },
  password: {
    value: "",
    error: "",
  },
});

const validateEmail = () => {
  const schema = z.string().email("Invalid email address");
  try {
    schema.parse(data.email.value);
    data.email.error = "";
  } catch (e: unknown) {
    data.email.error = (e as ZodError).issues[0].message;
  }
};

const validatePassword = () => {
  const schema = z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters");
  try {
    schema.parse(data.password.value);
    data.password.error = "";
  } catch (e: unknown) {
    data.password.error = (e as ZodError).issues[0].message;
  }
};

const login = async () => {
  status.value = 'loading';
  try {
   const result = await $fetch("/api/login", {
    method: "POST",
    body: {
     email: data.email.value,
     password: data.password.value
    }
   });
   
   if (result.status !== 200) {
    error.value = result.message;
    status.value = 'error';
    return;
   }
   
   status.value = 'success';
   error.value = null;
  } catch (e) {
   error.value = (e as Error).message || 'An error occurred while logging in';
   status.value = 'error';
  }
};

const isFormValid = computed(() => {
  return (
    data.email.value !== "" &&
    data.password.value !== "" &&
    data.email.error === "" &&
    data.password.error === ""
  );
});

async function handleSubmitLogin() {
  await login()
  if (status.value === 'success') {
    navigateTo('/dashboard', { replace: true })
  }
}

</script>
