<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
const msg = ref('Hello Playground!')
</script>

<template>
  <div class="container">
    <h1>{{ msg }}</h1>
    <p>Vue {{ vueVersion }}</p>
  </div>
</template>

<style>
.container {
  padding: 20px;
}
</style>
