export class Record {
    id: number;
    wins: number;
    draws: number;
    losses: number;

    constructor(wins: number, draws: number, losses: number) {
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
    }
}