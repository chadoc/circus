import Bubble from '../../../assets/speech3.png'
import CloudSound from '../../../assets/liquid.wav'
import type {DisplayCoordinate, DisplayedObject, GameContext, PositionedElement} from '@/components/game/common/Draw'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from "@/components/game/Config";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {CloudSprite} from "@/components/game/opossum/CloudSprite";
import {BubbleText} from "@/components/game/opossum/BubbleText";

const sound = new Audio(CloudSound)

const bubble = new Image()
bubble.src = Bubble

export interface DisplayedText {
  lines: string[]
}

export class SpeechBubble implements DisplayedObject {
  private readonly game: GameContext
  private sprite: AnimatedSprite
  private size: number

  private frame: number

  private markedForDeletion: boolean
  private fixed: boolean

  private frameRate: FrameRate
  private quoteDurationSeconds: number = 4
  private creationTime: number
  private displayBubble: boolean = false

  readonly source: PositionedElement

  private bubbleText: BubbleText

  constructor(game: GameContext,
              source: PositionedElement & DisplayedText,
              size: number,
              fixed: boolean = false) {
    this.game = game
    this.sprite = new AnimatedSprite(CloudSprite, { row: 0, frame: 0 })
    this.size = size
    this.source = source
    this.size = size
    this.frame = 0
    this.markedForDeletion = false
    this.fixed = fixed

    this.frameRate = new FrameRate(Config.frameRate)
    this.creationTime = new Date().getTime()
    this.bubbleText = new BubbleText(game, source.lines, this)
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
        if (this.frame > (this.sprite.frameCount - 2)) {
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

  draw() {
    if (this.displayBubble) {
      this.bubbleText.draw()
    } else {
      this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
  }
}
