import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/common/Draw'
import julienBg1 from '../../../assets/background/julien/bg1.png'
import julienBg2 from '../../../assets/background/julien/bg2.png'
import julienBg3 from '../../../assets/background/julien/bg3.png'
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from "@/components/game/Config";

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
  private readonly game: PuppetHandler
  private readonly image: any

  private x: number
  private y: number
  private width: number
  private height: number
  private speed: number
  private backgroundSpeed: number
  private layerSpeed: number
  private speedModifier: number

  private frameRate: FrameRate

  constructor(game: PuppetHandler, image: any, speedModifier: number) {
    this.game = game
    this.image = image
    this.width = game.ctx.canvas.width
    this.height = game.ctx.canvas.height
    this.x = 0
    this.y = 0
    this.frameRate = new FrameRate(Config.frameRate)
    this.backgroundSpeed = 25
    this.speedModifier = speedModifier
    this.layerSpeed = this.backgroundSpeed * this.speedModifier
    this.speed = 0
  }

  update(deltaTime: number, input: InputController) {
    if (input.hasOneOf('ArrowRight', 'SwipeRight')) {
      this.speed = this.layerSpeed
    } else if (input.hasOneOf('ArrowLeft', 'SwipeLeft')) {
      this.speed = -this.layerSpeed
    } else {
      this.speed = 0
    }

    this.frameRate.onUpdate(deltaTime, () => {
      // compute also to add image on left
      if (this.x <= -this.width) {
        this.x = 0
      }
      this.x = Math.floor(this.x - this.speed)
    })
  }

  draw() {
    this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    this.game.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
  }

  get mustDelete(): boolean {
    return false
  }

}

export class InteractiveBackground implements DisplayedObject {
  private readonly game: PuppetHandler
  private readonly layers: InteractiveBackgroundLayer[]

  constructor(game: PuppetHandler) {
    this.game = game
    this.layers = layerImages.map(({ img, speedModifier }) => new InteractiveBackgroundLayer(game, img, speedModifier))
  }

  get mustDelete(): boolean {
    return false
  }

  update(deltaTime: number, input: InputController) {
    this.layers.forEach(layer => layer.update(deltaTime, input))
  }

  draw() {
    this.layers.forEach(layer => layer.draw())
  }

}
