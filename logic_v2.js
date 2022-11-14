class SketchPad {
    constructor(size, color) {
        this.pad = document.getElementById('draw-box');
        this.padSize = size;
        this.squares = null; // all square elements, initializes later after function draws them
        this.pencilColor = color;
        this.colorGridFunctionCopy = this.colorSquare.bind(this); //helps in refering the same object 
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

    //clears grid
    clearPad = function () {
        const toRemove = document.querySelectorAll('.parentDiv');
        toRemove.forEach((element) => element.remove());
    }
    
    // colors squares, takes rgba value
    colorSquare = function (event) {
        let square = event.target;

        if(square.classList.contains('grid')) {
            square.setAttribute('style', `background-color: 
            black`)
        };
    }

    executeSketchPad = function () {
        this.fillPad();

        this.pad.addEventListener('mousedown', this.colorSquare.bind(this));
        this.pad.addEventListener('mousedown', () => this.pad.addEventListener('mouseover', this.colorGridFunctionCopy)); // Adds listener while mouse press, colors squares
        window.addEventListener('mouseup', () => this.pad.removeEventListener('mouseover', this.colorGridFunctionCopy)); // removes sketchpad listener after mouse release

    }
}



class UserSettings {
    constructor (objContext) {
        this.userSettings = document.getElementById('user-settings'); //parent element for all user settings section
        this.that = objContext;
        this.gridSize = document.getElementById('range'); // "input range" element

    }

    handleInputRanges = function (event) {
        // if (event.target.id === 'opacityInput') {
        //     this.colorOpacityInput(event);

        // } else if (event.target.id === 'range') {
        //     this.gridSizeInput(event);
            
        // }
        if (event.target.id === 'range') {
            this.gridSizeInput(event);    
        }
    }

    gridSizeInput = function () {
        this.that.sketchPad.padSize = this.gridSize.value;
        this.that.sketchPad.clearPad();
        this.that.sketchPad.fillPad();
        this.showGridSize();
        // this.drawBorders();
        // this.actionStack = [];
        // this.unprocessedActions = [];
        // this.redoActionsStack = [];
    }

    //displays grid size in the app
    showGridSize = function () {
        document.getElementById('grid-size').innerHTML = `${this.that.sketchPad.padSize}X${this.that.sketchPad.padSize}`;
    }
    

    executeUserSettings = function () {
        this.userSettings.addEventListener('input', this.handleInputRanges.bind(this)); //handles range inputs
    }
}




class Main {
    constructor () {
        this.objContext = this;
        this.sketchPad = new SketchPad(16, 'red');
        this.userSettings = new UserSettings(this.objContext);
        this.colorGridFunctionCopy = this.sketchPad.colorSquare.bind(this); //helps in refering the same object
    }

    execute = function () {
        this.sketchPad.executeSketchPad();
        this.userSettings.executeUserSettings();
        
    }
}


const main = new Main();
main.execute();