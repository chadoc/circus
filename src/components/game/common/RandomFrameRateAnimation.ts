import type {DisplayedObject, InputController, ObjectAnimation} from "@/components/game/common/Draw";
import type {SpritePointer} from "@/components/game/common/AnimatedSprite";
import {randomIntFromInterval} from '@/components/game/common/utils'

export function randomize(animation: ObjectAnimation,  randomRatio = 3): RandomFrameRateAnimation {
    return new RandomFrameRateAnimation(animation, randomRatio)
}

export class RandomFrameRateAnimation implements ObjectAnimation {
    private readonly animation: ObjectAnimation
    private readonly ratio: number
    private pointer: SpritePointer | undefined

    constructor(animation: ObjectAnimation, randomRatio: number = 3) {
        this.animation = animation;
        this.ratio = randomRatio;
    }

    isFinished(): boolean {
        return this.animation.isFinished();
    }

    private shouldUpdate(): boolean {
        return randomIntFromInterval(1, 3) >= 2;
    }

    update(input: InputController): SpritePointer {
        if (!this.pointer || this.shouldUpdate()) {
            this.pointer = this.animation.update(input);
        }
        return this.pointer;
    }

}
