import type {DisplayCoordinate, DisplayedObject, GameContext, InputController} from '@/components/game/common/Draw'
import {Position} from "@/components/game/common/Draw";
import {FrameRate} from '@/components/game/common/FrameRate'
import {CollisionDetection} from '@/components/game/common/CollisionDetection'
import {AnimatedSprite, type SpritePointer} from "@/components/game/common/AnimatedSprite";
import Config from "@/components/game/Config";
import {getGimmick} from "@/components/game/opossum/Gimmicks";
import type {HasGimmick} from "@/components/game/opossum/SpeechBubble";


export abstract class GenericOpossum implements DisplayedObject, HasGimmick {
    private readonly game: GameContext
    protected sprite: AnimatedSprite
    private position: Position
    private readonly initialPosition: Position
    private speed: number
    private markedForDeletion: boolean
    private layerSpeed: number
    private movementRate: FrameRate
    private frameRate: FrameRate
    private collisionDetection: CollisionDetection
    private gimmick: string[]

    constructor(game: GameContext, sprite: AnimatedSprite, position: Position) {
        this.game = game
        this.sprite = sprite
        this.position = position
        this.initialPosition = position
        this.gimmick = getGimmick()

        this.speed = 0
        this.markedForDeletion = false

        this.layerSpeed = game.background.speed

        this.movementRate = new FrameRate(50)
        this.frameRate = new FrameRate(Config.frameRate * 1.66)
        this.collisionDetection = new CollisionDetection(game.collisionCtx)
    }

    get xAcceleration(): number {
        return this.game.ch(Config.playerXSpeedScale)
    }

    get width(): number {
        return (this.sprite.sw * this.height) / this.sprite.sh
    }

    get height(): number {
        return this.game.ch(Config.opossumScale)
    }

    get mustDelete() {
        return this.markedForDeletion
    }

    get coordinate(): DisplayCoordinate {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        }
    }

    fire(point: Uint8ClampedArray): boolean {
        if (this.collisionDetection.isHit(point)) {
            this.markedForDeletion = true
            return true
        } else {
            return false
        }
    }

    update(deltaTime: number, input: InputController) {
        /*
        if (input.moveRight()) {
            this.speed = this.layerSpeed
        } else if (input.moveLeft()) {
            this.speed = -this.layerSpeed
        } else {
            this.speed = 0
        }

        this.movementRate.onUpdate(deltaTime, () => {
            this.position = {
                x: Math.floor(this.position.x - this.speed),
                y: this.position.y
            }
        })
         */
        this.movementRate.onUpdate(deltaTime, () => {
            const bgCoordinate = this.game.background.coordinate
            this.position = {
                x: this.initialPosition.x + bgCoordinate.x,
                y: this.initialPosition.y + bgCoordinate.y
            }
        })
        this.frameRate.onUpdate(deltaTime, () => {
            this.sprite.update(this.nextFrame(input))
        })
    }

    abstract nextFrame(input: InputController): SpritePointer

    draw() {
        this.collisionDetection.draw(this.coordinate)
        // ctx.strokeRect(this.x,this.animation.spriteRow(), this.animation.currentFrame(), this.coordinate this.y, this.width, this.height)
        this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
}
