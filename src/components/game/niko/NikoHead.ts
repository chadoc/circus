import type {
    DisplayCoordinate,
    DisplayedObject, InputController,
    ObjectAnimation,
    PositionedElement,
    GameContext
} from "@/components/game/common/Draw";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {FrameRate} from "@/components/game/common/FrameRate";
import {NikoSprite} from "@/components/game/niko/NikoSprite";
import Config from "@/components/game/Config";
import {RandomUpDownAnimation} from "@/components/game/common/RandomUpDownAnimation";
import {AlternateAnimation} from "@/components/game/common/AlternateAnimation";
import {WaitAnimation} from "@/components/game/common/WaitAnimation";
import {randomize} from "@/components/game/common/RandomFrameRateAnimation";

export class NikoHead implements DisplayedObject {
    private readonly game: GameContext
    private readonly parent: PositionedElement
    private sprite: AnimatedSprite
    private frameRate: FrameRate
    private animation: ObjectAnimation

    mustDelete: boolean;

    constructor(game: GameContext, parent: PositionedElement) {
        this.game = game;
        this.parent = parent;
        this.sprite = new AnimatedSprite(NikoSprite, { row: 3, frame: 0 })
        this.frameRate = new FrameRate(Config.frameRate * Config.playerFrameRateModifier)
        this.animation = new AlternateAnimation([
            () => randomize(new RandomUpDownAnimation( 3, 0)),
            () => randomize(new WaitAnimation(5)),
            () => randomize(new RandomUpDownAnimation( 5, 4)),
            () => randomize(new WaitAnimation(2)),
            () => randomize(new RandomUpDownAnimation( 5, 3)),
            () => randomize(new WaitAnimation(7)),
            () => randomize(new RandomUpDownAnimation( 5, 5)),
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