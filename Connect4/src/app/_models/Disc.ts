import { CircleState } from './../_enums/CircleState';
import { Point } from './Point';

export class Disc{
    private point: Point
    private circleState: CircleState;

    constructor(point: Point, circleState: CircleState) {
        this.point = point;
        this.circleState = circleState;
    }

    getPoint(): Point{
        return this.point;
    }

    getCircleState(): number{
        return this.circleState;
    }

    setCircleState(i: number){
        this.circleState = CircleState[CircleState[i]];
    }
}