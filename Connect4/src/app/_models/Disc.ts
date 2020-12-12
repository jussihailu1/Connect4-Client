import { CircleState } from './../_enums/CircleState';

export class Disc{
    private x: number;
    private y: number;
    private circleState: CircleState;

    constructor(x: number, y: number, circleState: CircleState) {
        this.x = x;
        this.y = y;
        this.circleState = circleState;
    }

    getX(): number{
        return this.x;
    }

    getY(): number{
        return this.y;
    }

    getCircleState(): number{
        return this.circleState;
    }

    setCircleState(i: number){
        this.circleState = CircleState[CircleState[i]];
    }
}