<template>
  <div>
    <canvas id="canvas1" ref="canvas1"></canvas>
    <div id="controls">
      <select v-model="playerStateKey">
        <option v-for="a in availableAnimations" :value="a" :selected="a === selectedAnimationKey">{{ a }}</option>
      </select>
      <input type="number" v-model="gameSpeed" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, unref} from 'vue'
import {type AnimationState, ShadowDogSprite, type SpriteAnimation, SpriteAnimations} from '@/components/SprintAnimations'

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const gameSpeed = ref(4)  // define speed of animation/game
const canvas1 = ref<HTMLCanvasElement>()
const playerStateKey = ref('idle')
const sprite = ShadowDogSprite
const { colWidth, rowHeight, states, img } = sprite
const availableAnimations = states.map(({ name }) => name)
const playState = computed<AnimationState>(() => states.find(({ name }) => name === playerStateKey.value)!)
const maxFrame = computed(() => playState.value.frames)
const frameY = computed(() => states.indexOf(playState.value) * rowHeight)

type AnimationFrame = {
  x: number,
  y: number,
  width: number,
  height: number
}

function animationFrame(gameFrame: number): AnimationFrame {
  let position = Math.floor(gameFrame/gameSpeed.value) % maxFrame.value
  return {
    x: colWidth * position,
    y: frameY.value,
    width: colWidth,
    height: rowHeight
  }
}

onMounted(() =>  {
  const canvas = unref(canvas1)!
  const ctx = canvas.getContext('2d')!

  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const playerImage = new Image()
  playerImage.src = img
  let gameFrame = 0

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // ctx.fillRect(100, 50, 100,100)

    const { x, y, width, height } = animationFrame(gameFrame)
    ctx.drawImage(playerImage, x, y, width, height, 0, 0, width, height)
    gameFrame++
    requestAnimationFrame(animate)
  }

  animate()
})


</script>
<style scoped>
#controls {
  position: absolute;
  top: 0;
}
#canvas1 {
  border: 5px solid white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
}
</style>
