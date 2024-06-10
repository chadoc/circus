import type {
    DisplayCoordinate,
    DisplayedObject,
    InputController, ObjectAnimation,
    PositionedElement,
    PuppetHandler
} from "@/components/game/common/Draw";
import Sprite from '../../../assets/niko/NikoMovementFull.png'
import {Position} from "@/components/game/common/Draw";
import type {AnimationSprite} from "@/components/game/common/AnimatedSprite";
import game from "@/components/Game.vue";
import type {NikoPlayer} from "@/components/game/niko/NikoPlayer";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {NikoSprite} from "@/components/game/niko/NikoSprite";
import {FrameRate} from "@/components/game/common/FrameRate";
import Config from "@/components/game/Config";
import {RandomUpDownAnimation} from "@/components/game/common/RandomUpDownAnimation";

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
    private readonly game: PuppetHandler
    private readonly parent: PositionedElement
    private sprite: AnimatedSprite
    private frameRate: FrameRate
    private animation: ObjectAnimation

    mustDelete: boolean;
    source: any;

    constructor(game: PuppetHandler, parent: PositionedElement) {
        this.game = game;
        this.parent = parent;
        this.sprite = new AnimatedSprite(NikoSprite, { row: 2, frame: 0 })
        this.frameRate = new FrameRate(Config.frameRate * 2)
        this.animation = new RandomUpDownAnimation(this.sprite.frameCount, 2);
    }

    get coordinate(): DisplayCoordinate {
        return this.parent.coordinate
    }

    update(deltaTime: number, input: InputController): void {
        this.frameRate.onUpdate(deltaTime, () => {
            this.sprite.update(this.animation.update())
        })
    }

    draw(): void {
        this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
}