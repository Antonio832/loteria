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

// let arr1 = [1,2,3]
// let arr2 = [4,5,6]
// let arr3 = [7,8,9]

// test1 = [[...arr1],[...arr2]]

// let flag = false

// for(let card of test1){
//     if(card.equals(arr3)){
//         flag = true
//         break
//     }
// }

// console.log(flag)



let imgs = []


function preload(){
    for(let i = 0; i < 54; i++){
        let temp = loadImage(`./Cartas Lotería/${i + 1}.jpg`)
        imgs.push(temp)
    }
}

const PWIDTH = 117
const PHEIGHT = 164
const GAP = 28.346

let historyLocal = []

let historyGlobal = []

let nCard = 4
let counter = 0

function setup(){
    let c = createCanvas(612, 792)
    background(255)
    imageMode(CORNER)
    rectMode(CORNER)
    fill(0)
    
    while(true){
        // each row
        for(let i = 0; i < 4; i++){

            let y = (i * PHEIGHT + (GAP * (i + 1)))
            // each cell
            for(let j = 0; j < 4; j++){
                let x = (GAP * (j + 1)) + (j * PWIDTH)
                rect(x - 2, y - 2, PWIDTH + 4, PHEIGHT + 4)
                let index = Math.floor(Math.random() * imgs.length)
                while(true){
                    if(historyLocal.includes(index)){
                        index = Math.floor(Math.random() * imgs.length)
                    }else{
                        historyLocal.push(index)
                        break
                    }
                }
                image(imgs[index], x, y, PWIDTH, PHEIGHT)
                
            }
        }
        if(!historyGlobal.length){
            historyGlobal.push(historyLocal)
            historyLocal = []
            // Uncomment below to save to browser each card (requires allow pop-up)
            
            save(c, `Loteria No. ${counter + 1}.png`)
        }else{
            let hasExist = false
            for(let card of historyGlobal){
                if(card.equals(historyLocal)){
                    hasExist = true
                    break
                }
            }

            if(!hasExist){
                historyGlobal.push(historyLocal)
                historyLocal = []
                // Uncomment below to save to browser each card (requires allow pop-up)
                save(c, `Loteria No. ${counter + 1}.png`)
                counter += 1
                console.log(counter)
            }
        }

        if(counter == nCard){
            break
        }
    }
    
}
