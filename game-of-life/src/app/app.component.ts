import { Component } from '@angular/core';

// GameBoard needed for syntax checker
import { singelton, GameBoard } from "./gameBoard/gameBoard";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public title = 'game-of-life';
    public gameBoard: GameBoard = singelton.getGameBoardInstance();
    public gameBoardNextState: boolean[][] = [];
    public gameSarted: boolean = false;
    public initialProbabilities: number[] = [0.1, 0.2, 0.3, 0.4, 0.5,
        0.6, 0.7, 0.8, 0.9, 1];
    public initialProbability: number = 0.2;
    public frameSpeedsFPS: number[] = [0.5, 1, 2];
    public frameSpeedFPS: number = 2;
    public boardTypes: string[] = ["random", "click on pixels",
        "oscillators", "spaceships"];
    public choosenBoardType: string = "random";
    public timerId: any = null;

    public togglePixel(pos: number[]) {
        if (this.choosenBoardType !== "click on pixels") {
            alert("toggling pixels on click available " +
                "only with 'click on pixels' board type");
        } else {
            this.gameBoard.toggleCell(pos);
        }
    }

    public radioChangeHandler(event: any) {
        this.choosenBoardType = event.target.value;
    }

    private moveToNextState() {
        this.gameBoardNextState = this.gameBoard.getBoardNextState();
        this.gameBoard.setGameBoard(this.gameBoardNextState);
        this.gameBoardNextState = [];
    }

    private setBoardInitialState(): void {
        if (this.choosenBoardType === "random") {
            this.gameBoard.initalizeRandomBoard(this.initialProbability);
        } else if (this.choosenBoardType === "oscillators") {
            this.gameBoard.initializeBoardWithOscillators();
        } else if (this.choosenBoardType === "spaceships") {
            this.gameBoard.initializeBoardWithSpaceships();
        }
    }

    public startTheGame(): void {
        this.setBoardInitialState();
        this.gameSarted = true;
        this.timerId = setInterval(() => {
            this.moveToNextState();
        }, 1000 / this.frameSpeedFPS);
    }

    public stopTheGame(): void {
        clearInterval(this.timerId);
        this.timerId = null;
        this.gameSarted = false;
    }

    ngOnInit() {
    };
}

