export interface DisplayedObject {
  update(deltaTime: number, input: InputController)
  draw()
  mustDelete: boolean
}

export interface PuppetHandler {
  addAnimation(animation: DisplayedObject)
  win(point: number)
  miss()
  ctx: CanvasRenderingContext2D
  collisionCtx: CanvasRenderingContext2D
}

export interface InputController {
  hasKey(key: string): boolean
}
