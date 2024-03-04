<template>
  <div>
<!--    <img id="userImg" :src="userImg" />-->
    <canvas id="collisionCanvas1" ref="collisionCanvas1"></canvas>
    <canvas id="canvas1" ref="canvas1"></canvas>
    <button id="fullScreenButton" ref="fullScreenButton" @click="toggleFullScreen">FullScreen</button>
    <div class="hiddenAsset">
      <img src="../../assets/SpriteCloud.png" />
      <img src="../../assets/SpritePuppet.png" />
<!--      <audio src="../../assets/liquid.wav" preload="auto" />-->
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, unref} from 'vue'
import {triggerGame} from '@/components/game/Game'
import {Game} from '@/components/game/Game'

const props = defineProps<{
  userImg: any
}>()

const canvas1 = ref<HTMLCanvasElement>()
const collisionCanvas1 = ref<HTMLCanvasElement>()
const fullScreenButton = ref<HTMLButtonElement>()
const game = ref<Game>()
// TODO preload img/wav

onMounted(() =>  {
  const canvas = unref(canvas1)!
  const collisionCanvas = unref(collisionCanvas1)!

  const { innerWidth, innerHeight } = window
  canvas.width = innerWidth
  canvas.height = innerHeight
  collisionCanvas.width = innerWidth
  collisionCanvas.height = innerHeight

  game.value = triggerGame(canvas, collisionCanvas, props.userImg)
})

function toggleFullScreen() {
  game.value?.toggleFullScreen()
}

</script>
<style scoped>
#canvas1, #collisionCanvas1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 5px solid white;
  max-width: 100%;
  max-height: 100%;
}
#collisionCanvas1 {
  //background: red;
  opacity: 0;
}
.hiddenAsset {
  display: none;
}
#fullScreenButton {
  position: absolute;
  font-size: 20px;
  padding: 10px;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
