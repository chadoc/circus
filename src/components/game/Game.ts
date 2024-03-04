import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/Draw'
import {Puppet} from '@/components/game/Puppet'
import {Cloud} from '@/components/game/Cloud'
import {Player} from '@/components/game/Player'
import {Background} from '@/components/game/Background'
import {PlayerShip} from '@/components/game/PlayerShip'

class Level {
  private readonly maxPuppet = 10
  private readonly puppetMissThreshold = 3
  private readonly puppetInterval = 500
  private missedPuppet = 0
  private currentScore = 0
  private timeToNextPuppet = 0

  win(point: number) {
    this.currentScore += point
  }

  get score() {
    return this.currentScore
  }

  get isGameOver() {
    return false && this.missedPuppet > this.puppetMissThreshold
  }

  miss() {
    this.missedPuppet++
  }

  shouldAddPuppet(deltaTime:number, puppetCount: number): boolean {
    this.timeToNextPuppet += deltaTime
    if (this.timeToNextPuppet > this.puppetInterval && puppetCount < this.maxPuppet) {
      this.timeToNextPuppet = 0
      return true
    } else {
      return false
    }
  }
}


class InputHandler implements InputController {
  private readonly supportedKeys: string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  private readonly keys: string[] = []
  private touchX: number
  private touchY: number
  private readonly touchThreshold = 30

  constructor() {
    this.touchX = -1
    this.touchY = -1
    window.addEventListener('keydown', ({ key }: KeyboardEvent) => {
      if (this.supportedKeys.includes(key) && !this.hasKey(key)) {
        this.keys.push(key)
      }
    })
    window.addEventListener('keyup', ({ key }: KeyboardEvent) => {
      if (this.supportedKeys.includes(key)) {
        this.removeKey(key)
      }
    })
    window.addEventListener('touchstart', (event: TouchEvent) => {
      this.touchX = event.changedTouches[0].pageX
      this.touchY = event.changedTouches[0].pageY
    })
    window.addEventListener('touchmove', (event: TouchEvent) => {
      const swipeVerticalDistance = event.changedTouches[0].pageY - this.touchY
      if (swipeVerticalDistance < -this.touchThreshold && !this.hasKey('SwipeUp')) {
        this.keys.push('SwipeUp')
      } else if (swipeVerticalDistance > this.touchThreshold && !this.hasKey('SwipeDown')) {
        this.keys.push('SwipeDown')
      }

      const swipeHorizontalDistance = event.changedTouches[0].pageX - this.touchX
      if (swipeHorizontalDistance < -this.touchThreshold && !this.hasKey('SwipeLeft')) {
        this.keys.push('SwipeLeft')
      } else if (swipeHorizontalDistance > this.touchThreshold && !this.hasKey('SwipeRight')) {
        this.keys.push('SwipeRight')
      }
    })
    window.addEventListener('touchend', (event: TouchEvent) => {
      this.removeKey('SwipeUp')
      this.removeKey('SwipeDown')
      this.removeKey('SwipeLeft')
      this.removeKey('SwipeRight')
    })
  }
  private removeKey(key: string) {
    this.keys.splice(this.keys.indexOf(key), 1)
  }
  hasKey(key: string): boolean {
    return this.keys.includes(key)
  }
  hasOneOf(...keys: string[]): boolean {
    return this.keys.some(key => keys.includes(key))
  }
}

export class Game implements PuppetHandler {
  readonly ctx: CanvasRenderingContext2D
  readonly collisionCtx: CanvasRenderingContext2D
  private puppets: Puppet[] = []
  private animations: DisplayedObject[] = []
  private player: Player
  private ship: PlayerShip
  private background: Background
  private readonly level = new Level()
  private readonly input: InputHandler

  constructor(ctx: CanvasRenderingContext2D, collisionCtx: CanvasRenderingContext2D, userImg: any) {
    this.ctx = ctx
    this.collisionCtx = collisionCtx
    this.input = new InputHandler()
    this.player = new Player(this)
    this.ship = new PlayerShip(this, userImg)
    this.background = new Background(this)
    this.ctx.canvas.addEventListener('click', (e) => this.click(e))
    this.ctx.font = '50px Impact'
  }

  click(event: MouseEvent) {
    const detectPixelColor = this.collisionCtx.getImageData(event.x, event.y, 1, 1).data
    this.puppets.forEach(puppet => {
      if (puppet.fire(detectPixelColor)) {
        // has been touched
        this.level.win(1)
        const { x, y, width } = puppet.coordinate
        this.animations.push(new Cloud(this, x, y, width))
      }
    })
  }

  miss() {
    this.level.miss()
  }

  private get allObjects() {
    return [
      ...[this.background],
      ...this.puppets,
      ...this.animations,
      // ...[this.player],
      ...[this.ship]
    ]
  }

  update(deltaTime: number) {
    this.puppets = this.puppets.filter(p => !p.mustDelete)
    this.animations = this.animations.filter(a => !a.mustDelete)

    if (this.level.shouldAddPuppet(deltaTime, this.puppets.length)) {
      this.puppets.push(new Puppet(this))
      // sort puppets by width to make sure bigger are in front
      this.puppets.sort(function(a, b) {
        return a.size - b.size
      })
    }

    this.allObjects.forEach(o => o.update(deltaTime, this.input))
  }

  draw() {
    if (this.level.isGameOver) {
      this.drawGameOver()
      return
    }
    this.allObjects.forEach(o => o.draw())
    // this.drawScore()
  }

  get isGameOver() {
    return this.level.isGameOver
  }

  private drawScore() {
    this.ctx.fillStyle = 'white'
    this.ctx.fillText('Score: ' + this.level.score, 50, 75)
  }

  private drawGameOver() {
    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = 'white'
    this.ctx.fillText(`GAME OVER, your score is ${this.level.score}`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)
  }

  async toggleFullScreen() {
    if (!document.fullscreenElement) {
      try {
        await this.ctx.canvas.requestFullscreen()
      } catch (error) {
        console.error('Not able to enable full screen', error)
      }
    }
  }
}

export function triggerGame(canvas: HTMLCanvasElement, collisionCanvas: HTMLCanvasElement, userImg: any): Game {
  const ctx = canvas.getContext('2d')!
  const collisionCtx = collisionCanvas.getContext('2d')!

  const game = new Game(ctx, collisionCtx, userImg)

  let lastTime = 1
  function animate(timestamp: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height)

    const deltaTime = timestamp - lastTime
    lastTime = timestamp

    game.update(deltaTime)
    game.draw()

    if (!game.isGameOver) {
      requestAnimationFrame(animate)
    }
  }

  animate(0)

  return game
}
