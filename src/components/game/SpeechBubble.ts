import CloudImg from '../../assets/SpriteCloud.png'
import Bubble from '../../assets/speech3.png'
import CloudSound from '../../assets/liquid.wav'
import type {DisplayedObject, PuppetHandler} from '@/components/game/Draw'
import {FrameRate} from '@/components/game/FrameRate'

const sound = new Audio(CloudSound)
const image = new Image()
image.src = CloudImg

const bubble = new Image()
bubble.src = Bubble

export class SpeechBubble implements DisplayedObject {
  private readonly game: PuppetHandler
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
  private quoteDurationSeconds: number = 10
  private creationTime: number
  private displayBubble: boolean = false

  private bubbleImageWidth: number = 656
  private bubbleImageHeight: number = 520

  constructor(game: PuppetHandler,  x: number, y: number, size: number) {
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
    this.creationTime = new Date().getTime()
  }

  get mustDelete() {
    return this.markedForDeletion
  }

  update(deltaTime: number) {
    if (this.frame === 0) {
      // sound.play()
    }
    this.frameRate.onUpdate(deltaTime, () => {
      if (!this.displayBubble) {
        if (this.frame > (this.spriteFrames - 2)) {
          this.markedForDeletion = true
        } else if (this.frame == 2) {
          this.displayBubble = true
        } else {
          this.frame++
        }
      } else {
        const elapsedTimeInSecond = (new Date().getTime() - this.creationTime) / 1000
        if (elapsedTimeInSecond > this.quoteDurationSeconds) {
          this.displayBubble = false
          this.frame++
        }
      }
    })
  }

  draw() {
    if (this.displayBubble) {
      // https://stackoverflow.com/questions/12652769/rendering-html-elements-to-canvas
      this.game.ctx.drawImage(bubble, 0, 0, this.bubbleImageWidth, this.bubbleImageHeight, this.x, this.y, this.size, this.size)
      this.game.ctx.font = '20px julien'
      this.game.ctx.fillStyle = 'black'
      this.game.ctx.fillText('Parce que les opossums', this.x + 40, this.y + 100)
      this.game.ctx.fillText('les mettraient', this.x + 40, this.y + 130)
      this.game.ctx.fillText('sûrement à l\'envers', this.x + 40, this.y + 160)
    } else {
      this.game.ctx.drawImage(image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size)
    }
  }
}
