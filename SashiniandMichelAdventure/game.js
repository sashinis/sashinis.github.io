const levels = [  
     // level 0
    ["fish", "", "bag", "", "",
"",  "", "", "", "",
"", "diver", "animate", "animate", "animate",
"seaweed", "rock" , "", "", "",
"flag", "seaweed", "", "", "hat"],

//level 1
 ["animate", "", "", "seaweed", "flag",
"animate",  "animate", "animate", "bag", "diver",
"", "bag", "", "", "",
"", "", "", "", "",
"", "" , "", "diver", "hat",
"fish", "", "", "", ""],

//level 2
 ["flag", "seaweed", "", "", "",
"bag",  "", "", "diver", "hat",
"animate", "animate", "animate", "animate", "animate",
"", "" , "", "", "rock",
"", "", "", "", ""]

]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
//add one more object
const noPassObstacles = ["diver","bag","rock"];


var currentLevel = 0; //starting level
var riderOn = false; // is the rider on
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level
var widthOfBoard = 5;
var i;

//start game
window.addEventListener("load" , function (){
loadLevel();
});

//move horse
document.addEventListener("keydown", function (e) {
    console.log("currentLocationOfHorse: " + currentLocationOfHorse);
	    console.log("widthOfBoard: " + widthOfBoard);
    switch (e.keyCode) {
            
        case 37: //left arrow
           if (currentLocationOfHorse % widthOfBoard !== 0) {
                tryToMove("left");
              }
            break;
            
        case 38: //up arrow
            if (currentLocationOfHorse - widthOfBoard >= 0) {
                tryToMove("up");
            }
            break;
            
        case 39: //right arrow
            if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
                tryToMove("right");
               }
            break;
            
        case 40: //down arrow
             if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard) {
                tryToMove("down");
            }
            break;
    } //switch
}); //key event listener

// try to move horse
function tryToMove(direction) {
    
    //location before move
    let oldLocation = currentLocationOfHorse;
    
    // class of location before move
    let oldClassName = gridBoxes[oldLocation].className;
    
    let nextLocation = 0; //location we wish to move to
    let nextClass = ""; //class of location we wish to move to
    
    let nextLocation2 = 0;
    let nextClass2 = "";
    
    let newClass = ""; //new class to switch to if move successful
    
    
    switch (direction) {
        
        case "left" :
            nextLocation = currentLocationOfHorse - 1;
            break;
            
        case "right" :
            nextLocation = currentLocationOfHorse + 1;
            break;
            
        case "up" :
            nextLocation = currentLocationOfHorse - widthOfBoard;
            break;
            
        case "down" :
            nextLocation = currentLocationOfHorse + widthOfBoard;
            break;
            
    } //switch
    
    nextClass = gridBoxes[nextLocation].className;
    
    //if the obstacle is not passable, don't move
    if(noPassObstacles.includes(nextClass)){ return; }
    
    //if it's a fence, and there is no rider, not move
    if(!riderOn && nextClass.includes("seaweed")){ return; }
    
    // if there is a fence, move two spaces with animation
    
    if (nextClass.includes("seaweed")){
        
        // hat must be on to jump
        if(riderOn){
            gridBoxes[currentLocationOfHorse].className = "";
            oldClassName = gridBoxes[nextLocation].className;
            
            // set values according to direction
            if (direction == "left") {
                nextClass = "fishleftsea";
                nextClass2 = "fishlefthat";
                nextLocation2 = nextLocation - 1;  
            } else if (direction == "right") {
                nextClass = "fishrightsea";
                nextClass2 = "fishrighthat";
                nextLocation2 = nextLocation + 1;  
            } else if (direction == "up") {
                nextClass = "fishupsea";
                nextClass2 = "fishuphat";
                nextLocation2 = nextLocation - widthOfBoard; 
            } else if (direction == "down") {
                nextClass = "fishdownsea";
                nextClass2 = "fishdownhat";
                nextLocation2 = nextLocation + widthOfBoard;  
            } //else if
            
            // show fish jumping
            gridBoxes[nextLocation].className = nextClass;
            
            setTimeout(function () {
                
                // set jump back to just a fence
                gridBoxes[nextLocation].className = oldClassName;
                
                // update current location of horse to be 2 spaces past take off
                currentLocationOfHorse = nextLocation2;
                
                //get class of box after jump
                nextClass = gridBoxes[currentLocationOfHorse].className;
                
                // show horse and rider after landing
                gridBoxes[currentLocationOfHorse].className = nextClass2;
                
                //if next box is a flag go up a level
                levelUp(nextClass);
            }, 350);
            return;
        } //rider
    } //if class has seaweed
    
    
    
    //if there is a rider, add rider
    if (nextClass == "hat") {
          riderOn = true;  
        }
    
    //if there is a bridge in the old location keep it
    if (oldClassName.includes("bridge")) {
        gridBoxes[oldLocation].className = "bridge";
    } else {
        gridBoxes[oldLocation].className = "";
    } //else
    
    // build name of new class
    newClass = (riderOn) ? "fishhat" : "fish";
    newClass += direction;
    
    // if there is a bridge in the next location , keep it
    if (gridBoxes[nextLocation].classList.contains("bridge")){
      newClass += " bridge";     
    }
    
    //move 1 space
    currentLocationOfHorse = nextLocation;
    gridBoxes[currentLocationOfHorse].className = newClass;
    
    //if it is an enemy, end game
    if (nextClass.includes("shark")){
    document.getElementById("lose").style.display = "block"
        return;
    }
    //move up to next level if needed
    
    
} //trytoMove

// move up a level
function levelUp(nextClass){
    if (nextClass == "flag" && riderOn){
        document.getElementById("levelup").style.display = "block";
        clearTimeout(currentAnimation);
        setTimeout (function() {
            document.getElementById("levelup").style.display = "none";
            //make if statement if no more levels
            currentLevel++;
            loadLevel();
			          
        }, 1000);
    } //if
}//levelUp

//load levels 0- maxlevel
function loadLevel(){
let levelMap = levels[currentLevel];
let animateBoxes;
riderOn = false;

//load board
for(i = 0; i< gridBoxes.length; i++) {
gridBoxes[i].className = levelMap[i];
if (levelMap[i].includes("shark")) currentLocationOfHorse = i;
}//for
animateBoxes = document.querySelectorAll(".animate");

animateEnemy(animateBoxes, 0, "right");

}// loadLevel


// animate enemy left to right (could add up and down to this)
//boxes- array of grid boxes that include animation
// index - current location of animation
// direction - current direction of animation
function animateEnemy(boxes, index, direction) {
if (boxes.length <= 0) { return;}

//update images
if (direction == "right") {
boxes[index].classList.add("sharkr");
}else {
   boxes[index].classList.add("sharkl");
     }

//remove images from other boxes
for(i = 0; i < boxes.length; i++){
if(i != index){
boxes[i].classList.remove("sharkl");
boxes[i].classList.remove("sharkr");
}
}//for

//moving right
if (direction == "right") {
//turn around if hit right side
if (index == boxes.length -1){
index--;
direction = "left";
}else{
index++;
}
//moving left
}else {
//turn around if hit left side
if (index == 0) {
index ++;
direction = "right";
}else {
index--;
}
}//else

  currentAnimation = setTimeout(function(){
 animateEnemy(boxes, index, direction);
  }, 750);

}// animateEnemy

