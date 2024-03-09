import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/Draw'
import {type AnimationState, ShadowDogSprite} from '@/components/SprintAnimations'
import {FrameRate} from '@/components/game/FrameRate'


const image = new Image()
image.src = ShadowDogSprite.img

function stateFor(key: string): AnimationState {
  return ShadowDogSprite.states.find(({ name }) => name === key)!
}

function frameY(state: AnimationState): number {
  return ShadowDogSprite.states.indexOf(state)
}

export class Player implements DisplayedObject {
  private readonly game: PuppetHandler
  private x: number
  private y: number
  private width: number
  private height: number
  private state: AnimationState
  private frameY: number
  private frame: number
  private speed: number
  private verticalSpeed: number
  private weight: number

  private spriteWidth: number
  private spriteHeight: number
  private widthRatio: number
  private spriteFrames: number

  private markedForDeletion: boolean

  private frameRate: FrameRate

  constructor(game: PuppetHandler) {
    this.game = game
    this.state = stateFor('idle')
    this.spriteFrames = this.state.frames
    this.frameY = frameY(this.state)
    this.widthRatio = 3
    this.spriteWidth = ShadowDogSprite.colWidth
    this.spriteHeight = ShadowDogSprite.rowHeight
    this.frame = 0
    this.speed = 0

    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio
    this.x = 0
    this.y = game.ctx.canvas.height - this.height

    this.markedForDeletion = false

    this.frameRate = new FrameRate(60)

    this.speed = 0
    this.verticalSpeed = 0
    this.weight = 2
  }

  update(deltaTime: number, input: InputController) {
    if (input.hasKey('ArrowRight')) {
      this.speed = 5
    } else if (input.hasKey('ArrowLeft')) {
      this.speed = -5
    } else {
      this.speed = 0
    }

    if (input.hasOneOf('ArrowUp', 'SwipeUp') && this.onGround) {
      this.verticalSpeed -= 28
    }

    this.x += this.speed
    this.y += this.verticalSpeed

    const rightBoundary = this.game.ctx.canvas.width - this.width
    this.x = Math.min(Math.max(this.x, 0), rightBoundary)
    this.y = Math.min(this.y, this.groundHeight)
    if (!this.onGround) {
      this.verticalSpeed += this.weight
    } else {
      this.verticalSpeed = 0
    }

    this.frameRate.onUpdate(() => {
      if (this.frame > this.spriteFrames - 2) {
        this.frame = 0
      } else {
        this.frame++
      }
    })
  }
  draw() {
    this.game.ctx.fillStyle = 'white'
    this.game.ctx.drawImage(image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    // this.game.ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  get groundHeight(): number {
    return this.game.ctx.canvas.height - this.height
  }

  get onGround(): boolean {
    return this.y >= this.groundHeight
  }

  get mustDelete() {
    return false
  }
}
