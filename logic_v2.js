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
            ${this.pencilColor}`)
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
        this.sketchPad = objContext.sketchPad;
        this.userSettings = document.getElementById('user-settings'); //parent element for all user settings section
        this.gridSize = document.getElementById('range'); // "input range" element
        this.gridBorder = 'false';
        this.gridSize.value = 16; //sets grid size - "input range" at minimum on restart
    }

    gridSizeInput = function (event) {
        if (event.target.id === 'range') {   
            this.sketchPad.padSize = this.gridSize.value;
            this.sketchPad.clearPad();
            this.sketchPad.fillPad();
            this.showGridSize();
            this.drawBorders();
        }
        // this.actionStack = [];
        // this.unprocessedActions = [];
        // this.redoActionsStack = [];
    }

    //displays grid size in the app
    showGridSize = function () {
        document.getElementById('grid-size').innerHTML = `${this.sketchPad.padSize}X${this.sketchPad.padSize}`;
    }

    // draws borders around the squares
    drawBorders = function () {
        this.sketchPad.squares.forEach((square) => {

            if (this.gridBorders) {
                square.classList.add('gridBorder');

            } else if (!this.gridBorders) {
                square.classList.remove('gridBorder')
            }
        })
    }

    handleUserSettings = function (event) {
        const userSetting = event.target;

        if (userSetting.id == 'clear') {
            this.sketchPad.clearPad();
            this.sketchPad.fillPad();
            this.drawBorders();

        } else if (userSetting.name == 'border') {
            if (userSetting.value == 'border-on') {
                this.gridBorders = true;

            } else {
                this.gridBorders = false;

            } this.drawBorders(); //if there's event on grid-border option, this function takes radio input value, sets boolean based on input and calls function which draws border based on that boolean.
        } 
        // } else if (userSetting.id === 'undo' || userSetting.id === 'redo') {
        //     this.handleUndoRedo(event);
        // }
    }

    executeUserSettings = function () {
        this.userSettings.addEventListener('input', this.gridSizeInput.bind(this));
        this.userSettings.addEventListener('click', this.handleUserSettings.bind(this));
        this.showGridSize();
    }
}


class ColorSettings {
    constructor() {
        this.colorSettings = document.getElementById('color-settings') //parent element for all color settings
        this.color = {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };
    }

    hexToRGB = function (hex) {
        if (hex.length === 4) {
            let r = hex.slice(1,2);
            let g = hex.slice(2,3);
            let b = hex.slice(3,4);
          
            this.color.r = parseInt(r+r, 16);
            this.color.g = parseInt(g+g, 16);
            this.color.b = parseInt(b+b, 16);

            return;
          }
        
        this.color.r = parseInt(hex.slice(1, 3), 16);
        this.color.g = parseInt(hex.slice(3, 5), 16);
        this.color.b = parseInt(hex.slice(5, 7), 16);
    }

    showSelectedColor = function () {
        const color = document.querySelector('#currentColor');
        color.style.backgroundColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    }

    handleColorSettings = function (event) {
        const colorSetting = event.target;

        if (colorSetting.id === 'rgb') {
            colorSetting.oninput = () =>  {
                this.hexToRGB(colorSetting.value);
                this.showSelectedColor();
            }

        } else if (colorSetting.classList.contains('color')) {
            this.hexToRGB(colorSetting.getAttribute('data-color'));  

        } else if (colorSetting.id ==='eraser') {
            this.hexToRGB('#F6F7D7');
        }

        this.showSelectedColor();
    }

    executeColorSettings = function () {
        this.showSelectedColor();
        this.colorSettings.addEventListener('click', this.handleColorSettings.bind(this));
    }
}



class Main {
    constructor () {
        this.objContext = this;
        
        this.sketchPad = new SketchPad(16, 'red');
        this.userSettings = new UserSettings(this.objContext);
        this.colorSettings = new ColorSettings();
    }

    execute = function () {
        this.sketchPad.executeSketchPad();
        this.userSettings.executeUserSettings();
        this.colorSettings.executeColorSettings();
        
    }
}


const main = new Main();
main.execute();