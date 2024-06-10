import type {InputController, MovingElement, ObjectAnimation} from "@/components/game/common/Draw";
import type {SpritePointer} from "@/components/game/common/AnimatedSprite";

export class MovingUpAnimation implements ObjectAnimation {
    private readonly movingElement: MovingElement
    private readonly maxFrame: number
    private readonly horizontal: boolean
    private readonly row: number
    private previousSpeed: number
    private frame: number

    constructor(movingElement: MovingElement,
                maxFrame: number,
                horizontal: boolean = false,
                row = 0) {
        this.movingElement = movingElement;
        this.maxFrame = maxFrame;
        this.horizontal = horizontal;
        this.previousSpeed = 0;
        this.frame = 0;
        this.row = row;
    }

    isFinished(): boolean {
        return false;
    }

    update(input: InputController): SpritePointer {
        const { xSpeed, ySpeed } = this.movingElement.movement
        const speed = this.horizontal ? xSpeed : ySpeed
        if (speed >= 0) {
            this.frame = Math.max(this.frame-1, 0)
        } else {
            this.frame = Math.min(this.frame+1, this.maxFrame - 1)
        }
        /*
        if (speed >= 0) {
            this.previousSpeed = 0
            this.frame = 0
        } else {
            if (speed < this.previousSpeed) {
                this.frame = Math.min(this.frame+1, this.maxFrame - 1)
            } else if (this.previousSpeed < speed) {
                this.frame = Math.max(this.frame-1, 0)
            }
            this.previousSpeed = speed
        }
        */
        return {
            row: this.row,
            frame: this.frame
        }
    }


}