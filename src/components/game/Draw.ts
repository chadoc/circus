export interface DisplayedObject {
  update(deltaTime: number, input: InputController): void
  draw(): void
  mustDelete: boolean
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
