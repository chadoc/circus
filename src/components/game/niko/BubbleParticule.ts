import type {DisplayCoordinate, DisplayedObject, InputController, PositionedElement, GameContext} from '@/components/game/common/Draw'
import {center, randomIntFromInterval, randomScale} from '@/components/game/common/utils'
import {BubbleSprite} from '@/components/game/niko/BubbleSprite'
import {AnimatedSprite, type AnimationState} from '@/components/game/common/AnimatedSprite'
import {Position} from '@/components/game/common/Draw'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from '@/components/game/Config'

function randomFrame(state: AnimationState) {
  return randomIntFromInterval(0, state.frames)
}

function randomShift({ x, y }: Position, shift = 30): Position {
  return new Position(
      x + randomIntFromInterval(-shift, shift),
      y + randomIntFromInterval(-shift, shift)
  )
}

export class BubbleParticule implements DisplayedObject, PositionedElement {

  private readonly game: GameContext;
  private readonly sprite: AnimatedSprite;
  private duration: number
  private position: Position
  private frameRate: FrameRate
  private width: number
  private speedX: number
  private speedY: number

  constructor(game: GameContext, { x, y, width, height }: DisplayCoordinate) {
    this.frameRate = new FrameRate(Config.frameRate * Config.playerFrameRateModifier)
    this.game = game
    this.sprite = new AnimatedSprite(BubbleSprite, { row: 0, frame: randomFrame(BubbleSprite.states[0]) })
    this.duration = 15;
    this.width = width * randomScale(0.10, 0.30)
    this.speedX = game.ch(randomScale(-Config.bubbleSpeedScale, Config.bubbleSpeedScale))
    this.speedY = game.ch(randomScale(-Config.bubbleSpeedScale, Config.bubbleSpeedScale))
    this.position = randomShift(center(x, y, width, height, this.width, this.height))
  }

  get height(): number {
    return (this.sprite.sh * this.width) / this.sprite.sw
  }

  get coordinate(): DisplayCoordinate {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    }
  }

  update(deltaTime: number, input: InputController) {
    this.frameRate.onUpdate(deltaTime, () => {
      this.duration--
      this.position = new Position(this.position.x + this.speedX, this.position.y + this.speedY)
    })
  }

  draw() {
    this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
  }

  get mustDelete(): boolean {
    return this.duration <= 0;
  }
}
