import isBetween from "../utils/isNumBetween";
import oscillators from "./oscillators";
import spaceships from "./spaceships";

class GameBoard {
    private _gameBoard: boolean[][] = [];
    private _nRows: number = 30;
    private _nCols: number = 30;

    public constructor(nRows: number = 30, nCols: number = 30) {
        this._nRows = nRows;
        this._nCols = nCols;
        // create empty board
        this._gameBoard = this.initializeEmptyBoard(nRows, nCols, 0);
    }

    public setGameBoard(newGameBoard: boolean[][]): void {
        this._gameBoard = newGameBoard;
    }

    /**
     * @param {number} probFrom0To1 probability of a cell being alive
     */
    public initalizeRandomBoard(probOfCellBeingAliveFrom0To1: number): void {

        this._gameBoard = this.initializeEmptyBoard(this._nRows, this._nCols,
            probOfCellBeingAliveFrom0To1);
    }

    public initializeBoardWithOscillators(): void {
        for (let r = 0; r < this._gameBoard.length; r++) {
            for (let c = 0; c < this._gameBoard[0].length; c++) {
                this._gameBoard[r][c] = (
                    oscillators[r][c] === 0 ? false : true
                );
            }
        }
    }

    public initializeBoardWithSpaceships(): void {
        for (let r = 0; r < this._gameBoard.length; r++) {
            for (let c = 0; c < this._gameBoard[0].length; c++) {
                this._gameBoard[r][c] = (
                    spaceships[r][c] === 0 ? false : true
                );
            }
        }
    }

    /**
     * @param {number} probFrom0To1 probability of a cell being alive
     */
    private initializeEmptyBoard(nRows: number, nCols: number,
        probFrom0To1: number): boolean[][] {
        let result: boolean[][] = [];
        for (let r = 0; r < nRows; r++) {
            let row: boolean[] = [];
            for (let c = 0; c < nCols; c++) {
                // alive/dead - true/false
                row.push(this.isCellAlive(probFrom0To1));
            }
            result.push(row);
        }
        return result;
    }

    /**
     * @param {number} probFrom0To1 probability of a cell being alive
     */
    private isCellAlive(probFrom0To1: number): boolean {
        return Math.random() < probFrom0To1;
    }

    public getGameBoard(): boolean[][] {
        return this._gameBoard;
    }

    public getCellContent(positionRowCol: number[]): boolean {
        let row: number, col: number;
        [row, col] = positionRowCol;
        return this._gameBoard[row][col];
    }

    private getPositionsOfCellNeighbours(cellPositionRowCol: number[]): number[][] {
        let result: number[][] = [];
        let cellRow: number, cellCol: number;
        [cellRow, cellCol] = cellPositionRowCol;
        for (let row of this.getAllNeighboursRows(cellRow)) {
            for (let col of this.getAllNeighboursCols(cellCol)) {
                if (!this.isNewPosEqlOldPos(cellPositionRowCol, [row, col]) &&
                    this.isPosOnGameBoard([row, col])) {
                    result.push([row, col]);
                }
            }
        }
        return result;
    }

    private isNewPosEqlOldPos(oldPos: number[], newPos: number[]): boolean {
        return (oldPos[0] === newPos[0]) && (oldPos[1] === newPos[1]);
    }

    private isPosOnGameBoard(pos: number[]): boolean {
        let isRowInRange: boolean = isBetween(pos[0], 0, this._nRows - 1);
        let isColInRange: boolean = isBetween(pos[1], 0, this._nCols - 1);
        return isRowInRange && isColInRange;
    }

    private getAllNeighboursRows(cellRow: number): number[] {
        return [cellRow - 1, cellRow, cellRow + 1];
    }

    private getAllNeighboursCols(cellCol: number): number[] {
        return [cellCol - 1, cellCol, cellCol + 1];
    }

    private getNumOfLiveNeighbours(cellPos: number[]): number {
        let sum: number = 0;
        let curRow: number, curCol: number;
        for (let pos of this.getPositionsOfCellNeighbours(cellPos)) {
            [curRow, curCol] = pos;
            if (this._gameBoard[curRow][curCol]) {
                sum += 1;
            }
        }
        return sum;
    }

    private isCellNextGenAlive(pos: number[]): boolean {
        let numNeighAlive: number = this.getNumOfLiveNeighbours(pos);

        if (this._gameBoard[pos[0]][pos[1]]) { // previously alive
            if (isBetween(numNeighAlive, 2, 3)) {
                return true;
            }
        } else { // previously dead
            if (numNeighAlive === 3) {
                return true;
            }
        }
        return false;
    }

    public toggleCell(pos: number[]) {
        this._gameBoard[pos[0]][pos[1]] = !this._gameBoard[pos[0]][pos[1]];
    }

    public getBoardNextState(): boolean[][] {
        let nextBoardState: boolean[][] = [];
        for (let r = 0; r < this._nRows; r++) {
            let newRow: boolean[] = [];
            for (let c = 0; c < this._nCols; c++) {
                newRow.push(this.isCellNextGenAlive([r, c]));
            }
            nextBoardState.push(newRow);
        }
        return nextBoardState;
    }
}

const singelton = (function() {
    let instance: GameBoard; 	// no initialization, so undefined

    function init() {
        return new GameBoard();
    }

    function getInstance(): GameBoard {
        if (!Boolean(instance)) {
            instance = init();
        }
        return instance;
    }

    return {
        getGameBoardInstance: getInstance
    }
})();

export { GameBoard, singelton };

