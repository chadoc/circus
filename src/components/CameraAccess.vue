<template>
  <div>
    <p>is secured context: {{ isSecuredContext }}</p>
    <p>is camera supported: {{ cameraSupported }}</p>
    <p>available devices: {{ availableDevices }}</p>
    <button type="button" @click="requestPermission">Request Permission</button>
    <button type="button" @click="capture">Capture</button>

    <div class="camera">
      <video ref="video" id="video">Video stream not available.</video>
      <button id="startbutton" type="button">Take photo</button>
    </div>
    <canvas ref="canvas" id="canvas"> </canvas>
    <div class="output">
      <img ref="photo" id="photo" alt="The screen capture will appear in this box." />
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue'

const width = 320;    // We will scale the photo width to this
const height = 0;     // This will be computed based on the input stream

const streaming = false;

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()
const photo = ref<HTMLImageElement>()

const isSecuredContext = computed(() => Boolean(window.isSecureContext))
const cameraSupported = ref(isCameraSupported())

const availableDevices = ref<string[]>([])

async function loadAvailableDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
    // List cameras and microphones.
    availableDevices.value = (await navigator.mediaDevices.enumerateDevices()).map(device => `${device.kind}: ${device.label} id = ${device.deviceId}`)
  }
}

function isCameraSupported() {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
}

function requestPermission() {
  navigator.mediaDevices.getUserMedia({video: true})
}

async function capture() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    video.value!.srcObject = stream
    video.value!.play()
  } catch (error) {
    console.error('Not able to load video', error)
  }
}

loadAvailableDevices()
</script>
