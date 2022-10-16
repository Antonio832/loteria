if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if(array === this)
        return true;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


let imgs = []


function preload(){
    for(let i = 0; i < 53; i++){
        let temp = loadImage(`./Cartas Lotería/${i + 1}.jpg`)
        imgs.push(temp)
    }
}

const PWIDTH = 117
const PHEIGHT = 164
const GAP = 28.346

let history = []

function setup(){
    let c = createCanvas(612, 792)
    background(255)
    console.log(imgs)
    imageMode(CORNER)
    rectMode(CORNER)
    fill(0)
    for(let i = 0; i < 4; i++){
        for(let i = 0; i < 4; i++){
            let y = (i * PHEIGHT + (GAP * (i + 1)))
            for(let j = 0; j < 4; j++){
                let x = (GAP * (j + 1)) + (j * PWIDTH)
                rect(x - 2, y - 2, PWIDTH + 4, PHEIGHT + 4)
                let index = Math.floor(Math.random() * imgs.length)
                while(true){
                    if(history.includes(index)){
                        index = Math.floor(Math.random() * imgs.length)
                    }else{
                        history.push(index)
                        break
                    }
                }
                image(imgs[index], x, y, PWIDTH, PHEIGHT)
                
            }
        }
        history = []
        save(c, `sample${i + 1}.png`)
    }
}
