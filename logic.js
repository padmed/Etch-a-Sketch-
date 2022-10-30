// 1. take the size of sketchpad and initialize it in a class (done)
// 2. make a method for building a grid in sketchpad (done)
// 3. add listener for grids in sketchpad (done)
// 4. make a method for coloring grids in sketchpad
// 5. make a method to be able to clear sketchpad (method implemented/ need to listen to button)
// 6. make option for grid option turn on/off
// 7. make option to draw with hover or click


class EtchASketch {
    constructor() {
        this.pad = document.getElementById('draw-box');
        this.colorList = document.querySelectorAll('.color');
        this.padSize = 16;
        this.color = 'black';
    }

    //creates parent - child div elements, takes grid form with css flexbox 
    fillPad = function (){
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
}



class EtchASketchMain {
    constructor () {
        this.pad = new EtchASketch;
        this.inputRange = document.getElementById('range');
        this.invisibleElement = document.getElementById('invisibleElement');
        
        this.main();
    }

    //sets propertie based on user selection, clears previous grid, fills new grid.
    interactiveInputRange = function () {
        this.pad.padSize = this.inputRange.value;
        this.pad.clearPad();
        this.pad.fillPad();
    }

    // removes/adds invisible element based on window size
    manipulateInvisibleElement = function () {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        if (height <= 821 && width <= 1102 ) {
            invisibleElement.classList.remove('invisibleElement');
        } else {
            invisibleElement.classList.add('invisibleElement');
        }
    }
        

    main = function () {
        this.inputRange.addEventListener('input', this.interactiveInputRange.bind(this)); // listens to input 'range'
        invisibleElement.classList.add('invisibleElement'); //adds invisible element on program startup
        window.addEventListener('resize', this.manipulateInvisibleElement) // listens for window resize
    }
}



program = new EtchASketchMain()



