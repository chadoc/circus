import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/Draw'
import clouds1 from '../../assets/background/cloud/clouds1/1.png'
import clouds2 from '../../assets/background/cloud/clouds1/2.png'
import clouds3 from '../../assets/background/cloud/clouds1/3.png'
import clouds4 from '../../assets/background/cloud/clouds1/4.png'

const img1 = new Image()
img1.src = clouds1
const img2 = new Image()
img2.src = clouds2
const img3 = new Image()
img3.src = clouds3
const img4 = new Image()
img4.src = clouds4

class BackgroundLayer implements DisplayedObject {
  private readonly game: PuppetHandler
  private readonly image: any

  private x: number
  private y: number
  private width: number
  private height: number
  private speedModifier: number
  private speed: number
  private gameSpeed: number

  private timeSinceUpdate: number
  private updateInterval: number

  constructor(game: PuppetHandler, image: any, speedModifier: number) {
    this.game = game
    this.image = image
    this.width = game.ctx.canvas.width
    this.height = game.ctx.canvas.height
    this.x = 0
    this.y = 0
    this.speedModifier = speedModifier
    this.timeSinceUpdate = 0
    this.updateInterval = 60
    this.gameSpeed = 20
    this.speed = this.gameSpeed * speedModifier
  }

  update(deltaTime: number, input: InputController) {
    this.timeSinceUpdate += deltaTime
    if (this.timeSinceUpdate > this.updateInterval) {
      this.timeSinceUpdate = 0
      if (this.x <= -this.width) {
        this.x = 0
      }
      this.x = Math.floor(this.x - this.speed)
    }
  }

  draw() {
    this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    this.game.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
  }

  get mustDelete(): boolean {
    return false
  }

}

export class Background implements DisplayedObject {
  private readonly game: PuppetHandler
  private readonly layers: BackgroundLayer[]

  constructor(game: PuppetHandler) {
    this.game = game
    this.layers = [
      new BackgroundLayer(game, img1, 0),
      new BackgroundLayer(game, img2, 0.5),
      new BackgroundLayer(game, img3, 0.8),
      new BackgroundLayer(game, img4, 1)
    ]
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
