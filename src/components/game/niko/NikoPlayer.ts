import type {
  DisplayCoordinate,
  DisplayedObject,
  InputController,
  PositionedElement,
  PuppetHandler
} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {FrameRate} from '@/components/game/common/FrameRate'
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {NikoBodyRef, NikoSprite} from "@/components/game/niko/NikoSprite";
import Config from "@/components/game/Config";
import {NikoArms} from "@/components/game/niko/NikoArms";
import {NikoLegs} from "@/components/game/niko/NikoLegs";

export class NikoPlayer implements DisplayedObject, PositionedElement {
  private readonly game: PuppetHandler
  private position: Position
  private body: AnimatedSprite
  private ratio: number
  private speed: number
  private verticalSpeed: number
  private frame: number
  private spriteFrames: number

  private frameRate: FrameRate
  private arms: NikoArms
  private legs: NikoLegs

  constructor(game: PuppetHandler) {
    this.game = game
    this.body = new AnimatedSprite(NikoSprite, NikoBodyRef)
    //this.ratio = (this.game.ctx.canvas.width / 4) / this.game.ctx.canvas.width
    this.ratio = 5
    this.position = new Position((game.ctx.canvas.width / 2) - (this.width / 2), game.ctx.canvas.height - this.height)
    this.frameRate = new FrameRate(Config.frameRate)

    this.frame = 0
    this.speed = 0
    this.verticalSpeed = 0
    this.spriteFrames = 1

    this.arms = new NikoArms(game, this)
    this.legs = new NikoLegs(game, this)
  }

  get width(): number {
    return this.body.sw / this.ratio
  }

  get height(): number {
    return this.body.sh / this.ratio
  }

  update(deltaTime: number, input: InputController) {
    if (input.moveRight()) {
      this.speed = Math.min(this.speed + 1, Config.playerXSpeed)
    } else if (input.moveLeft()) {
      this.speed = Math.max(this.speed - 1, -Config.playerXSpeed)
    } else {
      if (this.speed > 0) {
        this.speed = Math.max(this.speed - 1, 0)
      } else {
        this.speed = Math.min(this.speed + 1, 0)
      }
    }

    if (input.moveUp()) {
      this.verticalSpeed -= Config.playerYSpeed
    } else if (input.moveDown()) {
      this.verticalSpeed += Config.playerYSpeed
    } else {
      this.verticalSpeed = 0
    }

    this.verticalSpeed = this.applyGravity(this.verticalSpeed)
    this.position = this.newPosition(this.speed, this.verticalSpeed)

    // if (!this.onGround) {
    //   this.verticalSpeed += this.weight
    // } else {
    //   this.verticalSpeed = 0
    // }

    // is there a collision

    this.frameRate.onUpdate(deltaTime, () => {
      if (this.frame > this.spriteFrames - 2) {
        this.frame = 0
      } else {
        this.frame++
      }
    })

    this.arms.update(deltaTime, input)
    this.legs.update(deltaTime, input)
  }

  private applyGravity(verticalSpeed: number): number {
    if (!this.onGround) {
      return verticalSpeed + Config.gravity
    } else {
      return verticalSpeed
    }
  }

  newPosition(speed: number, verticalSpeed: number): Position {
    let x = Math.min(this.position.x + speed)
    let y = this.position.y + verticalSpeed

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
      height: this.height,
      ratio: this.ratio
    }
  }

  draw() {
    // draw image with border radius
    // https://stackoverflow.com/questions/4882354/rounded-corners-on-images-in-canvas
    this.game.drawer.drawSprite(this.body.toDrawRef(this.coordinate))
    this.arms.draw()
    this.legs.draw()
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
