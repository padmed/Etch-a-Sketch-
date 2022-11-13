class EtchASketch {
    constructor() {
        //neccessary elements for application
        this.pad = document.getElementById('draw-box');
        this.gridSize = document.getElementById('range'); // "input range" element
        this.userSettings = document.getElementById('user-settings'); //parent element for all user settings section
        this.SketchPadSizeText = document.getElementById('grid-size'); //container for displaying sketchpad size
        this.squares = null; // all square elements, initializes later after function draws them
        

        this.main();
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

                ++squareID
            }

        } this.squares = document.querySelectorAll('.grid'); // initilizes squares in grid after drawing them
    }

    // colors squares, takes rgba value
    colorSquare = function (event) {
        let square = event.target;

        if(square.classList.contains('grid')) {
            square.setAttribute('style', `background-color: 
            rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`)
        };
        
        this.markEvent(event);
        this.redoActionsStack = []; //clears redo stack
    }

    // draws borders around the squares
    drawBorders = function () {
        this.squares.forEach((square) => {

            if (this.gridBorders) {
                square.classList.add('gridBorder');

            } else if (!this.gridBorders) {
                square.classList.remove('gridBorder')
            }
        })
    }


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


    main = function () {
        this.fillPad();
        this.showGridSize();
        this.selectedColor();
        this.showOpacityValue();
        const colorGridFunctionCopy = this.colorSquare.bind(this); //helps in refering the same object 

        this.userSettings.addEventListener('input', this.handleInputRanges.bind(this)); //handles range inputs
        this.topSettings.addEventListener('click', this.handleTopSettings.bind(this));

        this.pad.addEventListener('mousedown', this.colorSquare.bind(this));
        this.pad.addEventListener('mousedown', () => this.pad.addEventListener('mouseover', colorGridFunctionCopy)); // Adds listener while mouse press, colors squares
        window.addEventListener('mouseup', () => this.pad.removeEventListener('mouseover', colorGridFunctionCopy)); // removes sketchpad listener after mouse release
    
        this.userSettings.addEventListener('click', this.handleUserSettings.bind(this));

        this.pad.addEventListener('mouseup', () => this.eventIntoActions());
    }

}





// const pad = new EtchASketch();

