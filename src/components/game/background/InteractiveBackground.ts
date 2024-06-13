import type {DisplayCoordinate, DisplayedObject, InputController, GameContext} from '@/components/game/common/Draw'
import julienBg1 from '../../../assets/background/julien/bg1.png'
import julienBg2 from '../../../assets/background/julien/bg2.png'
import julienBg3 from '../../../assets/background/julien/bg3.png'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from "@/components/game/Config";
import {moveX, Position} from "@/components/game/common/Draw";

type LayerImage = {
  img: any
  speedModifier: number
}

function layerImage(source: any, speedModifier: number): LayerImage {
  const img = new Image()
  img.src = source
  return { img, speedModifier }
}


const julienForest: LayerImage[] = [
  layerImage(julienBg3, 0.4),
  layerImage(julienBg2, 0.6),
  layerImage(julienBg1, 0.8),
]


const layerImages: LayerImage[] = julienForest

class InteractiveBackgroundLayer implements DisplayedObject {
  private readonly game: GameContext
  private readonly image: any

  private position: Position
  private speed: number
  private backgroundSpeed: number
  private layerSpeed: number
  private speedModifier: number

  private frameRate: FrameRate

  constructor(game: GameContext, image: any, speedModifier: number) {
    this.game = game
    this.image = image
    this.position = new Position(0, 0)
    this.frameRate = new FrameRate(Config.frameRate)
    this.backgroundSpeed = 25
    this.speedModifier = speedModifier
    this.layerSpeed = this.backgroundSpeed * this.speedModifier
    this.speed = 0
  }

  get width(): number {
    return this.game.ctx.canvas.width
  }

  get height(): number {
    return this.game.ctx.canvas.height
  }

  get coordinates(): DisplayCoordinate {
    return this.computeCoordinates(0)
  }

  get leftCoordinates(): DisplayCoordinate {
    return this.computeCoordinates(-this.width)
  }

  get rightCoordinates(): DisplayCoordinate {
    return this.computeCoordinates(this.width)
  }

  computeCoordinates(xShift: number): DisplayCoordinate {
    return {
      x: this.position.x + xShift,
      y: this.position.y,
      width: this.width,
      height: this.height
    }
  }

  update(deltaTime: number, input: InputController) {
    if (input.moveRight()) {
      this.speed = this.layerSpeed
    } else if (input.moveLeft()) {
      this.speed = -this.layerSpeed
    } else {
      this.speed = 0
    }

    this.frameRate.onUpdate(deltaTime, () => {
      // compute also to add image on left
      this.position = moveX(this.coordinates, this.speed)
    })
  }

  draw() {
    this.game.drawer.drawImage(this.image, this.leftCoordinates)
    this.game.drawer.drawImage(this.image, this.coordinates)
    this.game.drawer.drawImage(this.image, this.rightCoordinates)
  }

  get mustDelete(): boolean {
    return false
  }

}

class BackgroundLimit {
  private readonly game: GameContext
  private position: Position
  private width: number
  private height: number
  private speed: number
  private backgroundSpeed: number

  private frameRate: FrameRate

  constructor(game: GameContext) {
    this.game = game
    this.width = game.ctx.canvas.width
    this.height = game.ctx.canvas.height
    this.position = new Position(0, 0)
    this.frameRate = new FrameRate(Config.frameRate)
    this.backgroundSpeed = 25
    this.speed = 0
  }

  get coordinates(): DisplayCoordinate {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    }
  }

  update(deltaTime: number, input: InputController) {
    if (input.moveRight()) {
      this.speed = this.backgroundSpeed
    } else if (input.moveLeft()) {
      this.speed = -this.backgroundSpeed
    } else {
      this.speed = 0
    }

    this.frameRate.onUpdate(deltaTime, () => {
      // compute also to add image on left
      this.position = {
        x: Math.floor(this.position.x - this.speed),
        y: this.position.y
      }
    })
  }

  shouldStopMove(input: InputController): boolean {
    return this.shouldStopMovingLeft(input) || this.shouldStopMovingRight(input)
  }

  shouldStopMovingLeft(input: InputController): boolean {
    return input.moveLeft() && this.leftLimitReached
  }

  shouldStopMovingRight(input: InputController): boolean {
    return input.moveRight() && this.rightLimitReached
  }

  get leftLimitReached(): boolean {
    return this.position.x >= (this.width)
  }

  get rightLimitReached(): boolean {
    return this.position.x <= -(this.width)
  }
}

export class InteractiveBackground implements DisplayedObject {
  private readonly game: GameContext
  private readonly layers: InteractiveBackgroundLayer[]
  readonly limit: BackgroundLimit

  constructor(game: GameContext) {
    this.game = game
    this.layers = layerImages.map(({ img, speedModifier }) => new InteractiveBackgroundLayer(game, img, speedModifier))
    this.limit = new BackgroundLimit(game)
  }

  get mustDelete(): boolean {
    return false
  }

  update(deltaTime: number, input: InputController) {
    this.layers.forEach(layer => layer.update(deltaTime, input))
    this.limit.update(deltaTime, input)
  }

  draw() {
    this.layers.forEach(layer => layer.draw())
  }
}
