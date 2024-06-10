import type {InputController, ObjectAnimation} from "@/components/game/common/Draw";
import type {SpritePointer} from "@/components/game/common/AnimatedSprite";

export class WaitAnimation implements ObjectAnimation {

    private readonly row: number
    private readonly frame: number
    private countdown: number

    constructor(waitFrames = 5, row = 0, frame = 0) {
        this.row = row;
        this.frame = frame;
        this.countdown = waitFrames;
    }

    isFinished(): boolean {
        return this.countdown <= 0;
    }

    update(input: InputController): SpritePointer {
        this.countdown--;
        return {
            row: this.row,
            frame: this.frame
        }
    }
}