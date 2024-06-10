import type {
    DisplayCoordinate,
    DisplayedObject, InputController,
    ObjectAnimation,
    PositionedElement,
    PuppetHandler
} from "@/components/game/common/Draw";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {FrameRate} from "@/components/game/common/FrameRate";
import {NikoSprite} from "@/components/game/niko/NikoSprite";
import Config from "@/components/game/Config";
import {RandomUpDownAnimation} from "@/components/game/common/RandomUpDownAnimation";
import {AlternateAnimation} from "@/components/game/common/AlternateAnimation";
import {WaitAnimation} from "@/components/game/common/WaitAnimation";

export class NikoHead implements DisplayedObject {
    private readonly game: PuppetHandler
    private readonly parent: PositionedElement
    private sprite: AnimatedSprite
    private frameRate: FrameRate
    private animation: ObjectAnimation

    mustDelete: boolean;

    constructor(game: PuppetHandler, parent: PositionedElement) {
        this.game = game;
        this.parent = parent;
        this.sprite = new AnimatedSprite(NikoSprite, { row: 3, frame: 0 })
        this.frameRate = new FrameRate(Config.frameRate * 2)
        this.animation = new AlternateAnimation([
            () => new RandomUpDownAnimation( 3, 0),
            () => new WaitAnimation(5),
            () => new RandomUpDownAnimation( 5, 4),
            () => new WaitAnimation(2),
            () => new RandomUpDownAnimation( 5, 3),
            () => new WaitAnimation(7),
            () => new RandomUpDownAnimation( 5, 5),
        ])
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