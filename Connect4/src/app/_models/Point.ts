export class Point{
    private x: number;
    private y: number;

    constructor(x, y?){
        this.x = x;
        this.y = y;
    }

    getX(): number{
        return this.x;
    }

    getY(): number{
        return this.y;
    }
}