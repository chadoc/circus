<template>
  <div>
    <canvas id="canvas1" ref="canvas1" @click="clicked"></canvas>
    <div id="controls">
      <input type="number" v-model="gameSpeed" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, unref} from 'vue'
import CloudImg from '../assets/SpriteCloud.png'
import CloudSound from '../assets/liquid.wav'

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const canvas1 = ref<HTMLCanvasElement>()
const gameSpeed = ref(4)  // define speed of animation/game
let animations: Cloud[] = []

let gameFrame = 0

class Cloud {
  private x: number
  private y: number
  private width: number
  private height: number
  private image: any
  private sound: any

  private frame: number
  private animationSpeed: number

  private spriteWidth: number
  private spriteHeight: number
  private widthRatio: number
  private spriteFrames: number

  markedForDeletion: boolean

  constructor(x: number, y: number) {
    this.image = new Image()
    this.image.src = CloudImg
    this.sound = new Audio()
    this.sound.src = CloudSound
    this.spriteWidth = 300
    this.spriteHeight = 230
    this.widthRatio = 1.2
    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio
    this.x = x - this.width / 2
    this.y = y - this.height / 2
    this.spriteFrames = 9
    this.animationSpeed = 4
    this.frame = 0
    this.markedForDeletion = false
  }

  update() {
    if (this.frame === 0) {
      this.sound.play()
    }
    if (gameFrame % this.animationSpeed === 0) {
      if (this.frame > this.spriteFrames - 2) {
        this.frame++
        this.markedForDeletion = true
      } else {
        this.frame++
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

onMounted(() =>  {
  const canvas = unref(canvas1)!
  const ctx = canvas.getContext('2d')!

  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  // animations.push(new Cloud(CANVAS_WIDTH, CANVAS_HEIGHT))

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    animations.forEach(a => {
      a.update()
      a.draw(ctx)
    })

    animations = animations.filter(a => !a.markedForDeletion)
    gameFrame++
    requestAnimationFrame(animate)
  }

  animate()

})


function clicked(event: MouseEvent) {
  const canvasPosition = canvas1.value!.getBoundingClientRect()
  const positionX = event.x - canvasPosition.left
  const positionY = event.y - canvasPosition.top
  animations.push(new Cloud(positionX, positionY))
}

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
