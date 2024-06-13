import CloudImg from '../../assets/SpriteCloud.png'
import Bubble from '../../assets/speech3.png'
import CloudSound from '../../assets/liquid.wav'
import type {DisplayCoordinate, DisplayedObject, GameContext} from '@/components/game/common/Draw'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from "@/components/game/Config";
import GimmickSource from '../../assets/gimmick/gimmick.txt?raw'
import {randomIntFromInterval} from '@/components/game/common/utils'

const sound = new Audio(CloudSound)
const image = new Image()
image.src = CloudImg

const bubble = new Image()
bubble.src = Bubble

const gimmicks = (GimmickSource as string).split('\n').filter(s => s.length > 0)

let currentGimmick = -1

function nextGimmick() {
  // console.log('randon', randomIntFromInterval(0, gimmicks.length - 1))
  // return randomIntFromInterval(0, gimmicks.length - 1)
  currentGimmick++
  if (currentGimmick >= gimmicks.length) {
    currentGimmick = 0
  }
  return currentGimmick
}

function splitInLines(sentence: string, maxLine = 2): string[] {
  const rowLimit = Math.round(sentence.length / maxLine)
  const lines: string[] = []
  let currentLine = 0

  for (const word of sentence.split(' ')) {
    lines[currentLine] = (lines[currentLine] || '') + word + ' '
    if (lines[currentLine].length >= rowLimit && currentLine < maxLine) {
      currentLine++
    }
  }
  return lines.map(line => line.trim())
}

export class SpeechBubble implements DisplayedObject {
  private readonly game: GameContext
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
  private quoteDurationSeconds: number = 4
  private creationTime: number
  private displayBubble: boolean = false

  private bubbleImageWidth: number = 656
  private bubbleImageHeight: number = 520
  readonly source: DisplayedObject & { coordinate: DisplayCoordinate }

  private readonly gimmick: string[]

  constructor(game: GameContext, source: DisplayedObject & { coordinate: DisplayCoordinate }, size: number) {
    this.game = game
    this.spriteWidth = 300
    this.spriteHeight = 230
    this.widthRatio = 0.2
    this.width = this.spriteWidth / this.widthRatio
    this.height = this.spriteHeight / this.widthRatio
    this.source = source
    this.size = size
    this.spriteFrames = 9
    this.frame = 0
    this.markedForDeletion = false
    this.gimmick = splitInLines(gimmicks[nextGimmick()])

    this.frameRate = new FrameRate(Config.frameRate)
    this.creationTime = new Date().getTime()
  }

  get x(): number {
    return this.source.coordinate.x - 100
  }

  get y(): number {
    return this.source.coordinate.y + 100
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
        } else if (this.frame == 4) {
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

  get textWidth(): number {
    this.game.ctx.font = '26px julien'
    this.game.ctx.fillStyle = 'black'
    let width = 0
    for (const gimmick of this.gimmick) {
      width = Math.max(width, this.game.ctx.measureText(gimmick).width)
    }
    return width
  }

  draw() {
    if (this.displayBubble) {
      this.game.ctx.font = '26px julien'
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

      // this.game.ctx.fillText('Parce que les opossums', textX, textYBase)
      // this.game.ctx.fillText('les mettraient', textX, textYBase + lineHeight * 1)
      // this.game.ctx.fillText('sûrement à l\'envers', textX, textYBase + lineHeight * 2)
    } else {
      this.game.ctx.drawImage(image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size)
    }
  }
}
