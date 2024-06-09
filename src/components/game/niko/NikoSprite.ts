import Sprite from '../../../assets/niko/NikoMovementPartial.png'
import type {
    AnimationSprite,
    SpriteCoordinate,
    SpritePointer
} from "@/components/game/common/AnimatedSprite";

/*
 4500 x 5400
 5 columns
 6 rows
 */

/*
Arms:
row index: 1
col size: 3
 */

const image = new Image()
image.src = Sprite

export const NikoSprite: AnimationSprite = {
    img: Sprite,
    image,
    colWidth: 900,
    rowHeight: 900,
    states: [
        {
            name: 'mouth',
            frames: 3
        },
        {
            name: 'arms',
            frames: 4
        },
        {
            name: 'head-up',
            frames: 5
        },
        {
            name: 'head-left',
            frames: 5
        },
        {
            name: 'head-right',
            frames: 5
        }
    ]
}

export const NikoBody: SpriteCoordinate = {
    x: NikoSprite.colWidth * 4,
    y: NikoSprite.rowHeight * 0
}

export const NikoBodyRef: SpritePointer = {
    row: 0,
    frame: 4
}