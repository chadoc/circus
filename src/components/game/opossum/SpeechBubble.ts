import Bubble from '../../../assets/speech3.png'
import CloudSound from '../../../assets/liquid.wav'
import type {DisplayCoordinate, DisplayedObject, GameContext} from '@/components/game/common/Draw'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from "@/components/game/Config";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {CloudSprite} from "@/components/game/opossum/CloudSprite";

const sound = new Audio(CloudSound)

const bubble = new Image()
bubble.src = Bubble

export interface HasGimmick {
  gimmick: string[]
}

export class SpeechBubble implements DisplayedObject {
  private readonly game: GameContext
  private sprite: AnimatedSprite
  private size: number

  private frame: number

  private scale: number
  private spriteFrames: number

  private markedForDeletion: boolean
  private fixed: boolean

  private frameRate: FrameRate
  private quoteDurationSeconds: number = 4
  private creationTime: number
  private displayBubble: boolean = false

  private bubbleImageWidth: number = 656
  private bubbleImageHeight: number = 520
  readonly source: DisplayedObject & { coordinate: DisplayCoordinate }

  private readonly gimmick: string[]

  constructor(game: GameContext,
              source: DisplayedObject & { coordinate: DisplayCoordinate } & HasGimmick,
              size: number,
              fixed: boolean = false) {
    this.game = game
    this.sprite = new AnimatedSprite(CloudSprite, { row: 0, frame: 0 })
    this.size = size
    this.source = source
    this.size = size
    this.spriteFrames = 9
    this.frame = 0
    this.markedForDeletion = false
    this.fixed = fixed
    this.gimmick = source.gimmick

    this.frameRate = new FrameRate(Config.frameRate)
    this.creationTime = new Date().getTime()
  }

  get coordinate(): DisplayCoordinate {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    }
  }

  get x(): number {
    return this.source.coordinate.x
  }

  get y(): number {
    return this.source.coordinate.y
  }

  get mustDelete() {
    return this.markedForDeletion && !this.fixed
  }

  update(deltaTime: number) {
    if (this.frame === 0) {
      // sound.play()
    }

    this.frameRate.onUpdate(deltaTime, () => {
      if (!this.displayBubble) {
        if (this.frame > (this.spriteFrames - 2)) {
          this.markedForDeletion = true
        } else if (this.frame == 4) {
          this.displayBubble = true
        } else {
          this.frame++
        }
      } else {
        const elapsedTimeInSecond = (new Date().getTime() - this.creationTime) / 1000
        if (elapsedTimeInSecond > this.quoteDurationSeconds && !this.fixed) {
          this.displayBubble = false
          this.frame++
        }
      }
      this.sprite.update({ row: 0, frame: this.frame })
    })
  }

  get textWidth(): number {
    this.game.ctx.font = '3.2vh julien'
    this.game.ctx.fillStyle = 'black'
    let width = 0
    for (const gimmick of this.gimmick) {
      width = Math.max(width, this.game.ctx.measureText(gimmick).width)
    }
    return width
  }

  draw() {
    if (this.displayBubble) {
      this.game.ctx.font = '3.2vh julien'
      this.game.ctx.fillStyle = 'black'

      const lineCount = this.gimmick.length
      const lineHeight = 40
      const maxTextWidth = this.textWidth
      const bubbleWidth = maxTextWidth + 250
      const bubbleHeight = lineCount * lineHeight + lineHeight

      this.game.ctx.drawImage(bubble, 0, 0, this.bubbleImageWidth, this.bubbleImageHeight, this.x, this.y, bubbleWidth, bubbleHeight)

      this.gimmick.forEach(g => {
        const textWidth = this.game.ctx.measureText(g).width
        const textX = this.x + ((bubbleWidth - textWidth) / 2)
        const textY = this.y + lineHeight * this.gimmick.indexOf(g) + lineHeight + 5
        this.game.ctx.fillText(g, textX, textY)
      })
    } else {
      this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
  }
}
