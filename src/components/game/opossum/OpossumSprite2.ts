import Sprite from '../../../assets/opossum/Opossum2Sprite.png'
import type {AnimationSprite} from "@/components/game/common/AnimatedSprite";

const image = new Image()
image.src = Sprite

export const OpossumSprite2: AnimationSprite = {
    img: Sprite,
    image,
    colWidth: 1500,
    rowHeight: 1500,
    states: [
        {
            name: 'balance',
            frames: 7
        },
        {
            name: 'eyes',
            frames: 5
        }
    ]
}