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

export class NikoHead implements DisplayedObject {
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
        this.sprite = new AnimatedSprite(NikoSprite, { row: 3, frame: 0 })
        this.frameRate = new FrameRate(Config.frameRate * 2)
        this.animation = new RandomUpDownAnimation(this.sprite.frameCount, 2);
    }

    get coordinate(): DisplayCoordinate {
        return this.parent.coordinate
    }

    update(deltaTime: number, input: InputController): void {
        if (input.hasOneOf())

        this.frameRate.onUpdate(deltaTime, () => {
            this.sprite.update(this.animation.update())
        })
    }

    draw(): void {
        this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
}