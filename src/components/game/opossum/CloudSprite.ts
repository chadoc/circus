import Sprite from '../../../assets/SpriteCloud.png'
import type {AnimationSprite} from "@/components/game/common/AnimatedSprite";

const image = new Image()
image.src = Sprite

export const CloudSprite: AnimationSprite = {
    img: Sprite,
    image,
    colWidth: 300,
    rowHeight: 230,
    states: [
        {
            name: 'normal',
            frames: 9
        }
    ]
}