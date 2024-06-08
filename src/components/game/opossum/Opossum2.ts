import type {PuppetHandler} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import type {ObjectAnimation} from '@/components/game/common/LeftRightAnimation'
import {LeftRightAnimation} from '@/components/game/common/LeftRightAnimation'
import {OpossumSprite2} from "@/components/game/opossum/OpossumSprite2";
import {GenericOpossum} from "@/components/game/opossum/GenericOpossum";
import {AnimatedSprite, type SpritePointer} from "@/components/game/common/AnimatedSprite";

export class Opossum2 extends GenericOpossum {
  private leftDirection: boolean
  private animation: ObjectAnimation
  private balanceAnimation: boolean = true

  constructor(game: PuppetHandler) {
    super(game, new AnimatedSprite(OpossumSprite2, { row: 0, frame: 3 }), new Position(game.ctx.canvas.width / 2 - 506, game.ctx.canvas.height / 2 - 100))
    this.leftDirection = false
    this.animation = new LeftRightAnimation(0, 7, 3, 4)
  }

  nextFrame(): SpritePointer {
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
