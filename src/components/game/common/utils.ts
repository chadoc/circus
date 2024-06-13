import type {GameContext} from "@/components/game/common/Draw";
import {Position} from "@/components/game/common/Draw";

export function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomScale(min, max) {
  return randomIntFromInterval(min * 101, max * 101) / 101
}

/**
 *
 * @param x x (reference element)
 * @param y y (reference element)
 * @param pw parent with (reference element)
 * @param ph parent height (reference element)
 * @param w width (element that must be centered)
 * @param h height ((element that must be centered)
 */
export function center(x: number, y: number, pw: number, ph: number, w: number, h: number): Position {
  return new Position(
      x + (pw / 2) - (w / 2),
      y + (ph / 2) - (h / 2)
  )
}

export function computeRatio(game: GameContext, sh: number, ratio: number): number {
  const height = game.ctx.canvas.height / ratio
  return sh / height
}

export function toScale(spriteValue: number, scaledValue: number): number {
  return spriteValue / scaledValue
}