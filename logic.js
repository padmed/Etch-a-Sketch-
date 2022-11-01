// 1. take the size of sketchpad and initialize it in a class (done)
// 2. make a method for building a grid in sketchpad (done)
// 3. add listener for grids in sketchpad (done)
// 4. make a method for coloring grids in sketchpad (done)
    // 1. be able to choose color (done)
// 5. make a method to be able to clear sketchpad (method implemented/ need to listen to button)
// 6. make option for grid option turn on/off
// 7. make option to draw with hover or click
// 8. fix the bug with invisible element

class EtchASketch {
    constructor() {
        //neccessary elements for application
        this.pad = document.getElementById('draw-box');
        this.colors = document.getElementById('colors');
        this.inputRange = document.getElementById('range');
        this.userSettings = document.getElementById('user-settings');
        this.invisibleElement = document.getElementById('invisibleElement');
        this.gridSizeText = document.getElementById('grid-size');
        

        //initialize sketchpad settings
        this.color = 'black';
        this.padSize = 16; //initialize pad size
        this.inputRange.value = 16; //sets grid size at minimum on restart
        

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
        }
    }

    //clears grid
    clearPad = function () {
        const toRemove = document.querySelectorAll('.parentDiv');
        toRemove.forEach((element) => element.remove());
    }

    colorGrid = function (event) {
        if(event.target.classList.contains('grid')) {

            event.target.setAttribute('style', `background-color: ${this.color}`)
            console.log(event.target)
        }
    }

    //sets propertie based on user selection, clears previous grid, fills new grid.
    #interactiveInputRange = function () {
        this.padSize = this.inputRange.value;
        this.clearPad();
        this.fillPad();
        this.showGridSize();
    }

    showGridSize = function () {
        this.gridSizeText.innerHTML = `Grid size: ${this.padSize}X${this.padSize}`;
    }

    // removes/adds invisible element based on window size
    #manipulateInvisibleElement = function () {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        if (height <= 821 && width <= 1102 ) {
            invisibleElement.classList.remove('invisibleElement');
        } else {
            invisibleElement.classList.add('invisibleElement');
        }
    }

    #takeColor = function (event) {
        this.color = event.target.getAttribute('data-color');
    }

    main = function () {
        this.fillPad();
        this.showGridSize();

        this.inputRange.addEventListener('input', this.#interactiveInputRange.bind(this)); // listens to input 'range'
        // this.userSettings.addEventListener('click', )
        invisibleElement.classList.add('invisibleElement'); //adds invisible element on program startup
        window.addEventListener('resize', this.#manipulateInvisibleElement); // listens for window resize
        this.colors.addEventListener('click', this.#takeColor.bind(this));
        this.pad.addEventListener('click', this.colorGrid.bind(this));
    }

}





const pad = new EtchASketch();


