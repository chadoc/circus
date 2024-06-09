import type {DisplayCoordinate, DisplayedObject, InputController, PuppetHandler} from '@/components/game/common/Draw'
import {moveX, Position} from "@/components/game/common/Draw";
import {FrameRate} from '@/components/game/common/FrameRate'
import {CollisionDetection} from '@/components/game/common/CollisionDetection'
import {AnimatedSprite, type SpritePointer} from "@/components/game/common/AnimatedSprite";
import Config from "@/components/game/Config";


export abstract class GenericOpossum implements DisplayedObject {
    private readonly game: PuppetHandler
    protected sprite: AnimatedSprite
    private position: Position
    private speed: number
    private ratio: number
    private markedForDeletion: boolean
    private layerSpeed: number
    private movementRate: FrameRate
    private frameRate: FrameRate
    private collisionDetection: CollisionDetection

    get width(): number {
        return this.sprite.sw / this.ratio
    }

    get height(): number {
        return this.sprite.sh / this.ratio
    }

    constructor(game: PuppetHandler, sprite: AnimatedSprite, position: Position) {
        this.game = game
        this.sprite = sprite
        this.position = position
        this.ratio = 6
        // this.speed = Math.random() * 4 + 1
        this.speed = 0
        this.markedForDeletion = false

        this.layerSpeed = 25 * 0.8 // TODO should be based on background

        // this.frameRate = new FrameRate(Math.random() * 50 + 20)
        this.movementRate = new FrameRate(60)
        this.frameRate = new FrameRate(Config.frameRate * 1.66)
        this.collisionDetection = new CollisionDetection(game.collisionCtx)
    }

    get mustDelete() {
        return this.markedForDeletion
    }

    get size() {
        return this.width
    }

    get coordinate(): DisplayCoordinate {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
            ratio: this.ratio
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
        if (input.hasOneOf('ArrowRight', 'SwipeRight')) {
            this.speed = this.layerSpeed
        } else if (input.hasOneOf('ArrowLeft', 'SwipeLeft')) {
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
        this.frameRate.onUpdate(deltaTime, () => {
            this.sprite.update(this.nextFrame())
        })
    }

    abstract nextFrame(): SpritePointer

    draw() {
        this.collisionDetection.draw(this.coordinate)
        // ctx.strokeRect(this.x,this.animation.spriteRow(), this.animation.currentFrame(), this.coordinate this.y, this.width, this.height)
        this.game.drawer.drawSprite(this.sprite.toDrawRef(this.coordinate))
    }
}
