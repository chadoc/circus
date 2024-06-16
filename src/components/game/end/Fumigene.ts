import Img from '../../../assets/fumigene.png'
import CloudSound from '../../../assets/liquid.wav'
import type {DisplayCoordinate, DisplayedObject, GameContext, InputController} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {FrameRate} from '@/components/game/common/FrameRate'
import Config from "@/components/game/Config";
import {AnimatedSprite, type AnimationSprite} from "@/components/game/common/AnimatedSprite";
import {randomScale} from "@/components/game/common/utils";


const sound = new Audio(CloudSound)
const image = new Image()
image.src = Img

export const FumigeneSprite: AnimationSprite = {
    img: Img,
    image,
    colWidth: 500,
    rowHeight: 800,
    states: [
        {
            name: 'standard',
            frames: 7
        }
    ]
}

export class Fumigene implements DisplayedObject {
    private readonly game: GameContext
    private readonly sprite: AnimatedSprite
    private readonly initialX: number
    private position: Position
    private scale: number

    private frame: number
    private movementRate: FrameRate
    private frameRate: FrameRate
    private scaleRate: FrameRate
    private layerSpeed: number
    private speed: number
    private readonly mustDelete = false
    private scaleIncrement: number = 0.02


    constructor(game: GameContext, x: number) {
        this.game = game
        this.sprite = new AnimatedSprite(FumigeneSprite, {row: 0, frame: 0})
        this.initialX = x
        this.scale = this.scaleIncrement
        this.position = new Position(x, this.y)
        this.frame = 0
        this.layerSpeed = game.background.speed * Config.fumigeneSpeedModifier
        this.speed = 0
        this.movementRate = new FrameRate(50)
        this.frameRate = new FrameRate(Config.frameRate * 1.1)
        this.scaleRate = new FrameRate(30)
    }

    get width(): number {
        return this.sprite.sw * this.scale
    }

    get height(): number {
        return this.sprite.sh * this.scale
    }

    get x(): number {
        return this.game.center(this.width, this.height).x
    }

    get y(): number {
        return this.game.ctx.canvas.height - this.height + (this.scale * this.sprite.sh * 0.05)
    }

    get coordinate(): DisplayCoordinate {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    update(deltaTime: number, input: InputController) {
        if (this.frame === 0) {
            // sound.play()
        }

        this.scaleRate.onUpdate(deltaTime, () => {
            if (this.scale < 1.6) {
                this.scale += this.scaleIncrement
                this.position = new Position(
                    this.position.x,
                    this.y
                )
            }
        })

        this.movementRate.onUpdate(deltaTime, () => {
            if (input.moveLeft()) {
                this.speed = -this.layerSpeed
            } else if (input.moveRight()) {
                this.speed = this.layerSpeed
            } else {
                this.speed = 0
            }

            this.position = new Position(
                this.position.x + this.speed,
                this.position.y
            )
        })

        this.frameRate.onUpdate(deltaTime, () => {
            this.frame++
            if (this.frame > this.sprite.frameCount) {
                this.frame = 0
            }
            this.sprite.update({
                row: 0,
                frame: this.frame
            })
        })
    }

    draw() {
        this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
}
