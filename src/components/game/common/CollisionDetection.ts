import type {DisplayCoordinate} from '@/components/game/common/Draw'

export class CollisionDetection {
  readonly randomColors: [number, number, number]
  readonly color: string
  private readonly collisionCtx: CanvasRenderingContext2D

  constructor( collisionCtx: CanvasRenderingContext2D) {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    this.randomColors = [r, g, b]
    this.color = `rgb(${r},${g},${b})`
    this.collisionCtx = collisionCtx
  }

  isHit([r, g, b]: Uint8ClampedArray): boolean {
    const [pr, pg, pb] = this.randomColors
    if (pr === r && pg === g && pb === b) {
      return true
    } else {
      return false
    }
  }

  draw({ x, y, width, height }: DisplayCoordinate) {
    this.collisionCtx.fillStyle = this.color
    this.collisionCtx.fillRect(x, y, width, height)
  }
}
