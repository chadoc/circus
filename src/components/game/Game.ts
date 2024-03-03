import type {DisplayedObject, InputController, PuppetHandler} from '@/components/game/Draw'
import {Puppet} from '@/components/game/Puppet'
import {Cloud} from '@/components/game/Cloud'
import {Player} from '@/components/game/Player'
import {Background} from '@/components/game/Background'

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
  constructor() {
    window.addEventListener('keydown', ({ key }: KeyboardEvent) => {
      if (this.supportedKeys.includes(key) && !this.hasKey(key)) {
        this.keys.push(key)
      }
    })
    window.addEventListener('keyup', ({ key }: KeyboardEvent) => {
      if (this.supportedKeys.includes(key)) {
        this.keys.splice(this.keys.indexOf(key), 1)
      }
    })

  }
  hasKey(key: string): boolean {
    return this.keys.includes(key)
  }
}

class Game implements PuppetHandler {
  readonly ctx: CanvasRenderingContext2D
  readonly collisionCtx: CanvasRenderingContext2D
  private puppets: Puppet[] = []
  private animations: DisplayedObject[] = []
  private player: Player
  private background: Background
  private readonly level = new Level()
  private readonly input: InputHandler

  constructor(ctx: CanvasRenderingContext2D, collisionCtx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.collisionCtx = collisionCtx
    ctx.canvas.addEventListener('click', (e) => this.click(e))
    ctx.font = '50px Impact'
    this.input = new InputHandler()
    this.player = new Player(this)
    this.background = new Background(this)
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
      ...[this.player]
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
    this.player.draw()
    this.drawScore()
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
}

export function triggerGame(canvas: HTMLCanvasElement, collisionCanvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  const collisionCtx = collisionCanvas.getContext('2d')

  const game = new Game(ctx, collisionCtx)

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
}
