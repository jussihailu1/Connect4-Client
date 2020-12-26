import { DiscState } from './../_enums/CircleState';
import { Point } from './Point';

export class Disc{
    private point: Point
    private discState: DiscState;

    constructor(point: Point, discState: DiscState) {
        this.point = point;
        this.discState = discState;
    }

    getPoint(): Point{
        return this.point;
    }

    getDiscState(): number{
        return this.discState;
    }

    setDiscState(i: number){
        this.discState = DiscState[DiscState[i]];
    }
}