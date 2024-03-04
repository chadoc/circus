<template>
  <div>
<!--    <p>is secured context: {{ isSecuredContext }}</p>-->
<!--    <p>is camera supported: {{ cameraSupported }}</p>-->
<!--    <p>available devices: {{ availableDevices }}</p>-->
<!--    <button type="button" @click="getVideoWidth">VideoWidth</button>-->
    <button type="button" @click="capture">Start Camera</button>
    <canvas v-show="showCanvas" ref="canvas" id="canvas" style="border: 1px solid black"> </canvas>
    <div v-show="showPhoto" id="myPic">
      <button type="button" @click="happy">Happy with your Pic ?</button>
      <button type="button" @click="clear">Restart</button>
      <img ref="photo" id="photo" alt="The screen capture will appear in this box." />
    </div>
    <button id="startbutton" type="button" @click.prevent="takePicture">Take photo</button>
    <div v-show="showVideo" id="camera" class="camera">
      <video ref="video" id="video">Video stream not available.</video>
      <canvas ref="maskCanvas" id="maskCanvas"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, unref} from 'vue'

const width = 1280;    // We will scale the photo width to this
const height = 0;     // This will be computed based on the input stream

const picWidth = 300

const streaming = false;

const showVideo = ref(true)
const showPhoto = ref(false)
const showCanvas = ref(false)
const imgData = ref<any>()

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()
const maskCanvas = ref<HTMLCanvasElement>()
const photo = ref<HTMLImageElement>()

const emit = defineEmits<{
  (event: 'pictureTaken', data: { img: any })
}>()

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

function happy() {
  const p = unref(photo)!
  emit('pictureTaken', { img: p.src })
}

function clear() {
  const c = unref(canvas)!
  const p = unref(photo)!
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#AAA'
  ctx.fillRect(0, 0, c.width, c.height)
  const data = c.toDataURL('image/png')
  p.src = data
}

function isCameraSupported() {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
}

onMounted(() => {
  const v = unref(video)!
  const c = unref(canvas)!
  const m = unref(maskCanvas)!
  v.addEventListener('canplay', (event) => {
    const height = (v.videoHeight / v.videoWidth) * width
    v.width = width
    v.height = height
    c.width = width
    c.height = height
    m.width = width
    m.height = height

    const centerX = width / 2
    const centerY = height / 2
    const ctx = m.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(centerX, centerY, picWidth / 2, 2 * Math.PI, 0)
    ctx.fill()
    ctx.stroke()
  },
  false)
})

function takePicture() {
  const c = unref(canvas)!
  const v = unref(video)!
  const p = unref(photo)!
  // c.width = v.width
  // c.height = v.height
  const centerX = v.videoWidth / 2
  const centerY = v.videoHeight / 2
  const picWidth = 300
  const picHeight = 300
  c.getContext('2d')!.drawImage(v, centerX - (picWidth / 2), centerY - (picHeight / 2), picWidth, picHeight, 0, 0, c.width, c.height)
  const data = c.toDataURL('image/webp')
  imgData.value = data
  p.src = data
  showPhoto.value = true
  showVideo.value = false
  v.pause()
  // emit('pictureTaken', { img: data })
}

function getVideoWidth() {
  console.log('video stream', video.value!.width, video.value!.height)
}

async function capture() {
  try {
    showPhoto.value = false
    showVideo.value = true
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          min: 1280
        },
        height: {
          min: 720
        },
        facingMode: 'user'
      },
      audio: false
    })
    video.value!.srcObject = stream
    video.value!.play()
    console.log('video stream', video.value!.width, video.value!.height)
  } catch (error) {
    console.error('Not able to load video', error)
  }
}

loadAvailableDevices()
</script>
<style scoped>
#camera {
  position: relative;
}
#video {
  position: absolute;
  top: 0;
  left: 0;
}
#maskCanvas {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
  //background: red;
}
#photo {
  width: 300px;
  height: 300px;
}
</style>
