export interface DisplayedObject {
  update(deltaTime: number)
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
