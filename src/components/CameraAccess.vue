<template>
  <div>
    <p>is secured context: {{ isSecuredContext }}</p>
    <p>is camera supported: {{ cameraSupported }}</p>
    <button type="button" @click="requestPermission">Request Permission</button>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue'

const isSecuredContext = computed(() => Boolean(window.isSecureContext))
const cameraSupported = ref(isCameraSupported())

function isCameraSupported() {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
}

function requestPermission() {
  navigator.mediaDevices.getUserMedia({video: true})

}
</script>
