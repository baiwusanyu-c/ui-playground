<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
import { AButton } from 'ant-design-vue/button'
const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  Vue {{ vueVersion }}
  <a-button type="primary">
    Primary Button
  </a-button>
</template>
