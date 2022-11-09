class EtchASketch {
    constructor() {
        //neccessary elements for application
        this.pad = document.getElementById('draw-box');
        this.gridSize = document.getElementById('range'); // "input range" element
        this.userSettings = document.getElementById('user-settings'); //parent element for all user settings section
        this.invisibleElement = document.getElementById('invisibleElement'); 
        this.SketchPadSizeText = document.getElementById('grid-size'); //container for displaying sketchpad size
        this.colorSettings = document.getElementById('color-settings') //parent element for all color settings
        this.squares = null; // all square elements, initializes later after function draws them
        this.colorOpacity = document.querySelector('#opacityInput');
        

        //initialize sketchpad settings
        this.color = {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };

        this.padSize = 16; //initialize pad size
        this.gridSize.value = 16; //sets grid size - "input range" at minimum on restart
        this.gridBorders = false; 


        //Undo Redo Feature properties
        this.unprocessedActions = [];
        this.processedActions = [];

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
        };
        
        this.markEvent(event);

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
    gridSizeInput = function () {
        this.padSize = this.gridSize.value;
        this.clearPad();
        this.fillPad();
        this.showGridSize();
        this.drawBorders();
    }

    
    //takes input from user
    colorOpacityInput = function (event) {
        const userInput = event.target;

        this.color.a = (userInput.value / 100);
        this.selectedColor();
        this.showOpacityValue();
    }


    //displays color opacity
    showOpacityValue = function() {
        const displayOpacity = document.querySelector('#opacityValue');
        const opacityPercentage = Math.floor(this.color.a * 100);

        displayOpacity.innerHTML = `${opacityPercentage}%`
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
            
            this.selectedColor();
            return;
          }
        
        this.color.r = parseInt(hex.slice(1, 3), 16);
        this.color.g = parseInt(hex.slice(3, 5), 16);
        this.color.b = parseInt(hex.slice(5, 7), 16);
        
        this.selectedColor();
    }


    //displays current selected color
    selectedColor = function () {
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

        } 
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

    handleInputRanges = function (event) {
        if (event.target.id === 'opacityInput') {
            this.colorOpacityInput(event);

        } else if (event.target.id === 'range') {
            this.gridSizeInput(event);
            
        }
    }


    //undo redo feature functions
    markEvent = function (event) {
        this.unprocessedActions.push(event)
    }
    
    EventIntoActions = function () {
        this.processedActions = []; //clearing previous enterances

        this.unprocessedActions.forEach((event) => {
            if (event.type === 'mousedown') {
                this.processedActions.push([event]);

            } else {
                this.processedActions[this.processedActions.length - 1].push(event);
            }
        })
        
        console.log(this.processedActions);
    }


    main = function () {
        this.fillPad();
        this.showGridSize();
        this.selectedColor();
        this.showOpacityValue();
        const colorGridFunctionCopy = this.colorSquare.bind(this); //helps in refering the same object 

        this.userSettings.addEventListener('input', this.handleInputRanges.bind(this)); //handles range inputs
        invisibleElement.classList.add('invisibleElement'); //adds invisible element on program startup
        window.addEventListener('resize', this.#manipulateInvisibleElement); // listens for window resize
        this.colorSettings.addEventListener('click', this.handleColorSettings.bind(this));

        this.pad.addEventListener('mousedown', this.colorSquare.bind(this));
        this.pad.addEventListener('mousedown', () => this.pad.addEventListener('mouseover', colorGridFunctionCopy)); // Adds listener while mouse press, colors squares
        window.addEventListener('mouseup', () => this.pad.removeEventListener('mouseover', colorGridFunctionCopy)); // removes sketchpad listener after mouse release
    
        this.userSettings.addEventListener('click', this.handleUserSettings.bind(this));
        this.pad.addEventListener('mouseup', () => console.log(this.EventIntoActions()));
    }

}





const pad = new EtchASketch();

