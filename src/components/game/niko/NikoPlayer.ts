import type {
  DisplayCoordinate,
  DisplayedObject,
  InputController,
  Movement,
  MovingElement,
  PuppetHandler
} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {FrameRate} from '@/components/game/common/FrameRate'
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {NikoBodyRef, NikoSprite} from "@/components/game/niko/NikoSprite";
import Config from "@/components/game/Config";
import {NikoArms} from "@/components/game/niko/NikoArms";
import {NikoLegs} from "@/components/game/niko/NikoLegs";
import {NikoHead} from "@/components/game/niko/NikoHead";

export class NikoPlayer implements DisplayedObject, MovingElement {
  private readonly game: PuppetHandler
  private position: Position
  private body: AnimatedSprite
  private ratio: number
  protected movement: Movement
  private frameRate: FrameRate
  private arms: NikoArms
  private legs: NikoLegs
  private head: NikoHead

  constructor(game: PuppetHandler) {
    this.game = game
    this.body = new AnimatedSprite(NikoSprite, NikoBodyRef)
    //this.ratio = (this.game.ctx.canvas.width / 4) / this.game.ctx.canvas.width
    this.ratio = 3
    this.position = new Position((game.ctx.canvas.width / 2) - (this.width / 2), game.ctx.canvas.height - this.height)
    this.frameRate = new FrameRate(Config.frameRate)
    this.movement = {
      xSpeed: 0,
      ySpeed: 0
    }

    this.arms = new NikoArms(game, this)
    this.legs = new NikoLegs(game, this)
    this.head = new NikoHead(game, this)
  }

  get width(): number {
    return this.body.sw / this.ratio
  }

  get height(): number {
    return this.body.sh / this.ratio
  }

  private computeSpeed(input: InputController, movement: Movement) {
    let { xSpeed, ySpeed } = movement
    if (input.moveRight()) {
      xSpeed = Math.min(xSpeed + 1, Config.playerXSpeed)
    } else if (input.moveLeft()) {
      xSpeed = Math.max(xSpeed - 1, -Config.playerXSpeed)
    } else {
      if (xSpeed > 0) {
        xSpeed = Math.max(xSpeed - 1, 0)
      } else {
        xSpeed = Math.min(xSpeed + 1, 0)
      }
    }

    if (input.moveUp()) {
      ySpeed -= Config.playerYSpeed
    } else if (input.moveDown()) {
      ySpeed += Config.playerYSpeed
    } else {
      ySpeed = 0
    }

    ySpeed = this.applyGravity(ySpeed)
    return { xSpeed, ySpeed }
  }

  update(deltaTime: number, input: InputController) {
    this.movement = this.computeSpeed(input, this.movement)
    this.position = this.newPosition(this.movement)

    // if (!this.onGround) {
    //   this.verticalSpeed += this.weight
    // } else {
    //   this.verticalSpeed = 0
    // }

    // is there a collision

    this.frameRate.onUpdate(deltaTime, () => {
    })

    this.arms.update(deltaTime, input)
    this.legs.update(deltaTime, input)
    this.head.update(deltaTime, input)
  }

  private applyGravity(verticalSpeed: number): number {
    if (!this.onGround) {
      return verticalSpeed + Config.gravity
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
