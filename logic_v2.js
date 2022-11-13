class SketchPad {
    constructor(size) {
        this.pad = document.getElementById('draw-box');
        this.padSize = size;
        this.squares = null; // all square elements, initializes later after function draws them
    }


    //creates parent - child div elements, takes grid form with css flexbox 
    fillPad = function () {
        let squareID = 0; //individual id to each square

        for (let height = 1; height <= this.padSize; height++) {

            const div = document.createElement('div');
            div.classList.add('parentDiv');
            this.pad.appendChild(div);

            for (let width = 1; width <= this.padSize; width++) {

                const childDiv = document.createElement('div');
                childDiv.classList.add('grid');
                childDiv.setAttribute('id', `${squareID}`);
                div.appendChild(childDiv);
                childDiv.style.border = '1px solid'

                ++squareID
            }

        } this.squares = document.querySelectorAll('.grid'); // initilizes squares in grid after drawing them
    }

    //clears grid
    clearPad = function () {
        const toRemove = document.querySelectorAll('.parentDiv');
        toRemove.forEach((element) => element.remove());
    }
    
    // // colors squares, takes rgba value
    // colorSquare = function (event) {
    //     let square = event.target;

    //     if(square.classList.contains('grid')) {
    //         square.setAttribute('style', `background-color: 
    //         rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`)
    //     };
        
    //     this.markEvent(event);
    //     this.redoActionsStack = []; //clears redo stack
    // }

    // // draws borders around the squares
    // drawBorders = function () {
    //     this.squares.forEach((square) => {

    //         if (this.gridBorders) {
    //             square.classList.add('gridBorder');

    //         } else if (!this.gridBorders) {
    //             square.classList.remove('gridBorder')
    //         }
    //     })
    // }


    // //sets propertie based on user selection, clears previous grid, fills new grid.
    // gridSizeInput = function () {
    //     this.padSize = this.gridSize.value;
    //     this.clearPad();
    //     this.fillPad();
    //     this.showGridSize();
    //     this.drawBorders();
    //     this.actionStack = [];
    //     this.unprocessedActions = [];
    //     this.redoActionsStack = [];
    // }

}





class Main {
    constructor () {
        this.sketchPad = new SketchPad(16);
        this.execute();
    }

    execute = function () {
        this.sketchPad.fillPad();
    }
}


const main = new Main();