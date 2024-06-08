import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/common/Draw'
import fantasyBrightSky from '../../assets/background/fantasy-bright/sky.png'
import fantasyBrightJungle from '../../assets/background/fantasy-bright/jungle_bg.png'
import fantasyBrightTreeBrushes from '../../assets/background/fantasy-bright/trees&bushes.png'
import fantasyBrightGrasses from '../../assets/background/fantasy-bright/grasses.png'
import fantasyBrightLianas from '../../assets/background/fantasy-bright/lianas.png'
import fantasyBrightGrassRoad from '../../assets/background/fantasy-bright/grass&road.png'
import fantasyBrightFireFlys from '../../assets/background/fantasy-bright/fireflys.png'
import fantasyBrightTreeFace from '../../assets/background/fantasy-bright/tree_face.png'
import forestBackground from '../../assets/background/forest/parallax/0_Background.png'
import forestTreesBackground from '../../assets/background/forest/parallax/1_Trees Background.png'
import forestTrees1 from '../../assets/background/forest/parallax/2_Trees.png'
import forestTrees2 from '../../assets/background/forest/parallax/3_Trees.png'
import forestTrees3 from '../../assets/background/forest/parallax/4_Trees.png'
import forestFloor from '../../assets/background/forest/parallax/5_Floor Platform.png'
import forestSimple1 from '../../assets/background/forest-simple/bg1/Vrstva 2.png'
import forestSimple2 from '../../assets/background/forest-simple/bg1/Vrstva 3.png'
import forestSimple3 from '../../assets/background/forest-simple/bg1/Vrstva 5.png'
import forestSimple4 from '../../assets/background/forest-simple/bg1/Vrstva 6.png'
import forestComplexSky from '../../assets/background/forest-complex/forest/sky (z -3).png'
import forestComplexBg1 from '../../assets/background/forest-complex/forest/bg_1 (z -1).png'
import forestComplexBg2 from '../../assets/background/forest-complex/forest/bg_2 (z -2).png'
import forestComplexMiddlePlus from '../../assets/background/forest-complex/forest/middleplus (z 1).png'
import forestComplexMiddleGround from '../../assets/background/forest-complex/forest/middleground (z 0).png'
import forestComplexForeground from '../../assets/background/forest-complex/forest/foreground (z 2).png'
import julienBg1 from '../../assets/background/julien/bg1.png'
import julienBg2 from '../../assets/background/julien/bg2.png'
import julienBg3 from '../../assets/background/julien/bg3.png'
import {FrameRate} from '@/components/game/common/FrameRate'

type LayerImage = {
  img: any
  speedModifier: number
}

function layerImage(source: any, speedModifier: number): LayerImage {
  const img = new Image()
  img.src = source
  return { img, speedModifier }
}



const fantasyBright: LayerImage[] = [
  layerImage(fantasyBrightSky, 0),
  layerImage(fantasyBrightJungle, 0.2),
  layerImage(fantasyBrightTreeBrushes, 0.4),
  layerImage(fantasyBrightGrasses, 0.6),
  layerImage(fantasyBrightLianas, 0.8),
  layerImage(fantasyBrightGrassRoad, 1),
  layerImage(fantasyBrightFireFlys, 1.2),
  layerImage(fantasyBrightTreeFace, 1),
]

const forestSimple: LayerImage[] = [
  layerImage(forestSimple4, 0.2),
  layerImage(forestSimple3, 0.4),
  layerImage(forestSimple2, 0.6),
  layerImage(forestSimple1, 0.8),
]

const julienForest: LayerImage[] = [
  layerImage(julienBg3, 0.4),
  layerImage(julienBg2, 0.6),
  layerImage(julienBg1, 0.8),
]



// different width calculation
const forest: LayerImage[] = [
  layerImage(forestBackground, 0),
  layerImage(forestTreesBackground, 0.2),
  layerImage(forestTrees1, 0.4),
  layerImage(forestTrees2, 0.6),
  layerImage(forestTrees3, 0.8),
  layerImage(forestFloor, 1),
]

// different width calculation
const forestComplex: LayerImage[] = [
  layerImage(forestComplexSky, 0.2),
  layerImage(forestComplexBg1, 0.4),
  layerImage(forestComplexBg2, 0.6),
  layerImage(forestComplexMiddlePlus, 0.8),
  layerImage(forestComplexMiddleGround, 1),
  layerImage(forestComplexForeground, 1.2),
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
    this.frameRate = new FrameRate(60)
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
