import type {GameContext} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {OpossumSprite3} from "@/components/game/opossum/OpossumSprite3";
import {GenericOpossum} from "@/components/game/opossum/GenericOpossum";
import {AnimatedSprite, type SpritePointer} from "@/components/game/common/AnimatedSprite";

export class Opossum3 extends GenericOpossum{
  private leftDirection: boolean
  private frame = 3

  constructor(game: GameContext, position: Position) {
    super(
        game,
        new AnimatedSprite(OpossumSprite3, { row: 0, frame: 3 }),
        position
    )
    this.leftDirection = false
  }

  nextFrame(): SpritePointer {
    if (this.sprite.isFirstFrame) {
      this.leftDirection = false
    }
    if (this.sprite.isLastFrame) {
      this.leftDirection = true
    }
    if (this.leftDirection) {
      this.frame--
    } else {
      this.frame++
    }
    return {
      row: this.sprite.row,
      frame: this.frame
    }
  }
}
