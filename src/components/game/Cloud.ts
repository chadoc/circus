import CloudImg from '../../assets/SpriteCloud.png'
import CloudSound from '../../assets/liquid.wav'
import type {DisplayedObject, GameContext} from '@/components/game/common/Draw'
import {FrameRate} from '@/components/game/common/FrameRate'

const sound = new Audio(CloudSound)
const image = new Image()
image.src = CloudImg

export class Cloud implements DisplayedObject {
  private readonly game: GameContext
  private x: number
  private y: number
  private width: number
  private height: number
  private size: number

  private frame: number

  private spriteWidth: number
  private spriteHeight: number
  private widthRatio: number
  private spriteFrames: number

  private markedForDeletion: boolean

  private frameRate: FrameRate

  constructor(game: GameContext, x: number, y: number, size: number) {
    this.game = game
    this.spriteWidth = 300
    this.spriteHeight = 230
    this.widthRatio = 1.2
    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio
    this.x = x
    this.y = y
    this.size = size
    this.spriteFrames = 9
    this.frame = 0
    this.markedForDeletion = false

    this.frameRate = new FrameRate(60)
  }

  get mustDelete() {
    return this.markedForDeletion
  }

  update(deltaTime: number) {
    if (this.frame === 0) {
      sound.play()
    }
    this.frameRate.onUpdate(deltaTime, () => {
      this.frame++
      if (this.frame > this.spriteFrames - 2) {
        this.markedForDeletion = true
      }
    })
  }

  draw() {
    this.game.ctx.drawImage(image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size)
  }
}
