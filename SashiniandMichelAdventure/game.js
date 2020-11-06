
const levels = [  
     // level 0
    ["ish", "rock", "", "fish", "",
"fenceside",  "rock", "", "", "rider",
"", "tree", "animate", "animate", "animate",
"", "water" , "", "", "",
"", "fence", "", "horseup", ""],

//level 1
 ["flag", "rock", "", "", "",
"fenceside",  "rock", "", "", "rider",
"", "tree", "animate", "animate", "animate",
"", "water" , "", "", "",
"", "fence", "", "horseup", ""],

//level 2
 ["flag", "rock", "", "", "",
"fenceside",  "rock", "", "", "rider",
"", "tree", "animate", "animate", "animate",
"", "water" , "", "", "",
"", "fence", "", "horseup", ""]

]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0; //starting level
var riderOn = false; // is the rider on
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level

//start game
window.addEventListener("load" , function (){
loadLevel();
});
//load levels 0- maxlevel
function loadLevel(){
let levelMap = levels[currentLevel];
let animateBoxes;
riderOn = false;

//load board
for(i = 0; i< gridBoxes.length; i++) {
gridBoxes[i].className = levelMap[i];
if (levelMap[i].includes("horse")) currentLocationOfHorse = i;
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
boxes[index].classList.add("enemyright");
}else {
   boxes[index].classList.add("enemyleft");
     }

//remove images from other boxes
for(i = 0; i < boxes.length; i++){
if(i != index){
boxes[i].classList.remove("enemyleft");
boxes[i].classList.remove("enemyright");
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

ff