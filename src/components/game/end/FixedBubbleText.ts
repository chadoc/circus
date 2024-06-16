import Bubble from "@/assets/speech3.png";
import type {DisplayedObject, GameContext, InputController, PositionedElement} from "@/components/game/common/Draw";
import {Position} from "@/components/game/common/Draw";

const bubble = new Image()
bubble.src = Bubble

const font = '3.2vh julien'
const color = 'black'

export class FixedBubbleText {
    private readonly game: GameContext
    private readonly textLines: string[]
    private bubbleImageWidth: number = 656
    private bubbleImageHeight: number = 520
    private readonly lineHeight = 60
    private readonly widthTextMargin = 250

    constructor(game: GameContext, textLines: string[]) {
        this.game = game
        this.textLines = textLines
    }

    private get maxTextWidth(): number {
        this.game.ctx.font = font
        this.game.ctx.fillStyle = color
        let width = 0
        for (const line of this.textLines) {
            width = Math.max(width, this.game.ctx.measureText(line).width)
        }
        return width
    }

    get position(): Position {
        const width = this.bubbleWidth
        const height = this.bubbleHeight
        return this.game.center(width, height)
    }

    get bubbleWidth(): number {
        return this.maxTextWidth + this.widthTextMargin
    }

    get bubbleHeight(): number {
        return this.textLines.length * this.lineHeight + 2 * this.lineHeight
    }

    draw(): void {
        this.game.ctx.font = font
        this.game.ctx.fillStyle = color

        const bubbleWidth = this.bubbleWidth
        const bubbleHeight = this.bubbleHeight
        const position = this.position

        this.game.ctx.drawImage(bubble, 0, 0, this.bubbleImageWidth, this.bubbleImageHeight, position.x, position.y, bubbleWidth, bubbleHeight)

        this.textLines.forEach(g => {
            const textWidth = this.game.ctx.measureText(g).width
            const textX = position.x + ((bubbleWidth - textWidth) / 2)
            const textY = position.y + this.lineHeight * this.textLines.indexOf(g) + this.lineHeight * 2
            this.game.ctx.fillText(g, textX, textY)
        })
    }

}