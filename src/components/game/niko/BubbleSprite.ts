import Sprite from '../../../assets/bubbles/bubbles.png'
import type {AnimationSprite} from '@/components/game/common/AnimatedSprite'

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
