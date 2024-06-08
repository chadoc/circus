import shadowDog from '../assets/shadow_dog.png'
import type {AnimationSprite, SpriteAnimation} from "@/components/game/common/AnimatedSprite";
import {createCoordinates} from "@/components/game/common/AnimatedSprite";


const spriteWidth = 575
const spriteHeight = 523

const image = new Image()
image.src = shadowDog


/*
sprite :
width: 6876 px / 12 columns = 573
height: 5230 px / 10 rows = 523
 */
export const ShadowDogSprite: AnimationSprite = {
  img: shadowDog,
  image,
  colWidth: 575,
  rowHeight: 523,
  states: [
    {
      name: 'idle',
      frames: 7
    },
    {
      name: 'jump',
      frames: 7
    },
    {
      name: 'fall',
      frames: 7
    },
    {
      name: 'run',
      frames: 9
    },
    {
      name: 'dizzy',
      frames: 11
    },
    {
      name: 'sit',
      frames: 5
    },
    {
      name: 'roll',
      frames: 7
    },
    {
      name: 'bite',
      frames: 7
    },
    {
      name: 'ko',
      frames: 12
    },
    {
      name: 'getHit',
      frames: 4
    }
  ]
}

export const SpriteAnimations: Record<string, SpriteAnimation> = {
  idle: { loc: createCoordinates(spriteWidth, 0 * spriteHeight, 7) },
  jump: { loc: createCoordinates(spriteWidth, 1 * spriteHeight, 7) },
  fall: { loc: createCoordinates(spriteWidth, 2 * spriteHeight, 7) },
  run: { loc: createCoordinates(575, 3 * spriteHeight, 9) },
  dizzy: { loc: createCoordinates(575, 4 * spriteHeight, 11) },
  sit: { loc: createCoordinates(575, 5 * spriteHeight, 5) },
  roll: { loc: createCoordinates(575, 6 * spriteHeight, 7) },
  bite: { loc: createCoordinates(575, 7 * spriteHeight, 7) },
  ko: { loc: createCoordinates(575, 8 * spriteHeight, 12) },
  getHit: { loc: createCoordinates(575, 9 * spriteHeight, 4) },
}
