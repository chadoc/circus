import type {DisplayCoordinate, DisplayedObject, InputController, GameContext} from '@/components/game/common/Draw'
import ImagePlane from '../../assets/plane/shipPlane.png'
import ImageWindow from '../../assets/plane/shipWindow.png'
import ImageUser from '../../assets/plane/julien.webp'
import {FrameRate} from '@/components/game/common/FrameRate'

const imgPlane = new Image()
imgPlane.src = ImagePlane
const imgWindow= new Image()
imgWindow.src = ImageWindow
// imgWindow.style.opacity = 0.4

const imageWidth = 900
const imageHeight = 963

const userImageWidth = 300
const userImageHeight = 300

const userTargetWidth = 210
const userTargetHeight = 210

export class PlayerShip implements DisplayedObject {
  private readonly game: GameContext
  private userImg: any
  private x: number
  private y: number
  private userX: number
  private userY: number
  private width: number
  private height: number
  private userWidth: number
  private userHeight: number
  private widthRatio: number
  private speed: number
  private verticalSpeed: number
  private frame: number
  private spriteFrames: number

  private frameRate: FrameRate

  constructor(game: GameContext, userImg: any | undefined) {
    this.game = game
    this.userImg = new Image()
    this.userImg.src = userImg || ImageUser
    this.userImg.style.borderRadius = '50%'
    this.widthRatio = (this.game.ctx.canvas.width / 4) / this.game.ctx.canvas.width

    this.width = imageWidth * this.widthRatio
    this.height = imageHeight * this.widthRatio
    this.userWidth = userTargetWidth * this.widthRatio
    this.userHeight = userTargetHeight * this.widthRatio
    this.x = 0
    this.y = game.ctx.canvas.height - this.height

    this.userX = this.x + (((imageWidth / 2) - 160) * this.widthRatio)
    this.userY = this.y + (((imageHeight / 2) - 180) * this.widthRatio)

    this.frameRate = new FrameRate(60)

    this.frame = 0
    this.speed = 0
    this.verticalSpeed = 0
    this.spriteFrames = 1
  }

  update(deltaTime: number, input: InputController) {
    if (input.hasOneOf('ArrowRight', 'SwipeRight')) {
      this.speed = 10
    } else if (input.hasOneOf('ArrowLeft', 'SwipeLeft')) {
      this.speed = -10
    } else {
      this.speed = 0
    }

    if (input.hasOneOf('ArrowUp', 'SwipeUp')) {
      this.verticalSpeed -= 4
    } else if (input.hasOneOf('ArrowDown', 'SwipeDown')) {
      this.verticalSpeed += 4
    } else {
      this.verticalSpeed = 0
    }

    this.x += this.speed
    this.y += this.verticalSpeed

    const rightBoundary = this.game.ctx.canvas.width - this.width
    this.x = Math.min(Math.max(this.x, 0), rightBoundary)
    this.y = Math.min(Math.max(this.y, 0), this.groundHeight)

    this.userX = this.x + (((imageWidth / 2) - 160) * this.widthRatio)
    this.userY = this.y + (((imageHeight / 2) - 180) * this.widthRatio)

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
  }

  get groundHeight(): number {
    return this.game.ctx.canvas.height - this.height
  }

  get onGround(): boolean {
    return this.y >= this.groundHeight
  }

  get coordinate(): DisplayCoordinate {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      ratio: this.widthRatio
    }
  }

  draw() {
    // draw image with border radius
    // https://stackoverflow.com/questions/4882354/rounded-corners-on-images-in-canvas
    const ctx = this.game.ctx
    ctx.save()
    ctx.beginPath()
    // draw form
    // ctx.arc(this.userX + this.userWidth, this.userY + this.userHeight, this.userWidth / 2, Math.PI * 2, true)
    // ctx.arc(this.userX + this.userWidth / 2, this.userY + this.userHeight / 2, this.userWidth / 2,  2 * Math.PI, 0,  true)
    ctx.ellipse(this.userX + this.userWidth / 2, this.userY + this.userHeight / 2, this.userWidth / 2.8, this.userHeight / 2, 0,  2 * Math.PI, 0,  true)
    // ctx.stroke()
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(this.userImg, this.userX, this.userY, this.userWidth, this.userHeight)
    // ctx.drawImage(this.userImg, 0, 0, userImageWidth, userImageHeight, this.userX, this.userY, this.userWidth, this.userHeight)
    ctx.restore()


    ctx.drawImage(imgPlane, 0, 0, imageWidth, imageHeight, this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 0.4
    ctx.drawImage(imgWindow, 0, 0, imageWidth, imageHeight, this.x, this.y, this.width, this.height)
    ctx.globalAlpha = 1
  }

  get mustDelete() {
    return false
  }
}
