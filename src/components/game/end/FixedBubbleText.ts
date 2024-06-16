import Bubble from "@/assets/speech3.png";
import type {DisplayCoordinate, DisplayedObject, GameContext} from "@/components/game/common/Draw";
import {Position} from "@/components/game/common/Draw";
import {AnimatedSprite} from "@/components/game/common/AnimatedSprite";
import {CloudSprite} from "@/components/game/opossum/CloudSprite";
import {FrameRate} from "@/components/game/common/FrameRate";
import Config from "@/components/game/Config";

const bubble = new Image()
bubble.src = Bubble

const font = '3.2vh julien'
const color = 'black'

export class FixedBubbleText implements DisplayedObject{
    private readonly game: GameContext
    private readonly textLines: string[]
    private readonly sprite: AnimatedSprite
    private bubbleImageWidth: number = 656
    private bubbleImageHeight: number = 520
    private readonly lineHeight = 60
    private readonly widthTextMargin = 250

    private frameRate: FrameRate
    private readonly width: number
    private readonly height: number
    private readonly position: Position
    private frame: number = 0
    private readonly mustDelete = false

    constructor(game: GameContext, textLines: string[]) {
        this.game = game
        this.sprite = new AnimatedSprite(CloudSprite, { row: 0, frame: 0 })
        this.textLines = textLines
        this.frameRate = new FrameRate(Config.frameRate)

        this.width = this.bubbleWidth
        this.height = this.bubbleHeight
        this.position = this.game.center(this.width, this.height)
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

    get bubbleWidth(): number {
        return this.maxTextWidth + this.widthTextMargin
    }

    get bubbleHeight(): number {
        return this.textLines.length * this.lineHeight + 2 * this.lineHeight
    }

    get coordinate(): DisplayCoordinate {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        }
    }

    update(deltaTime: number) {
        this.frameRate.onUpdate(deltaTime, () => {
            if (this.frame <= 4) {
                this.frame++
            }
            this.sprite.update({ row: 0, frame: this.frame })
        })
    }

    draw(): void {
        if (this.frame < 4) {
            this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
        } else {
            console.log('draw text and image')
            this.game.ctx.font = font
            this.game.ctx.fillStyle = color

            const position = this.position
            this.game.ctx.drawImage(bubble, 0, 0, this.bubbleImageWidth, this.bubbleImageHeight, position.x, position.y, this.width, this.height)

            this.textLines.forEach(g => {
                const textWidth = this.game.ctx.measureText(g).width
                const textX = position.x + ((this.width - textWidth) / 2)
                const textY = position.y + this.lineHeight * this.textLines.indexOf(g) + this.lineHeight * 2
                this.game.ctx.fillText(g, textX, textY)
            })

        }
    }

}
