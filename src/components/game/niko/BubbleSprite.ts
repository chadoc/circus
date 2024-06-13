import Sprite from '../../../assets/bubbles/bubbles.png'
import type {AnimationSprite} from '@/components/game/common/AnimatedSprite'

const image = new Image()
image.src = Sprite

export const BubbleSprite: AnimationSprite = {
  img: Sprite,
  image,
  colWidth: 256,
  rowHeight: 256,
  states: [
    {
      name: 'bubble',
      frames: 7
    }
  ]
}
