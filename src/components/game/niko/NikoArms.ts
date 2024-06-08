import type {DisplayedObject, InputController, PuppetHandler} from "@/components/game/common/Draw";
import Sprite from '../../../assets/niko/NikoMovementFull.png'

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
export class NikoArms implements DisplayedObject {
    private readonly game: PuppetHandler
    private x: number
    private y: number
    private width: number
    private height: number

    mustDelete: boolean;
    source: any;

    draw(): void {
    }

    update(deltaTime: number, input: InputController): void {
    }
}