import type {DisplayCoordinate} from "@/components/game/common/Draw";

export type AnimationState = {
    name: string
    frames: number
}

export type AnimationSprite = {
    img: any,
    image: HTMLImageElement
    colWidth: number,
    rowHeight: number,
    states: AnimationState[]
}

export type SpriteCoordinate = {
    x: number
    y: number
}

export type SpriteAnimation = {
    loc: SpriteCoordinate[]
}

export function createCoordinates(width: number, y: number, frameCount: number): SpriteCoordinate[] {
    const coordinates: SpriteCoordinate[] = []
    for (let i = 0; i < frameCount; i++) {
        coordinates.push({ x: i * width, y })
    }
    return coordinates
}

export class AnimatedSprite {
    private sprite: AnimationSprite
    private currentRow: number
    private currentFrame: number

    constructor(sprite: AnimationSprite, { row, frame }: SpritePointer) {
        this.sprite = sprite;
        this.currentRow = row;
        this.currentFrame = frame;
    }

    private stateFor(stateName: string): AnimationState {
        return this.sprite.states.find(({ name }) => name === stateName)!
    }

    private rowFor(state: string): number {
        return this.sprite.states.indexOf(this.stateFor(state))
    }

    get frameCount(): number {
        return this.sprite.states[this.row].frames
    }

    get isLastFrame(): boolean {
        return this.frame >= this.frameCount - 1
    }

    get isFirstFrame(): boolean {
        return this.frame <= 0
    }

    get sw(): number {
        return this.sprite.colWidth
    }

    get sh(): number {
        return this.sprite.rowHeight
    }

    get row(): number {
        return this.currentRow
    }

    get frame(): number {
        return this.currentFrame
    }

    animate(frame: number) {
        this.currentFrame = frame
    }

    update({ row, frame }: SpritePointer) {
        this.currentRow = row
        this.currentFrame = frame
    }

    toDrawRef(coordinates: DisplayCoordinate): SpriteDrawReference {
        return {
            image: this.sprite.image,
            sx: this.currentFrame * this.sprite.colWidth,
            sy: this.currentRow * this.sprite.rowHeight,
            sw: this.sprite.colWidth,
            sh: this.sprite.rowHeight,
            dx: coordinates.x,
            dy: coordinates.y,
            dw: this.sprite.colWidth / coordinates.ratio,
            dh: this.sprite.rowHeight / coordinates.ratio
        }
    }

    toDrawRefState(state: string, frame: number, coordinates: DisplayCoordinate): SpriteDrawReference {
        return this.toDrawRef(this.rowFor(state), frame, coordinates)
    }
}

export type SpritePointer = {
    row: number,
    frame: number
}


export type SpriteDrawReference = {
    image: HTMLImageElement,
    sx: number, // sprite x location
    sy: number, // sprite y location
    sw: number, // sprite width
    sh: number, // sprite height
    dx: number, // draw x position
    dy: number, // draw y position
    dw: number, // draw width
    dh: number // draw heigh
}