import SpritePuppet from '../../assets/SpritePuppet.png'
import type {DisplayCoordinate, DisplayedObject, PuppetHandler} from '@/components/game/Draw'
import {FrameRate} from '@/components/game/FrameRate'

class CollisionDetection {
  readonly randomColors: [number, number, number]
  readonly color: string
  private readonly collisionCtx: CanvasRenderingContext2D

  constructor( collisionCtx: CanvasRenderingContext2D) {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    this.randomColors = [r, g, b]
    this.color = `rgb(${r},${g},${b})`
    this.collisionCtx = collisionCtx
  }

  isHit([r, g, b]: Uint8ClampedArray): boolean {
    const [pr, pg, pb] = this.randomColors
    if (pr === r && pg === g && pb === b) {
      return true
    } else {
      return false
    }
  }

  draw({ x, y, width, height }: DisplayCoordinate) {
    this.collisionCtx.fillStyle = this.color
    this.collisionCtx.fillRect(x, y, width, height)
  }
}

const image = new Image()
image.src = SpritePuppet

export class Puppet implements DisplayedObject {
  private readonly game: PuppetHandler
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
  private angle: number
  private angleSpeed: number
  private sinHeightRatio: number
  private markedForDeletion: boolean
  private timeSinceUpdate: number
  private updateInterval: number

  private frameRate: FrameRate
  private collisionDetection: CollisionDetection

  constructor(game: PuppetHandler) {
    this.game = game
    this.spriteWidth = 200
    this.spriteHeight = 150
    this.widthRatio = Math.random() * 1.5 + 0.6
    this.spriteFrames = 5

    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio

    // this.x = Math.random() * (canvas.width - this.width)
    this.x = this.game.ctx.canvas.width
    this.y = Math.random() * (this.game.ctx.canvas.height - this.height)
    this.frame = 0
    this.speed = Math.random() * 4 + 1
    this.markedForDeletion = false
    this.angle = Math.random() * 2
    this.angleSpeed = Math.random() * 0.2
    this.sinHeightRatio = Math.random() * 7 + 2

    this.frameRate = new FrameRate(Math.random() * 50 + 20)
    this.collisionDetection = new CollisionDetection(game.collisionCtx)
  }

  get mustDelete() {
    return this.markedForDeletion
  }

  get size() {
    return this.width
  }

  get coordinate(): DisplayCoordinate {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  fire(point: Uint8ClampedArray): boolean {
    if (this.collisionDetection.isHit(point)) {
      this.markedForDeletion = true
      return true
    } else {
      return false
    }
  }

  update(deltaTime: number) {
    this.x -= this.speed
    // this.y += Math.random() * 5 - 2.5
    this.y += this.sinHeightRatio * Math.sin(this.angle)
    this.angle += this.angleSpeed
    if (this.x + this.width < 0) {
      this.markedForDeletion = true
      this.game.miss()
    }
    this.frameRate.onUpdate(deltaTime, () => {
      if (this.frame > this.spriteFrames - 2) {
        this.frame = 0
      } else {
        this.frame++
      }
    })
  }

  draw() {
    this.collisionDetection.draw(this.coordinate)
    // ctx.strokeRect(this.x, this.y, this.width, this.height)
    this.game.ctx.drawImage(image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}
