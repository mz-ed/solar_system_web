<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createScene } from './ThreeSetup'   // Import the Three.js scene setup
import '../assets/ThreeScene.css'            // Import the CSS file

const container = ref(null)

onMounted(() => {
  const { scene, camera, renderer, cube } = createScene(container.value)

  // Optional: You can add extra logic here if needed
})
</script>

<style scoped>
/* Scoped CSS is optional if you want to keep specific styles here */
</style>
