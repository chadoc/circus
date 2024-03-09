<template>
  <div>
    <canvas id="canvas1" ref="canvas1"></canvas>
    <div id="controls">
      <input type="number" v-model="gameSpeed" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, unref} from 'vue'
import clouds1 from '../assets/background/cloud/clouds4/1.png'
import clouds2 from '../assets/background/cloud/clouds4/2.png'
import clouds3 from '../assets/background/cloud/clouds4/3.png'
import clouds4 from '../assets/background/cloud/clouds4/4.png'

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 700;

const canvas1 = ref<HTMLCanvasElement>()
const gameSpeed = ref(10)  // define speed of animation/game

const backgroundWidth = 576
const backgroundHeight = 324
const backgroundDisplayWidth = CANVAS_WIDTH * 3


class BackgroundLayer {
  private ctx: CanvasRenderingContext2D
  private image: any
  private x: number
  private y: number
  private width: number
  private height: number
  private speedModifier: number
  private speed: number

  constructor(ctx: CanvasRenderingContext2D, image: any, width: number, height: number, speedModifier: number) {
    this.ctx = ctx
    this.image = new Image()
    this.image.src = image
    this.width = width
    this.height = height
    this.x = 0
    this.y = 0
    this.speedModifier = speedModifier
    this.speed = gameSpeed.value * this.speedModifier
  }

  update() {
    this.speed = gameSpeed.value * this.speedModifier
    if (this.x <= -this.width) {
      this.x = 0
    }
    this.x = Math.floor(this.x - this.speed)
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
  }
}

onMounted(() =>  {
  const canvas = unref(canvas1)!
  const ctx = canvas.getContext('2d')!

  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const gameObjects = [
    new BackgroundLayer(ctx, clouds1, backgroundDisplayWidth, CANVAS_HEIGHT, 0),
    new BackgroundLayer(ctx, clouds2, backgroundDisplayWidth, CANVAS_HEIGHT, 0.5),
    new BackgroundLayer(ctx, clouds3, backgroundDisplayWidth, CANVAS_HEIGHT, 0.8),
    new BackgroundLayer(ctx, clouds4, backgroundDisplayWidth, CANVAS_HEIGHT, 1)
  ]

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    gameObjects.forEach(g => {
      g.update()
      g.draw()
    })
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
  width: 800px;
  height: 700px;
}
</style>
