import type {
  DisplayCoordinate,
  DisplayedObject,
  GameContext,
  InputController,
  Movement,
  MovingElement
} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {NikoBodyRef, NikoSprite} from "@/components/game/niko/NikoSprite";
import Config from "@/components/game/Config";
import {NikoArms} from "@/components/game/niko/NikoArms";
import {NikoLegs} from "@/components/game/niko/NikoLegs";
import {NikoHead} from "@/components/game/niko/NikoHead";
import {BubbleParticule} from '@/components/game/niko/BubbleParticule'
import {FrameRate} from "@/components/game/common/FrameRate";

export class NikoPlayer implements DisplayedObject, MovingElement {
  private readonly game: GameContext
  private position: Position
  private body: AnimatedSprite
  protected movement: Movement
  private frameRate: FrameRate
  private arms: NikoArms
  private legs: NikoLegs
  private head: NikoHead
  private bubbles: DisplayedObject[] = []

  constructor(game: GameContext) {
    this.game = game
    this.body = new AnimatedSprite(NikoSprite, NikoBodyRef)
    this.position = game.center(this.width, this.height)
    this.movement = {
      xSpeed: 0,
      ySpeed: 0
    }

    this.frameRate = new FrameRate(Config.frameRate * Config.playerFrameRateModifier)
    this.arms = new NikoArms(game, this)
    this.legs = new NikoLegs(game, this)
    this.head = new NikoHead(game, this)
  }

  get maxXSpeed(): number {
    return this.game.ch(Config.playerXSpeedScale)
  }

  get maxYSpeed(): number {
    return this.game.cw(Config.playerYSpeedScale)
  }

  get weight(): number {
    return this.game.ch(Config.gravityScale)
  }

  get width(): number {
    return (this.body.sw * this.height) / this.body.sh
  }

  get height(): number {
    return this.game.ch(Config.playerScale)
  }

  private computeSpeed(input: InputController, movement: Movement) {
    let { xSpeed, ySpeed } = movement
    if (input.moveRight()) {
      xSpeed = Math.min(xSpeed + 1, this.maxXSpeed)
    } else if (input.moveLeft()) {
      xSpeed = Math.max(xSpeed - 1, -this.maxXSpeed)
    } else {
      if (xSpeed > 0) {
        xSpeed = Math.max(xSpeed - 1, 0)
      } else {
        xSpeed = Math.min(xSpeed + 1, 0)
      }
    }

    if (input.moveUp()) {
      ySpeed -= this.maxYSpeed
    } else if (input.moveDown()) {
      ySpeed += this.maxYSpeed
    } else {
      ySpeed = 0
    }

    ySpeed = this.applyGravity(ySpeed)
    return { xSpeed, ySpeed }
  }

  update(deltaTime: number, input: InputController) {
    this.bubbles = this.bubbles.filter(b => !b.mustDelete)
    this.bubbles.push(new BubbleParticule(this.game, this.coordinate))

    this.frameRate.onUpdate(deltaTime, () => {
      this.movement = this.computeSpeed(input, this.movement)
      this.position = this.newPosition(this.movement)

      this.arms.update(deltaTime, input)
      this.legs.update(deltaTime, input)
      this.head.update(deltaTime, input)
      this.bubbles.forEach(bubble => bubble.update(deltaTime, input))
    })
  }

  private applyGravity(verticalSpeed: number): number {
    if (!this.onGround) {
      return verticalSpeed + this.weight
    } else {
      return verticalSpeed
    }
  }

  newPosition({ xSpeed, ySpeed }: Movement): Position {
    let x = Math.min(this.position.x + xSpeed)
    let y = this.position.y + ySpeed

    return new Position(
        Math.min(Math.max(x, 0), this.rightBoundary),
        Math.min(Math.max(y, 0), this.groundHeight)
    )
  }

  private get rightBoundary(): number {
    return this.game.ctx.canvas.width - this.width
  }

  get groundHeight(): number {
    return this.game.ctx.canvas.height - this.height
  }

  get onGround(): boolean {
    return this.position.y >= this.groundHeight
  }

  get coordinate(): DisplayCoordinate {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    }
  }

  draw() {
    // draw image with border radius
    // https://stackoverflow.com/questions/4882354/rounded-corners-on-images-in-canvas
    this.bubbles.forEach(bubble => bubble.draw())
    this.game.drawer.drawSprite(this.body.toDrawRef(this.coordinate))
    this.arms.draw()
    this.legs.draw()
    this.head.draw()
    /*
    const ctx = this.game.ctx
    ctx.drawImage(imgPlane, 0, 0, imageWidth, imageHeight, this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 0.4
    ctx.drawImage(imgWindow, 0, 0, imageWidth, imageHeight, this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 1
     */
  }

  get mustDelete() {
    return false
  }
}
