// 1. take the size of sketchpad and initialize it in a class (done)
// 2. make a method for building a grid in sketchpad (done)
// 3. add listener for grids in sketchpad (done)
// 4. make a method for coloring grids in sketchpad (done)
    // 1. be able to choose color (done)
// 5. make a method to be able to clear sketchpad (done()
// 6. make option for grid option turn on/off (done)
// 7. make option to draw with hover or click
// 8. fix the bug with invisible element
// 9. Make opacity
    // 1. when color is choosen display that color in 5 different opacity levels;
    // 

class EtchASketch {
    constructor() {
        //neccessary elements for application
        this.pad = document.getElementById('draw-box');
        this.inputRange = document.getElementById('range'); // "input range" element
        this.userSettings = document.getElementById('user-settings'); //parent element for all user settings section
        this.invisibleElement = document.getElementById('invisibleElement'); 
        this.SketchPadSizeText = document.getElementById('grid-size'); //container for displaying sketchpad size
        this.colorSettings = document.getElementById('color-settings') //parent element for all color settings
        this.squares = null; // all square elements, initializes later after function draws them
        

        //initialize sketchpad settings
        this.color = {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };

        this.padSize = 16; //initialize pad size
        this.inputRange.value = 16; //sets grid size - "input range" at minimum on restart
        this.gridBorders = false; 

        this.main();
    }


    //creates parent - child div elements, takes grid form with css flexbox 
    fillPad = function () {
        for (let height = 1; height <= this.padSize; height++) {

            const div = document.createElement('div');
            div.classList.add('parentDiv');
            this.pad.appendChild(div);

            for (let width = 1; width <= this.padSize; width++) {

                const childDiv = document.createElement('div');
                childDiv.classList.add('grid');
                div.appendChild(childDiv);
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
            rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`)
        }
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


    //sets propertie based on user selection, clears previous grid, fills new grid.
    #interactiveInputRange = function () {
        this.padSize = this.inputRange.value;
        this.clearPad();
        this.fillPad();
        this.showGridSize();
        this.drawBorders();
    }


    //displays grid size in the app
    showGridSize = function () {
        this.SketchPadSizeText.innerHTML = `${this.padSize}X${this.padSize}`;
    }


    // removes/adds invisible element based on window size
    #manipulateInvisibleElement = function () {
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;

        if (windowHeight <= 821 && windowWidth <= 1102 ) {
            invisibleElement.classList.remove('invisibleElement');

        } else {
            invisibleElement.classList.add('invisibleElement');
        }
    }


    // converts hex value to rgb, so later to be able to adjust pencil color opacity
    hexToRGB = function (hex) {
        if (hex.length === 4) {
            let r = hex.slice(1,2);
            let g = hex.slice(2,3);
            let b = hex.slice(3,4);
          
            this.color.r = parseInt(r+r, 16);
            this.color.g = parseInt(g+g, 16);
            this.color.b = parseInt(b+b, 16);
            
            this.currentColor();
            return;
          }
        
        this.color.r = parseInt(hex.slice(1, 3), 16);
        this.color.g = parseInt(hex.slice(3, 5), 16);
        this.color.b = parseInt(hex.slice(5, 7), 16);
        
        this.currentColor();
    }

    currentColor = function () {
        const color = document.querySelector('#currentColor');
        color.style.backgroundColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`
    }
    

    handleColorSettings = function (event) {
        const colorSetting = event.target;

        if (colorSetting.id === 'rgb') {
            colorSetting.oninput = () =>  this.hexToRGB(colorSetting.value);

        } else if (colorSetting.classList.contains('color')) {
            this.hexToRGB(colorSetting.getAttribute('data-color'));

        } else if (colorSetting.id ==='eraser') {
            this.hexToRGB('#F6F7D7');

        } this.currentColor();
    }


    handleUserSettings = function (event) {
        const userSetting = event.target;

        if (userSetting.id == 'clear') {
            this.clearPad();
            this.fillPad();
            this.drawBorders();

        } else if (userSetting.name == 'border') {

            if (userSetting.value == 'border-on') {
                this.gridBorders = true;

            } else {
                this.gridBorders = false;

            } this.drawBorders(); //if there's event on grid-border option, this function takes radio input value, sets boolean based on input and calls function which draws border based on that boolean.
        }
    }

    
    main = function () {
        this.fillPad();
        this.showGridSize();
        this.currentColor();

        this.inputRange.addEventListener('input', this.#interactiveInputRange.bind(this)); // listens to input 'range'
        invisibleElement.classList.add('invisibleElement'); //adds invisible element on program startup
        window.addEventListener('resize', this.#manipulateInvisibleElement); // listens for window resize
        this.colorSettings.addEventListener('click', this.handleColorSettings.bind(this));
        this.pad.addEventListener('click', this.colorSquare.bind(this));
        this.userSettings.addEventListener('click', this.handleUserSettings.bind(this));
    }

}





const pad = new EtchASketch();
