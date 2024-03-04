<template>
  <div id="cameraAccess">
    <div v-if="isCameraSupported">
      <div v-show="!streaming">
        <p style="padding: 10px; max-width: 400px">Veuillez demarrer votre camera et prendre une photo de vous avec votre visage remplissant le rond blanc</p>
        <button type="button" @click="startCamera">Demarrer la camera</button>
      </div>
      <div v-show="streaming">
        <div v-show="isTakingPicture">
          <button id="startbutton" type="button" @click.prevent="takePicture">Dites Cheese !</button>
          <div id="camera" class="camera">
            <video ref="video" id="video">Video stream not available.</video>
            <canvas ref="maskCanvas" id="maskCanvas"></canvas>
            <canvas v-show="false" ref="canvas" id="canvas"></canvas>
          </div>
        </div>
        <div v-show="!isTakingPicture">
          <button type="button" @click="happy">Content de votre photo ? On peut continuer ?</button>
          <button type="button" @click="takeAnother">Re-essayez avec votre meilleur profil ?</button>
          <img ref="photo" id="photo" alt="The screen capture will appear in this box." />
        </div>
      </div>
    </div>
    <div v-else>
      Desole, malheureusement, il n'y a aucune camera disponible sur votre appareil.
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, unref} from 'vue'

const width = 1280;    // We will scale the photo width to this
const height = 0;     // This will be computed based on the input stream

const picWidth = 300

const streaming = ref(false);
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
  emit('pictureTaken', { img: p.src })
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
  }
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
  isTakingPicture.value = false
  v.pause()
  // emit('pictureTaken', { img: data })
}

async function startCamera() {
  try {
    isTakingPicture.value = true
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
    streaming.value = true
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
#cameraAccess {
  display: flex;
  justify-content: center;
}
</style>
