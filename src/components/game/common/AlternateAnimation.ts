import type {ObjectAnimation} from "@/components/game/common/Draw";

export class AlternateAnimation implements ObjectAnimation {

    private readonly animations: Array<() => ObjectAnimation>
    private currentAnimation: ObjectAnimation
    private selectedAnimation = 0

    constructor(animations: Array<() => ObjectAnimation>) {
        this.animations = animations;
        this.currentAnimation = this.animations[this.selectedAnimation]()
    }

    currentFrame(): number {
        return this.currentAnimation.currentFrame();
    }

    isFinished(): boolean {
        return false;
    }

    spriteRow(): number {
        return this.currentAnimation.spriteRow();
    }

    update(): void {
        if (this.currentAnimation.isFinished()) {
            this.switchAnimation()
        }
        this.currentAnimation.update()
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