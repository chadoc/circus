import type {DisplayedObject, InputController, GameContext, DisplayCoordinate} from '@/components/game/common/Draw'
import {DrawContext, Position} from '@/components/game/common/Draw'
import {Puppet} from '@/components/game/Puppet'
import {Cloud} from '@/components/game/Cloud'
import {InteractiveBackground} from '@/components/game/background/InteractiveBackground'
import {Opossum1} from '@/components/game/opossum/Opossum1'
import {Opossum2} from '@/components/game/opossum/Opossum2'
import {Opossum3} from '@/components/game/opossum/Opossum3'
import {SpeechBubble} from '@/components/game/opossum/SpeechBubble'
import type {GenericOpossum} from '@/components/game/opossum/GenericOpossum'
import {NikoPlayer} from '@/components/game/niko/NikoPlayer'
import Config from '@/components/game/Config'
import {BubbleParticule} from '@/components/game/niko/BubbleParticule'
import {Fumigene} from "@/components/game/end/Fumigene";

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
      return false
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
  moveLeft(): boolean {
    return this.hasOneOf(...Config.leftKeys)
  }
  moveRight(): boolean {
    return this.hasOneOf(...Config.rightKeys)
  }
  moveUp(): boolean {
    return this.hasOneOf(...Config.upKeys)
  }
  moveDown(): boolean {
    return this.hasOneOf(...Config.downKeys)
  }
}

export class Game implements GameContext {
  readonly drawer: DrawContext
  readonly collisionDrawer: DrawContext
  private opossums: GenericOpossum[] = []
  private animations: DisplayedObject[] = []
  private fumigenes : DisplayedObject[] = []
  //private player: Player
  readonly player: NikoPlayer
  //private ship: PlayerShip
  readonly background: InteractiveBackground
  private readonly level = new Level()
  private readonly input: InputHandler
  private readonly started = new Date().getTime()

  constructor(ctx: CanvasRenderingContext2D, collisionCtx: CanvasRenderingContext2D) {
    this.drawer = new DrawContext(ctx)
    this.collisionDrawer = new DrawContext(collisionCtx)
    this.input = new InputHandler()
    //this.player = new Player(this)
    this.player = new NikoPlayer(this)
    //this.ship = new PlayerShip(this, userImg)
    this.background = new InteractiveBackground(this)
    //this.ctx.canvas.addEventListener('click', (e) => this.click(e))
    this.ctx.font = '50px Impact'

    window.addEventListener('resize', () => this.computeCanvasWidth())
    window.addEventListener('orientationchange', () => this.computeCanvasWidth())

    setTimeout(() => this.computeCanvasWidth(), 200)
  }

  computeCanvasWidth() {
    const w = window.innerWidth
    const h = w * (9 / 16)
    this.ctx.canvas.width = w
    this.ctx.canvas.height = h
    this.collisionCtx.canvas.width = w
    this.collisionCtx.canvas.height = h
    window.dispatchEvent(new CustomEvent('game-resized', {}))
  }

  miss() {
    this.level.miss()
  }

  private get drawOrder() {
    return [
      ...[this.background],
      ...this.opossums,
      ...[this.player],
      ...this.animations,
      ...this.fumigenes
    ]
  }

  private get envObjects() {
    return [
      ...[this.background],
      ...this.opossums,
      ...this.animations,
    ]
  }

  private get allObjects() {
    return [
      ...this.envObjects,
      ...[this.player]
      //...[this.ship]
    ]
  }

  private addAnimation(animation: DisplayedObject) {
    this.animations.push(animation);
  }

  get shouldFinishGame(): boolean {
    return ((new Date().getTime() - this.started) / 1000) > Config.gameDuration
  }

  update(deltaTime: number) {
    this.animations = this.animations.filter(a => !a.mustDelete)

    if (this.fumigenes.length == 0 && this.shouldFinishGame) {
      this.fumigenes.push(new Fumigene(this, 0))
    }

    if (this.opossums.length == 0) {
      this.opossums.push(new Opossum1(this, 738, -100))
      this.opossums.push(new Opossum2(this, -172, -300))
      this.opossums.push(new Opossum3(this, -724, 200))
      this.opossums.push(new Opossum1(this, -1657, -350))
      this.opossums.push(new Opossum2(this, -2088, 150))
      this.opossums.push(new Opossum3(this, 1680, -400))
       // this.animations.push(new SpeechBubble(this, 300, 300, 300))
      // this.opossums.push(new Opossum(this))
    }

    this.opossums.forEach(opossum => {
      const op = opossum.coordinate
      const player = this.player.coordinate
      if (player.x > op.x + op.width ||
        player.x + player.width < op.x ||
        player.y > op.y + op.height ||
        player.y + player.height < op.y) {
        // no collision
      } else {
        if (!this.animations.some(a => a.source === opossum)) {
          this.addAnimation(new SpeechBubble(this, opossum, 300))
        }
      }
    })

    if (!this.background.limit.shouldStopMove(this.input)) {
      this.envObjects.forEach(o => o.update(deltaTime, this.input))
    }
    this.player.update(deltaTime, this.input)
    this.fumigenes.forEach(f => f.update(deltaTime, this.input))
  }

  draw() {
    if (this.level.isGameOver) {
      this.drawGameOver()
      return
    }
    this.drawOrder.forEach(o => o.draw())
    // this.drawScore()
  }

  get isGameOver() {
    return this.level.isGameOver
  }

  get ctx() {
    return this.drawer.ctx
  }

  get collisionCtx() {
    return this.collisionDrawer.ctx
  }

  cw(scale: number): number {
    return this.ctx.canvas.width * scale
  }

  ch(scale: number): number {
    return this.ctx.canvas.height * scale
  }

  center(width: number, height: number): Position {
    return new Position(
        (this.ctx.canvas.width / 2) - (width / 2),
        (this.ctx.canvas.height / 2) - (height / 2)
    )
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

export function triggerGame(canvas: HTMLCanvasElement, collisionCanvas: HTMLCanvasElement): Game {
  const ctx = canvas.getContext('2d')!
  const collisionCtx = collisionCanvas.getContext('2d')!

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

  return game
}
