import Bubble from "@/assets/speech3.png";
import type {DisplayedObject, GameContext, InputController, PositionedElement} from "@/components/game/common/Draw";
import {Position} from "@/components/game/common/Draw";

const bubble = new Image()
bubble.src = Bubble

type DisplayedRow = {
    text: string,
    width: number,
    height: number
}

const font = '3.2vh julien'
const color = 'black'

export class BubbleText {
    private readonly game: GameContext
    private readonly textLines: string[]
    private readonly source: PositionedElement
    private bubbleImageWidth: number = 656
    private bubbleImageHeight: number = 520
    private readonly lineHeight = 40
    private readonly widthTextMargin = 250

    constructor(game: GameContext, textLines: string[], source: PositionedElement) {
        this.game = game
        this.textLines = textLines
        this.source = source
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
        const coordinate = this.source.coordinate
        return new Position(coordinate.x, coordinate.y)
    }

    get bubbleWidth(): number {
        return this.maxTextWidth + this.widthTextMargin
    }

    draw(): void {
        this.game.ctx.font = font
        this.game.ctx.fillStyle = color

        const lineCount = this.textLines.length

        const bubbleWidth = this.bubbleWidth
        const bubbleHeight = lineCount * this.lineHeight + this.lineHeight

        this.game.ctx.drawImage(bubble, 0, 0, this.bubbleImageWidth, this.bubbleImageHeight, this.position.x, this.position.y, bubbleWidth, bubbleHeight)

        this.textLines.forEach(g => {
            const textWidth = this.game.ctx.measureText(g).width
            const textX = this.position.x + ((bubbleWidth - textWidth) / 2)
            const textY = this.position.y + this.lineHeight * this.textLines.indexOf(g) + this.lineHeight + 5
            this.game.ctx.fillText(g, textX, textY)
        })
    }

}