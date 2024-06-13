import type {GameContext} from "@/components/game/common/Draw";

export function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function computeRatio(game: GameContext, sh: number, ratio: number): number {
  const height = game.ctx.canvas.height / ratio
  return sh / height
}

