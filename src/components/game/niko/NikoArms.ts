import type {DisplayedObject, InputController, PositionedElement, PuppetHandler} from "@/components/game/common/Draw";
import Sprite from '../../../assets/niko/NikoMovementFull.png'
import {Position} from "@/components/game/common/Draw";
import type {AnimationSprite} from "@/components/game/common/AnimatedSprite";
import game from "@/components/Game.vue";
import type {NikoPlayer} from "@/components/game/niko/NikoPlayer";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {NikoSprite} from "@/components/game/niko/NikoSprite";
import {FrameRate} from "@/components/game/common/FrameRate";
import Config from "@/components/game/Config";

/*
 4500 x 5400
 5 columns
 6 rows
 */


/*
Arms:
row index: 1
col size: 3
 */
export class NikoArms implements DisplayedObject {
    private readonly game: PuppetHandler
    private readonly parent: PositionedElement
    private sprite: AnimatedSprite
    private frameRate: FrameRate

    mustDelete: boolean;
    source: any;

    constructor(game: PuppetHandler, parent: PositionedElement) {
        this.game = game;
        this.parent = parent;
        this.sprite = new AnimatedSprite(NikoSprite, { row: 0, frame: 0 })
        this.frameRate = new FrameRate(Config.frameRate)
    }

    get position(): Position {
        return new Position(
            this.parent.coordinate.x,
            this.parent.coordinate.y
        )
    }

    get ratio() {
        return this.parent.coordinate.ratio
    }

    draw(): void {
    }

    update(deltaTime: number, input: InputController): void {
        this.frameRate.onUpdate(deltaTime, () => {

            this.sprite.update()
        })
    }
}