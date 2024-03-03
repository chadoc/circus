<template>
  <div>
    <canvas id="collisionCanvas1" ref="collisionCanvas1"></canvas>
    <canvas id="canvas1" ref="canvas1" @click="clicked"></canvas>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, unref} from 'vue'
import CloudImg from '../assets/SpriteCloud.png'
import CloudSound from '../assets/liquid.wav'
import SpritePuppet from '../assets/SpritePuppet.png'

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const canvas1 = ref<HTMLCanvasElement>()
const collisionCanvas1 = ref<HTMLCanvasElement>()
const gameSpeed = ref(4)  // define speed of animation/game
const puppetCount = 10
const puppetMissThreshold = 3
let puppets: Puppet[] = []
let animations: Cloud[] = []

let gameFrame = 0
let score = 0
let missedPuppet = 0
let gameOver = false

let timeToNextPuppet = 0
let puppetInterval = 500
let lastTime = 0

class Puppet {
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
  private image: any
  private angle: number
  private angleSpeed: number
  private sinHeightRatio: number
  private markedForDeletion: boolean
  private timeSinceUpdate: number
  private updateInterval: number

  private randomColors: [number, number, number]
  private color: string

  constructor(canvas: HTMLCanvasElement) {
    this.image = new Image()
    this.image.src = SpritePuppet
    this.spriteWidth = 200
    this.spriteHeight = 150
    this.widthRatio = Math.random() * 1.5 + 0.6
    this.spriteFrames = 5

    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio

    // this.x = Math.random() * (canvas.width - this.width)
    this.x = canvas.width
    this.y = Math.random() * (canvas.height - this.height)
    this.frame = 0
    this.speed = Math.random() * 4 + 1
    this.markedForDeletion = false
    this.angle = Math.random() * 2
    this.angleSpeed = Math.random() * 0.2
    this.sinHeightRatio = Math.random() * 7 + 2

    this.timeSinceUpdate = 0
    this.updateInterval = Math.random() * 50 + 20

    // color collision detection
    this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    const [r, g, b] = this.randomColors
    this.color = `rgb(${r},${g},${b}`
  }

  get size() {
    return this.width
  }

  shootAttempt([r, g, b]: Uint8ClampedArray) {
    const [pr, pg, pb] = this.randomColors
    if (pr === r && pg === g && pb === b) {
      this.markedForDeletion = true
      animations.push(new Cloud(this.x, this.y, this.width))
      score++
    }
  }

  update(deltatime: number) {
    this.x -= this.speed
    // this.y += Math.random() * 5 - 2.5
    this.y += this.sinHeightRatio * Math.sin(this.angle)
    this.angle += this.angleSpeed
    if (this.x + this.width < 0) {
      this.markedForDeletion = true
      missedPuppet++
      if (missedPuppet > puppetMissThreshold) {
        gameOver = true
      }
      // this.x = this.canvasWidth
    }
    this.timeSinceUpdate += deltatime
    if (this.timeSinceUpdate > this.updateInterval) {
      this.timeSinceUpdate = 0
      if (this.frame > this.spriteFrames - 2) {
        this.frame = 0
      } else {
        this.frame++
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, collisionCtx: CanvasRenderingContext2D) {
    collisionCtx.fillStyle = this.color
    collisionCtx.fillRect(this.x, this.y, this.width, this.height)
    // ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

class Cloud {
  private x: number
  private y: number
  private width: number
  private height: number
  private image: any
  private sound: any
  private size: number

  private frame: number
  private animationSpeed: number

  private spriteWidth: number
  private spriteHeight: number
  private widthRatio: number
  private spriteFrames: number

  private markedForDeletion: boolean

  private timeSinceUpdate: number
  private updateInterval: number

  constructor(x: number, y: number, size: number) {
    this.image = new Image()
    this.image.src = CloudImg
    this.sound = new Audio()
    this.sound.src = CloudSound
    this.spriteWidth = 300
    this.spriteHeight = 230
    this.widthRatio = 1.2
    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio
    this.x = x
    this.y = y
    this.size = size
    this.spriteFrames = 9
    this.animationSpeed = 4
    this.frame = 0
    this.markedForDeletion = false

    this.timeSinceUpdate = 0
    this.updateInterval = 60
  }

  update(deltatime: number) {
    if (this.frame === 0) {
      this.sound.play()
    }
    this.timeSinceUpdate += deltatime
    if (this.timeSinceUpdate > this.updateInterval) {
      this.frame++
      this.timeSinceUpdate = 0
      if (this.frame > this.spriteFrames - 2) {
        this.markedForDeletion = true
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size)
  }
}

function drawScore(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 50, 75)
}

function drawGameOver(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = 'center'
  ctx.fillStyle = 'white'
  ctx.fillText(`GAME OVER, your score is ${score}`, ctx.canvas.width / 2, ctx.canvas.height / 2)
}


onMounted(() =>  {
  const canvas = unref(canvas1)!
  const ctx = canvas.getContext('2d')!
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const collisionCanvas = unref(collisionCanvas1)!
  const collisionCtx = collisionCanvas.getContext('2d')!
  collisionCanvas.width = CANVAS_WIDTH
  collisionCanvas.height = CANVAS_HEIGHT

  ctx.font = '50px Impact'

  // animations.push(new Cloud(CANVAS_WIDTH, CANVAS_HEIGHT))

  function animate(timetamp: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height)

    let deltaTime = timetamp - lastTime
    lastTime = timetamp

    timeToNextPuppet += deltaTime

    if (timeToNextPuppet > puppetInterval && puppets.length < puppetCount) {
      puppets.push(new Puppet(canvas))
      timeToNextPuppet = 0
      // sort puppets by width to make sure bigger are in front
      puppets.sort(function(a, b) {
        return a.size - b.size
      })
    }

    // console.log(deltaTime)
    puppets.forEach(p => {
      p.update(deltaTime)
      p.draw(ctx, collisionCtx)
    })

    drawScore(ctx)

    animations.forEach(a => {
      a.update(deltaTime)
      a.draw(ctx)
    })

    puppets = puppets.filter(p => !p.markedForDeletion)
    animations = animations.filter(a => !a.markedForDeletion)

    gameFrame++

    if (!gameOver) {
      requestAnimationFrame(animate)
    } else {
      drawGameOver(ctx)
    }
  }

  animate(0)
})


function clicked(event: MouseEvent) {
  const collisionCtx: CanvasRenderingContext2D = collisionCanvas1.value!.getContext('2d')!
  const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1).data
  puppets.forEach(puppet => puppet.shootAttempt(detectPixelColor))
}

</script>
<style scoped>
#controls {
  position: absolute;
  top: 0;
}
#canvas1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#collisionCanvas1 {
  //background: red;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
