import type {InputController, ObjectAnimation, GameContext} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {LeftRightAnimation} from '@/components/game/common/LeftRightAnimation'
import {OpossumSprite1} from "@/components/game/opossum/OpossumSprite1";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {GenericOpossum} from "@/components/game/opossum/GenericOpossum";
import {AlternateAnimation} from "@/components/game/common/AlternateAnimation";

export class Opossum1 extends GenericOpossum {
  private animation: ObjectAnimation

  constructor(game: GameContext) {
    super(
        game,
        new AnimatedSprite(OpossumSprite1, { row: 0, frame: 3 }),
        new Position(game.ctx.canvas.width / 2 - 40, game.ctx.canvas.height / 2 - 200)
    )
    this.animation = new AlternateAnimation([
      () => new LeftRightAnimation(0, 7, 3, 4),
      () => new LeftRightAnimation(1, 5, 0, 2)
    ])
  }

  nextFrame(input: InputController) {
    return this.animation.update(input)
  }
}
