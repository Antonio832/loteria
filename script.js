
// Code to write a prototype on the Array type, to verify if one array is equal to an other, 
// source: https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript

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

// Images array, all p5image objects will be loaded here
let imgs = []

// P5 preload function, first function that runs, used to preload the images
function preload(){
    for(let i = 0; i < 54; i++){
        let temp = loadImage(`./Cartas Lotería/${i + 1}.jpg`)
        imgs.push(temp)
    }
}

// fixed width, height and gaps for tiles
const PWIDTH = 117
const PHEIGHT = 164
const GAP = 28.346

// to save a history of each tile of each card instance (while its being generated)
let historyLocal = []

// to track the created cards, to prevent generating duplicates
let historyGlobal = []

// Edit the nCard variable to the ammount of cards you want to save
let nCard = 4
let counter = 0

// runs after preload
function setup(){
    // creates p5 canvas
    let c = createCanvas(612, 792)
    // sets white background
    background(255)
    // sets image rendering mode, to render from the corner
    imageMode(CORNER)
    // sets rectangle rendering mode, to render from the corner
    rectMode(CORNER)
    // sets fill color to black
    fill(0)
    
    // lets generate
    while(true){
        // each row
        for(let i = 0; i < 4; i++){
            // calculating y offset
            let y = (i * PHEIGHT + (GAP * (i + 1)))
            // each tile
            for(let j = 0; j < 4; j++){
                // calculating x offset
                let x = (GAP * (j + 1)) + (j * PWIDTH)
                // drawing rectangle with offset of 2 pixels to generate a border around image
                rect(x - 2, y - 2, PWIDTH + 4, PHEIGHT + 4)
                // generating a random index from the imgs array
                let index = Math.floor(Math.random() * imgs.length)
                // verifying that the index hasnt been generated previously in this card
                // to prevent duplicated tiles
                while(true){
                    // if the index is in the history we generate a different index
                    if(historyLocal.includes(index)){
                        index = Math.floor(Math.random() * imgs.length)
                    }else{ // if the index doesnt exist yet we push it to the history and break out from the verification
                        historyLocal.push(index)
                        break
                    }
                }
                // rendering image
                image(imgs[index], x, y, PWIDTH, PHEIGHT)
            }
        } // done generating card

        // if the global history of cards is empty, add one to it
        if(!historyGlobal.length){
            // saving the history of tiles for this card
            historyGlobal.push(historyLocal)
            // clearing local history
            historyLocal = []
            // Uncomment below to save to browser each card (requires allow pop-up)
            // save(c, `Loteria No. ${counter + 1}.png`)
        }else{
            // if it has been generated before
            let hasExist = false

            for(let card of historyGlobal){
                //if the card is equal to any previous card we dont save it
                if(card.equals(historyLocal)){
                    hasExist = true
                    break
                }
            }
            
            // if it doesnt exist yet we save it and generate and continue
            // if it exists we dont do anything and the while loop continues
            if(!hasExist){
                // saving the history of tiles for this card
                historyGlobal.push(historyLocal)
                // clearing local history
                historyLocal = []
                // Uncomment below to save to browser each card (requires allow pop-up)
                // save(c, `Loteria No. ${counter + 1}.png`)

                // incrementing counter
                counter += 1
            }
        }

        // break once we meet the number of cards we want to generate
        if(counter == nCard){
            break
        }
    }
}
