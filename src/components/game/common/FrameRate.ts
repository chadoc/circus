export class FrameRate {
  private timeSinceUpdate: number = 0
  private updateInterval: number

  constructor(updateInterval: number) {
    this.updateInterval = updateInterval
  }

  onUpdate(deltaTime: number, update: () => void)  {
    this.timeSinceUpdate += deltaTime
    if (this.timeSinceUpdate > this.updateInterval) {
      this.timeSinceUpdate = 0
      update()
    }
  }
}
