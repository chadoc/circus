import type {DisplayCoordinate, DisplayedObject, InputController, PositionedElement, PuppetHandler} from '@/components/game/common/Draw'
import {randomIntFromInterval} from '@/components/game/common/utils'
import {BubbleSprite} from '@/components/game/niko/BubbleSprite'
import {AnimatedSprite, type AnimationState} from '@/components/game/common/AnimatedSprite'
import {Position} from '@/components/game/common/Draw'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from '@/components/game/Config'

function randomFrame(state: AnimationState) {
  return randomIntFromInterval(0, state.frames)
}

function randomShift(value: number, shift = 30): number {
  return value + randomIntFromInterval(-shift, shift)
}

export class BubbleParticule implements DisplayedObject, PositionedElement {

  private readonly game: PuppetHandler;
  private readonly sprite: AnimatedSprite;
  private duration: number
  private position: Position
  private frameRate: FrameRate
  private ratio: number
  private speed: number

  constructor(game: PuppetHandler, { x, y, width, height }: Position) {
    this.frameRate = new FrameRate(Config.frameRate)
    this.game = game
    this.sprite = new AnimatedSprite(BubbleSprite, { row: 0, frame: randomFrame(BubbleSprite.states[0]) })
    this.duration = 15;
    this.ratio = randomIntFromInterval(2, 15)
    this.speed = randomIntFromInterval(-5, 5)

    const centerX = x + (width / 2) - (this.sprite.sw / this.ratio / 2)
    const centerY = y + (height / 2) - (this.sprite.sh / this.ratio / 2)
    this.position = new Position(randomShift(centerX), randomShift(centerY))
  }

  get coordinate(): DisplayCoordinate {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.sprite.sw,
      height: this.sprite.sh,
      ratio: this.ratio
    }
  }


  update(deltaTime: number, input: InputController) {
    this.frameRate.onUpdate(deltaTime, () => {
      this.duration--
      this.position = new Position(this.position.x + this.speed, this.position.y + this.speed)
    })
  }

  draw() {
    this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
  }

  get mustDelete(): boolean {
    return this.duration <= 0;
  }
}
