<template>
  <div id="cameraAccess">
    <div v-if="isCameraSupported">
      <input v-if="false" type="file" name="image" accept="image/*" capture="user">
      <div v-show="!streaming" style="text-align: center">
        <p style="padding: 10px; max-width: 400px">Veuillez demarrer votre camera et prendre une photo de vous avec votre visage remplissant le rond blanc</p>
        <button type="button" @click="startCamera">Demarrer la camera</button>
      </div>
      <div v-show="streaming">
        <div v-show="isTakingPicture">
          <div id="camera" class="camera">
            <video ref="video" id="video">Video stream not available.</video>
            <canvas ref="maskCanvas" id="maskCanvas"></canvas>
            <canvas v-show="false" ref="canvas" id="canvas"></canvas>
            <button id="pictureButton" type="button" @click.prevent="takePicture">Dites Cheese !</button>
          </div>
        </div>
        <div v-show="!isTakingPicture" style="display: flex; flex-direction: column; justify-content: center; align-content: center">
          <button type="button" @click="happy">Content de votre photo ? On peut continuer ?</button>
          <button type="button" @click="takeAnother">Re-essayez avec votre meilleur profil ?</button>
          <img ref="photo" id="photo" alt="The screen capture will appear in this box."/>
        </div>
      </div>
    </div>
    <div v-else>
      Desole, malheureusement, il n'y a aucune camera disponible sur votre appareil.
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, nextTick, onMounted, ref, unref} from 'vue'

// const width = 1280    // We will scale the photo width to this
// const height = 0     // This will be computed based on the input stream

const stream = ref<MediaStream>()
const streaming = computed(() => Boolean(stream.value))
const isTakingPicture = ref(false)
const imgData = ref<any>()

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()
const maskCanvas = ref<HTMLCanvasElement>()
const photo = ref<HTMLImageElement>()

const emit = defineEmits<{
  (event: 'pictureTaken', data: { img: any }): void
}>()

function happy() {
  const p = unref(photo)!
  video.value?.pause()
  stream.value?.getTracks().forEach(track => track.stop())
  stream.value = undefined
  emit('pictureTaken', {img: p.src})
}

function takeAnother() {
  isTakingPicture.value = true
  const c = unref(canvas)!
  const p = unref(photo)!
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#AAA'
  ctx.fillRect(0, 0, c.width, c.height)
  const data = c.toDataURL('image/png')
  p.src = data
  video.value!.play()
}

const isCameraSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices

onMounted(async () => {
  console.log('isCameraSupported', isCameraSupported)
  if (isCameraSupported) {
    const v = unref(video)!
    const c = unref(canvas)!
    const m = unref(maskCanvas)!
    v.addEventListener('canplay', async (event) => {
      console.log('canplay', v.videoWidth, v.videoHeight)
      // const width = v.videoWidth
      // const height = v.videoHeight
      const width = window.innerWidth
      const height = window.innerHeight
      v.width = width
      v.height = height
      c.width = width
      c.height = height
      m.width = width
      m.height = height

      // const picWidth = height / 1.2
      const picWidth = height / 1.8
      // v.width = width
      // v.height = height
      // c.width = width
      // c.height = height
      // m.width = width
      // m.height = height

      console.log('v width', window.innerWidth, window.innerHeight, v.width, v.height)
      await nextTick()
      const centerX = width / 2
      const centerY = height / 2
      const ctx = m.getContext('2d')!
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, picWidth / 2.8, picWidth / 2, 0, 2 * Math.PI, 0)
      // ctx.arc(centerX, centerY, picWidth / 2, 2 * Math.PI, 0)
      ctx.fill()
      ctx.stroke()
    },
    false)
  }
})

function takePicture() {
  const c = unref(canvas)!
  const v = unref(video)!
  const p = unref(photo)!
  const videoWidth = v.videoWidth
  const videoHeight = v.videoHeight
  const videoCaptureWidth = videoHeight / 1.8
  const videoCaptureHeight = videoHeight / 1.8
  const videoCenterX = videoWidth / 2
  const videoCenterY = videoHeight / 2

  const targetWidth = 300
  const targetHeight = 300
  c.width = targetWidth
  c.height = targetHeight
  const ctx = c.getContext('2d')!
  ctx.drawImage(v, videoCenterX - (videoCaptureWidth / 2), videoCenterY - (videoCaptureHeight / 2), videoCaptureWidth, videoCaptureHeight, 0, 0, c.width, c.height)
  const data = c.toDataURL('image/png')
  imgData.value = data
  p.src = data
  isTakingPicture.value = false
  v.pause()
  // emit('pictureTaken', { img: data })
}

async function startCamera() {
  try {
    isTakingPicture.value = true
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        // width: {
        //   min: 1280
        // },
        // height: {
        //   min: 720
        // },
        facingMode: 'user'
      },
      audio: false
    })
    stream.value = videoStream
    video.value!.srcObject = videoStream
    video.value!.play()
    console.log('video stream', video.value!.width, video.value!.height)
  } catch (error) {
    console.error('Not able to load video', error)
  }
}

</script>
<style scoped>
#camera {
  position: relative;
}

#video, #maskCanvas, #canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#maskCanvas {
  opacity: 0.5;
  background: red;
}

#pictureButton {
  position: fixed;
  top: 0;
  left: 50%;
  margin-top: 20px;
}

#photo {
  width: 300px;
  height: 300px;
}

#cameraAccess {
  display: flex;
  justify-content: center;
  font-size: 20px;
}

#cameraAccess button {
  font-size: 20px;
  padding: 10px;
}
</style>
