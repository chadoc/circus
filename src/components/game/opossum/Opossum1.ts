import type {PuppetHandler} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import type {ObjectAnimation} from '@/components/game/common/LeftRightAnimation'
import {LeftRightAnimation} from '@/components/game/common/LeftRightAnimation'
import {OpossumSprite1} from "@/components/game/opossum/OpossumSprite1";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {GenericOpossum} from "@/components/game/opossum/GenericOpossum";

export class Opossum1 extends GenericOpossum {
  private leftDirection: boolean
  private animation: ObjectAnimation
  private balanceAnimation: boolean = true

  constructor(game: PuppetHandler) {
    super(
        game,
        new AnimatedSprite(OpossumSprite1, { row: 0, frame: 3 }),
        new Position(game.ctx.canvas.width / 2 - 40, game.ctx.canvas.height / 2 - 200)
    )
    this.leftDirection = false
    this.animation = new LeftRightAnimation(0, 7, 3, 4)
  }

  nextFrame() {
    if (this.animation.isFinished()) {
      if (this.balanceAnimation) {
        this.animation = new LeftRightAnimation(1, 5, 0, 2)
        this.balanceAnimation = false
      } else {
        this.animation = new LeftRightAnimation(0, 7, 3, 4)
        this.balanceAnimation = true
      }
    }
    this.animation.update()
    return {
      row: this.animation.spriteRow(),
      frame: this.animation.currentFrame()
    }
  }
}
