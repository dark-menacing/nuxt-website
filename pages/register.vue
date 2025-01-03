<template>
  <div>
    <h2>Register page</h2>
    <form @submit.prevent="handleSubmitRegister">
      <div>
        <label>Name</label>
        <input @blur="validateName()" 
        v-model="data.Name.value" 
        v-on:invalid="!!data.Name.error" type="text" placeholder="Enter name" />
      </div>
      <div>
        <label>Email</label>
        <input @blur="validateEmail()" 
        v-model="data.email.value" 
        v-on:invalid="!!data.email.error" type="text" placeholder="Enter email" />
      </div>
      <div>
        <label>Password</label>
        <input @blur="validatePassword()" 
        v-model="data.password.value" 
        v-on:invalid="!!data.password.error"
        type="password" placeholder="Enter password" />
      </div>
      <div>
        <label>Confirm password</label>
        <input @blur="validatePasswordConfirm()"
        v-model="data.passwordConfirm.value"
        v-on:invalid="!!data.password.error" 
        type="password" name="confirm_password" placeholder="Confirm password" />
      </div>
      <div>
        <p>{{ data.Name.error }}</p>
        <p>{{ data.password.error }}</p>
        <p>{{ data.email.error }}</p>
        <p>{{ data.passwordConfirm.error }}</p>
      </div>
      <button type="submit" :disabled="!isFormValid">Sign up</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';
import { reactive, computed } from 'vue';
import { z, ZodError } from 'zod';


const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const error = ref<string | null>(null);

const data = reactive({
  Name: { value: '', error: '' },
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  passwordConfirm: { value: '', error: '' }
});

const validateName = () => {
  const schema = z.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long");
  try {
    schema.parse(data.Name.value);
    data.Name.error = "";
  } catch (e: unknown) {
    data.Name.error = (e as ZodError).issues[0].message;
  }
};

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
  const schema = z.string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters");
  try {
    schema.parse(data.password.value);
    data.password.error = "";
  } catch (e: unknown) {
    data.password.error = (e as ZodError).issues[0].message;
  }
};

const validatePasswordConfirm = () => {
  if (data.password.value !== data.passwordConfirm.value) {
    data.passwordConfirm.error = "Passwords do not match";
  } else {
    data.passwordConfirm.error = "";
  }
};

const isFormValid = computed(() => {
  return (
    data.Name.value !== "" &&
    data.email.value !== "" &&
    data.password.value !== "" &&
    data.passwordConfirm.value !== "" &&
    data.Name.error === "" &&
    data.email.error === "" &&
    data.password.error === "" &&
    data.passwordConfirm.error === ""
  );
});

const handleSubmitRegister = async () => {
  if (!isFormValid.value) return;
  status.value = 'loading';

  const { Name, email, password } = data;

  try {
    await $fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: Name.value,
        email: email.value,
        password: password.value,
      }),
    });
    navigateTo('/')
  } catch (e: unknown) {
    status.value = 'error';
    error.value = (e as NuxtError).statusMessage ?? "An error occurred";
  } finally {
    if (status.value === 'loading') {
      status.value = 'idle';
    }
  }
}
</script>