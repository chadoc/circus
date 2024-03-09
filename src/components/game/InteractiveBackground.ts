import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/Draw'
import layerImg1 from '../../assets/background/fantasy-bright/sky.png'
import layerImg2 from '../../assets/background/fantasy-bright/jungle_bg.png'
import layerImg3 from '../../assets/background/fantasy-bright/trees&bushes.png'
import layerImg4 from '../../assets/background/fantasy-bright/grasses.png'
import layerImg5 from '../../assets/background/fantasy-bright/lianas.png'
import layerImg6 from '../../assets/background/fantasy-bright/grass&road.png'
import layerImg7 from '../../assets/background/fantasy-bright/fireflys.png'
import layerImg8 from '../../assets/background/fantasy-bright/tree_face.png'
import {FrameRate} from '@/components/game/FrameRate'

type LayerImage = {
  img: any
  speedModifier: number
}

function layerImage(source: any, speedModifier: number): LayerImage {
  const img = new Image()
  img.src = source
  return { img, speedModifier }
}

const layerImages: LayerImage[] = [
  layerImage(layerImg1, 0),
  layerImage(layerImg2, 0.2),
  layerImage(layerImg3, 0.4),
  layerImage(layerImg4, 0.6),
  layerImage(layerImg5, 0.8),
  layerImage(layerImg6, 1),
  layerImage(layerImg7, 1.2),
  layerImage(layerImg8, 1),
]

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
    this.frameRate = new FrameRate(60)
    this.backgroundSpeed = 10
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
  private readonly layers: BackgroundLayer[]

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
