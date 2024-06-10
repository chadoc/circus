import type {ObjectAnimation} from "@/components/game/common/Draw";
import type {SpritePointer} from "@/components/game/common/AnimatedSprite";

export class RandomUpDownAnimation implements ObjectAnimation {

    private readonly totalFrame: number
    private frame: number
    private increment: number
    private row: number

    constructor(totalFrame: number, row = 0, startFrame = 0, ) {
        this.totalFrame = totalFrame;
        this.frame = startFrame;
        this.increment = 1
        this.row = row
    }

    isFinished(): boolean {
        return false;
    }

    update(): SpritePointer {
        this.frame += this.increment
        if (this.frame >= this.totalFrame - 1 || this.frame <= 0) {
            this.increment = -this.increment
        }
        return {
            row: this.row,
            frame: this.frame
        }
    }

}