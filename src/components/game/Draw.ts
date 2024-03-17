export interface DisplayedObject {
  update(deltaTime: number, input: InputController): void
  draw(): void
  mustDelete: boolean
  source: any
}

export interface PuppetHandler {
  miss(): void
  ctx: CanvasRenderingContext2D
  collisionCtx: CanvasRenderingContext2D
}

export interface InputController {
  hasKey(key: string): boolean
  hasOneOf(...keys: string[]): boolean
}

export type DisplayCoordinate = {
  x: number
  y: number
  width: number
  height: number
}
