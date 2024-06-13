import type {
    DisplayCoordinate,
    DisplayedObject,
    InputController,
    MovingElement,
    ObjectAnimation,
    PositionedElement,
    GameContext
} from "@/components/game/common/Draw";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {NikoSprite} from "@/components/game/niko/NikoSprite";
import {FrameRate} from "@/components/game/common/FrameRate";
import Config from "@/components/game/Config";
import {MovingUpAnimation} from "@/components/game/common/MovingUpAnimation";

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
export class NikoLegs implements DisplayedObject {
    private readonly game: GameContext
    private readonly parent: PositionedElement
    private sprite: AnimatedSprite
    private frameRate: FrameRate
    private animation: ObjectAnimation

    mustDelete: boolean;
    source: any;

    constructor(game: GameContext, parent: MovingElement) {
        this.game = game;
        this.parent = parent;
        this.sprite = new AnimatedSprite(NikoSprite, { row: 2, frame: 0 })
        this.frameRate = new FrameRate(Config.frameRate * 2)
        this.animation = new MovingUpAnimation(parent, this.sprite.frameCount, false, this.sprite.row);
    }

    get coordinate(): DisplayCoordinate {
        return this.parent.coordinate
    }

    update(deltaTime: number, input: InputController): void {
        this.frameRate.onUpdate(deltaTime, () => {
            this.sprite.update(this.animation.update(input))
        })
    }

    draw(): void {
        this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
}