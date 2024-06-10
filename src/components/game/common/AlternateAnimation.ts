import type {ObjectAnimation} from "@/components/game/common/Draw";
import type {SpritePointer} from "@/components/game/common/AnimatedSprite";

export class AlternateAnimation implements ObjectAnimation {

    private readonly animations: Array<() => ObjectAnimation>
    private currentAnimation: ObjectAnimation
    private selectedAnimation = 0

    constructor(animations: Array<() => ObjectAnimation>) {
        this.animations = animations;
        this.currentAnimation = this.animations[this.selectedAnimation]()
    }

    isFinished(): boolean {
        return false;
    }

    update(): SpritePointer {
        if (this.currentAnimation.isFinished()) {
            this.switchAnimation()
        }
        return this.currentAnimation.update()
    }

    private switchAnimation() {
        this.currentAnimation = this.animations[this.nextAnimation()]()
    }

    private nextAnimation(): number {
        if (this.selectedAnimation >= this.animations.length - 1) {
            this.selectedAnimation = 0
        } else {
            this.selectedAnimation++
        }
        return this.selectedAnimation
    }


}