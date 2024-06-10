import type {AnimationSprite, SpriteDrawReference} from "@/components/game/common/AnimatedSprite";

export interface DisplayedObject {
  update(deltaTime: number, input: InputController): void
  draw(): void
  mustDelete: boolean
  source?: any
}

export class DrawContext {
  readonly ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawSprite({ image, sx, sy, sw, sh, dx, dy, dw, dh } : SpriteDrawReference) {
    this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
  }

  drawImage(image: HTMLImageElement, { x, y, width, height }: DisplayCoordinate) {
    this.ctx.drawImage(image, x, y, width, height)
  }
}

export interface PuppetHandler {
  miss(): void
  drawer: DrawContext
  collisionDrawer: DrawContext
  ctx: CanvasRenderingContext2D
  collisionCtx: CanvasRenderingContext2D
}

export interface InputController {
  hasKey(key: string): boolean
  hasOneOf(...keys: string[]): boolean
}

export class Position {
  readonly x: number
  readonly y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export type DisplayCoordinate = {
  x: number
  y: number
  width: number
  height: number
  ratio: number
}

export interface PositionedElement {
  coordinate: DisplayCoordinate
}

export function moveX({ x, y, width }: DisplayCoordinate, speed: number): Position {
  let newX = x
  if (x <= -width) {
    newX = 0
  }
  newX = Math.floor(newX - speed)
  return {
    x: newX,
    y
  }
}

export interface ObjectAnimation {
  update(): void
  isFinished(): boolean
  currentFrame(): number
  spriteRow(): number
}

