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
import clouds1 from '../assets/clouds1/1.png'
import clouds2 from '../assets/clouds1/2.png'
import clouds3 from '../assets/clouds1/3.png'
import clouds4 from '../assets/clouds1/4.png'
import enemyImg from '../assets/SpriteEnemy.png'

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 1000;

const canvas1 = ref<HTMLCanvasElement>()
const gameSpeed = ref(10)  // define speed of animation/game
const numberOfEnemies = ref(15)
const enemies: Enemy[] = []



let gameFrame = 0

function nextFrame(gameFrame: number, maxFrame: number): AnimationFrame {
  return Math.floor(gameFrame/gameSpeed.value) % maxFrame
}

class Enemy {
  private ctx: CanvasRenderingContext2D
  private x: number
  private y: number
  private width: number
  private height: number
  private speed: number
  private spriteWidth: number
  private spriteHeight: number
  private widthRatio: number
  private frame: number
  private spriteFrames: number
  private animationSpeed: number
  private image: any
  private canvasWidth: number

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.image = new Image()
    this.image.src = enemyImg
    this.ctx = ctx
    this.speed = Math.random() * 4 + 1
    this.spriteWidth = 200
    this.spriteHeight = 150
    this.widthRatio = 1.2
    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio
    this.x = Math.random() * (canvasWidth - this.width)
    this.y = Math.random() * (canvasHeight - this.height)
    this.frame = 0
    this.spriteFrames = 5
    this.animationSpeed = Math.floor(Math.random() * 2 + 1)

  }

  update() {
    this.x -= this.speed
    // this.y += Math.random() * 5 - 2.5
    if (this.x + this.width < 0) {
      this.x = this.canvasWidth
    }
    if (gameFrame % this.animationSpeed === 0) {
      if (this.frame > this.spriteFrames - 2) {
        this.frame = 0
      } else {
        this.frame++
      }
    }
  }

  draw() {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height)
    this.ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

onMounted(() =>  {
  const canvas = unref(canvas1)!
  const ctx = canvas.getContext('2d')!

  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  for (let i = 0; i < numberOfEnemies.value; i++) {
    enemies.push(new Enemy(ctx, canvas.width, canvas.height))
  }

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    enemies.forEach(g => {
      g.update()
      g.draw()
    })
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
  width: 500px;
  height: 1000px;
}
</style>
