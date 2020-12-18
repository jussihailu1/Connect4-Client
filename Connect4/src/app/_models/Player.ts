export class Player{
    id: number;
    username: string;
    discCount: number;

    constructor(username: string){
        this.username = username;
        this.discCount = 21;
    }
}