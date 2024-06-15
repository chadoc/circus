import type {AnimationSprite, SpriteDrawReference, SpritePointer} from "@/components/game/common/AnimatedSprite";
import type {InteractiveBackground} from "@/components/game/background/InteractiveBackground";

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

export interface GameContext {
  miss(): void
  drawer: DrawContext
  collisionDrawer: DrawContext
  ctx: CanvasRenderingContext2D
  collisionCtx: CanvasRenderingContext2D
  cw(scale: number): number
  ch(scale: number): number
  center(width: number, height: number): Position
  background: InteractiveBackground
}

export interface InputController {
  hasKey(key: string): boolean
  hasOneOf(...keys: string[]): boolean
  moveLeft(): boolean
  moveRight(): boolean
  moveUp(): boolean
  moveDown(): boolean
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
}

export type Movement = {
  xSpeed: number
  ySpeed: number
}

export interface PositionedElement {
  coordinate: DisplayCoordinate
}

export interface MovingElement extends PositionedElement {
  movement: Movement
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
  update(input: InputController): SpritePointer
  isFinished(): boolean
}

