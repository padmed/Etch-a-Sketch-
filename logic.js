// 1. take the size of sketchpad and initialize it in a class
// 2. make a method for building a grid in sketchpad
// 3. add listener for grids in sketchpad
// 4. make a method for coloring grids in sketchpad
// 5. make a method to be able to clear sketchpad
// 6. make option for grid option turn on/off


class EtchASketch {
    constructor(size) {
        this.pad = document.getElementById('draw-box');
        this.padSize = 16;
        this.color = 'black';
    }

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

        console.log(div.childNodes)
        }
    }



}

pad = new EtchASketch();



// const range = document.getElementById('range');
// range.addEventListener('input', function (event) {
//     pad.padSize = range.value;
//     pad.fillPad()
//     console.log(range.value)
// })


