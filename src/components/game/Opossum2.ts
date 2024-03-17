import Sprite from '../../assets/opossum/Opossum2Sprite.png'
import type {DisplayCoordinate, DisplayedObject, InputController, PuppetHandler} from '@/components/game/Draw'
import {FrameRate} from '@/components/game/FrameRate'
import {CollisionDetection} from '@/components/game/CollisionDetection'
import type {AnimationState} from '@/components/SprintAnimations'
import {LeftRightAnimation} from '@/components/game/LeftRightAnimation'
import type {ObjectAnimation} from '@/components/game/LeftRightAnimation'

const image = new Image()
image.src = Sprite

export type AnimationSprite = {
  img: any,
  colWidth: number,
  rowHeight: number,
  states: AnimationState[]
}


const Opossum2Sprite: AnimationSprite = {
  img: image,
  colWidth: 1500,
  rowHeight: 1500,
  states: [
    {
      name: 'balance',
      frames: 7
    },
    {
      name: 'blink',
      frames: 5
    }
  ]
}

export class Opossum2 implements DisplayedObject {
  private readonly game: PuppetHandler
  private x: number
  private y: number
  private width: number
  private height: number
  private speed: number
  private spriteWidth: number
  private spriteHeight: number

  private spriteRow: number

  private widthRatio: number
  private frame: number
  private spriteFrames: number
  private leftDirection: boolean
  private angle: number
  private angleSpeed: number
  private sinHeightRatio: number
  private markedForDeletion: boolean

  private layerSpeed: number

  private frameRate: FrameRate
  private collisionDetection: CollisionDetection
  private animation: ObjectAnimation
  private balanceAnimation: boolean = true

  constructor(game: PuppetHandler) {
    this.game = game
    this.spriteWidth = 1500
    this.spriteHeight = 1500
    // this.widthRatio = Math.random() * 1.5 + 0.6
    this.widthRatio = 6
    this.spriteFrames = 7
    this.spriteRow = 0

    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio

    // this.x = Math.random() * (canvas.width - this.width)
    // this.x = this.game.ctx.canvas.width
    // this.y = Math.random() * (this.game.ctx.canvas.height - this.height)
    this.x = this.game.ctx.canvas.width / 2 - 506
    this.y = this.game.ctx.canvas.height / 2 - 100
    this.frame = 3
    // this.speed = Math.random() * 4 + 1
    this.speed = 0
    this.leftDirection = 0
    this.markedForDeletion = false
    this.angle = Math.random() * 2
    this.angleSpeed = Math.random() * 0.2
    this.sinHeightRatio = Math.random() * 7 + 2

    this.layerSpeed = 25 * 0.8 // TODO should be based on background

    // this.frameRate = new FrameRate(Math.random() * 50 + 20)
    this.frameRate = new FrameRate(120)
    this.collisionDetection = new CollisionDetection(game.collisionCtx)
    this.animation = new LeftRightAnimation(0, 7, 3, 4)
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

  update(deltaTime: number, input: InputController) {
    if (input.hasOneOf('ArrowRight', 'SwipeRight')) {
      this.speed = this.layerSpeed
    } else if (input.hasOneOf('ArrowLeft', 'SwipeLeft')) {
      this.speed = -this.layerSpeed
    } else {
      this.speed = 0
    }


    // this.x -= this.speed
    // // this.y += Math.random() * 5 - 2.5
    // this.y += this.sinHeightRatio * Math.sin(this.angle)
    // this.angle += this.angleSpeed
    // if (this.x + this.width < 0) {
    //   this.markedForDeletion = true
    //   this.game.miss()
    // }
    this.frameRate.onUpdate(deltaTime, () => {
      // console.log(`should draw frame ${this.frame}`)
      // compute frame
      if (this.animation.isFinished()) {
        if (this.balanceAnimation) {
          this.animation = new LeftRightAnimation(1, 5, 0, 2)
          this.balanceAnimation = false
        } else {
          this.animation = new LeftRightAnimation(0, 7, 3, 4)
          this.balanceAnimation = true
        }
      }
      this.animation.update()

      // compute x
      if (this.x <= -this.width) {
        this.x = 0
      }
      this.x = Math.floor(this.x - this.speed)
    })
  }

  draw() {
    this.collisionDetection.draw(this.coordinate)
    // ctx.strokeRect(this.x, this.y, this.width, this.height)
    this.game.ctx.drawImage(image,  this.animation.currentFrame() * this.spriteWidth, this.animation.spriteRow() * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}
