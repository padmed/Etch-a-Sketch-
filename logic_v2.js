class SketchPad {
    constructor(objContext) {
        this.pad = document.getElementById('draw-box');
        this.padSize = 16;
        this.squares = null; // all square elements, initializes later after function draws them
        this.pencilColor = 'black';
        this.handlePadEventsCopy = this.handlePadEvents.bind(this); //helps in refering the same object
        //undo redo feature properties

        this.events = [];
        this.actionStack = [];
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
        this.restartUndoRedo();
    }
    
    // colors squares, takes rgba value
    colorSquare = function (event) {
        let square = event.target;

        if(square.classList.contains('grid')) {
            square.setAttribute('style', `background-color: 
            ${this.pencilColor}`)
        };
    }

    handlePadEvents = function (event) {
        this.colorSquare(event);
        this.saveEvents(event);
        this.redoStack = [];
    }

    saveEvents = function (event) {
        this.events.push(event);
    }

    eventIntoActions = function () {
        for (let i = 0; i < this.events.length; i++) {
            let event = this.events[i];

            if (event.type === 'mousedown') {
                this.actionStack.push([event.target]);

            } else {
                this.actionStack[this.actionStack.length - 1].push(event.target);
            }
        }

        this.events = []; //clearing the unprocessed stack to prevent repetition in actionStack
    }

    getActions = function () {
        this.eventIntoActions()
        return this.actionStack;
    }

    restartUndoRedo = function() {
        this.events = [];
        this.actionStack = [];
        this.redoStack = [];
    }

    executeSketchPad = function () {
        this.fillPad();

        this.pad.addEventListener('mousedown', this.handlePadEventsCopy);
        this.pad.addEventListener('mousedown', () => this.pad.addEventListener('mouseover', this.handlePadEventsCopy)); // Adds listener while mouse press, colors squares
        window.addEventListener('mouseup', () => this.pad.removeEventListener('mouseover', this.handlePadEventsCopy)); // removes sketchpad listener after mouse release
        window.addEventListener('mouseup', this.eventIntoActions.bind(this));
    }
}


class UserSettings {
    constructor (objContext) {
        this.gridSize = document.getElementById('range'); // "input range" element
        this.sketchPad = objContext.sketchPad;
        this.gridBorder = 'false';
        this.gridSize.value = 16; //sets grid size - "input range" at minimum on restart
        this.actionStack = [];
        this.redoStack = [];
    }

    gridSizeInput = function (event) {
        if (event.target.id === 'range') {   
            this.sketchPad.padSize = this.gridSize.value;
            this.sketchPad.clearPad();
            this.sketchPad.fillPad();
            this.showGridSize();
            this.drawBorders();
        }
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
    
        } else if (userSetting.id === 'undo' || userSetting.id === 'redo') {
            this.handleUndoRedo(event);
        }
    }

    handleUndoRedo = function (event) {
        this.actionStack = this.sketchPad.getActions();

        if (event.target.id === 'undo' && this.actionStack.length > 0) {
            const undoAction = this.actionStack.pop()
            this.redoStack.push(undoAction);

        } else if (event.target.id === 'redo' && this.redoStack.length > 0) {
            const redoAction = this.redoStack.pop();
            this.actionStack.push(redoAction)
        }
        console.log(this.actionStack)
        this.drawUndoRedo();
    }

    drawUndoRedo = function () {
        const toRemove = document.querySelectorAll('.parentDiv'); //clears sketchpad withoy modyfing actionStack
        if (toRemove != null) toRemove.forEach((element) => element.remove());

        this.sketchPad.fillPad();

        if (this.gridBorders) this.drawBorders(); //if grid border option is choosen this will draw borders 

        this.actionStack.forEach((action) => {
            for (let square = 0; square < action.length; square++) {
                const squareFromStack = action[square];
                const squareFromHtml = document.getElementById(squareFromStack.id);

                squareFromHtml.style.backgroundColor = squareFromStack.style.backgroundColor; //colors matching squares with user's previous actions
            }
        })
    }

    executeUserSettings = function () {
        const userSettings = document.getElementById('user-settings'); //parent element for all user settings section
        const sketchPad = document.getElementById('draw-box');
        const clearButton = document.getElementById('clear');

        userSettings.addEventListener('input', this.gridSizeInput.bind(this));
        userSettings.addEventListener('click', this.handleUserSettings.bind(this));
        sketchPad.addEventListener('click', () => this.redoStack = []);
        clearButton.addEventListener('click', () => {
            this.actionStack = [];
            this.redoStack = [];
        }) 
        
        this.showGridSize();
    }
}


class ColorSettings {
    constructor(objContext) {
        this.sketchPad = objContext.sketchPad; //Helps in refering to same Main class object.

        this.color = {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0,
            rgb: function() {return `rgb(${this.r}, ${this.g}, ${this.b})`},
            rgba: function() {return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` }
        };

        this.recentColors = [];
    }

    hexToRGB = function (hex) {
        if (hex.length === 4) {
            let r = hex.slice(1,2);
            let g = hex.slice(2,3);
            let b = hex.slice(3,4);
          
            this.color.r = parseInt(r+r, 16);
            this.color.g = parseInt(g+g, 16);
            this.color.b = parseInt(b+b, 16);
            this.color.a = 1.0
            return;
          }
        
        this.color.r = parseInt(hex.slice(1, 3), 16);
        this.color.g = parseInt(hex.slice(3, 5), 16);
        this.color.b = parseInt(hex.slice(5, 7), 16);
        this.color.a = 1.0
    }

    rgbToHex = function (red, green, blue) {
        function ColorToHex(color) {
            let hexadecimal = color.toString(16);
            return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
        }

        return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
      }
    
    showSelectedColor = function () { 
        const color = document.querySelector('#currentColor');
        color.style.backgroundColor = this.color.rgba();
    }


    //changes alpha (a) value in color attribute
    handleOpacityInput = function (event) {
        const userInput = event.target;

        this.color.a = (userInput.value / 100);
        this.sketchPad.pencilColor = this.color.rgba();

        this.showSelectedColor();
        this.showOpacityValue();
    }

    showOpacityValue = function() {
        const displayOpacity = document.querySelector('#opacityValue');
        const opacityInput = document.getElementById('opacityInput');
        const opacityPercValue = Math.floor(this.color.a * 100);

        displayOpacity.innerHTML = `${opacityPercValue}%`

    }

    handleColorSettings = function (event) {
        const colorSetting = event.target;
        let rawColor;
        const opacityInput = document.getElementById('opacityInput');

        if (colorSetting.classList.contains('color') || (colorSetting.id ==='eraser')) { 

            if (colorSetting.classList.contains('color')) {
               rawColor = colorSetting.getAttribute('data-color');
   
            } else if (colorSetting.id ==='eraser') {
               rawColor = '#F6F7D7'
            }

           this.hexToRGB(rawColor);
           this.showSelectedColor(); 
           this.sketchPad.pencilColor = this.color.rgba();
           opacityInput.value = '100'

           if (colorSetting.id !== 'eraser') {
               this.markRecentColor();
               this.showRecentColors();
               opacityInput.value = '100';
           }
        }

        this.showOpacityValue();
    }

    handleCustomColor = function (event) {
        const colorSetting = event.target;
        const opacityInput = document.getElementById('opacityInput');

        if (colorSetting.id === 'rgb') { //custom color picker
                this.hexToRGB(colorSetting.value);
                this.showSelectedColor();
                this.markRecentColor();
                this.sketchPad.pencilColor = this.color.rgba();
                this.showRecentColors();
                this.showOpacityValue();
                opacityInput.value = '100';
        }
    }

    markRecentColor = function () {
        const hexCol = this.rgbToHex(this.color.r, this.color.g, this.color.b);

        if (this.recentColors.includes(hexCol)) {
            return;

        } else if ( this.recentColors.length >= 5) {
            this.recentColors.shift();

        } this.recentColors.push(hexCol);
    }

    showRecentColors = function () {
        let i = this.recentColors.length - 1;
        let reverseI = 0;
        const recentColorsElements = document.querySelectorAll('.recColor');
        const text = document.getElementById('recentColorText');

        text.innerHTML = 'Recent Colors:'

        for (i; i >= 0; --i) {
            const recColElement = recentColorsElements[i];
            const recCol = this.recentColors[reverseI];

            recColElement.classList.add('visible');
            recColElement.style.backgroundColor = recCol;
            recColElement.setAttribute('data-color', recCol);
            reverseI++
        }
    }

    handleRecentColor = function (event) {
        const recColElemenet = event.target;

        if (recColElemenet.classList.contains('recColor')) {
            const hex = recColElemenet.getAttribute('data-color');

            this.hexToRGB(hex);
            this.sketchPad.pencilColor = this.color.rgba();
            this.showSelectedColor();
        }
    }

    executeColorSettings = function () {
        const colorSettings = document.getElementById('color-settings'); //color settings section (top of sketchpad)
        const opacityInput = document.getElementById('opacityInput');
        const recentColorsSection = document.getElementById('recentColors');


        this.showSelectedColor();
        this.showOpacityValue();

        colorSettings.addEventListener('click', this.handleColorSettings.bind(this));
        colorSettings.addEventListener('input', this.handleCustomColor.bind(this));
        opacityInput.addEventListener('input', this.handleOpacityInput.bind(this));
        recentColorsSection.addEventListener('click', this.handleRecentColor.bind(this));
    }
}


class Main {
    constructor () {
        this.objContext = this;
        
        this.sketchPad = new SketchPad(this.objContext);
        this.userSettings = new UserSettings(this.objContext);
        this.colorSettings = new ColorSettings(this.objContext);
    }

    execute = function () {
        this.sketchPad.executeSketchPad();
        this.userSettings.executeUserSettings();
        this.colorSettings.executeColorSettings();
    }
}


const main = new Main();
main.execute();

