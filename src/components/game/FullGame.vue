<template>
  <div>
    <canvas id="collisionCanvas1" ref="collisionCanvas1"></canvas>
    <canvas id="canvas1" ref="canvas1"></canvas>
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

const canvas1 = ref<HTMLCanvasElement>()
const collisionCanvas1 = ref<HTMLCanvasElement>()

// TODO preload img/wav

onMounted(() =>  {
  const canvas = unref(canvas1)!
  const collisionCanvas = unref(collisionCanvas1)!

  const { innerWidth, innerHeight } = window
  canvas.width = innerWidth
  canvas.height = innerHeight
  collisionCanvas.width = innerWidth
  collisionCanvas.height = innerHeight

  triggerGame(canvas, collisionCanvas)
})

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
</style>
