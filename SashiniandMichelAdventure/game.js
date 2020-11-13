const levels = [

    // level 0

    ["fish", "", "bag", "", "",

        "", "", "", "", "",

        "", "diver", "animate", "animate", "animate",

        "seaweed", "rock", "", "bridge", "bridge",

        "flag", "seaweed", "", "", "hat"
    ],


    //level 1

    ["hat", "", "", "", "bag",

        "animate", "animate", "animate", "bag", "flag",

        "bridge", "bag", "", "diver", "seaweed",

        "", "", "", "bridge", "",

        "fish", "", "", "diver", ""
    ],


    //level 2

    ["flag", "seaweed", "animate2", "animate2", "animate2",

        "bag", "bag", "", "diver", "fish",

        "", "", "animate", "animate", "animate",

        "bridge", "", "", "", "rock",

        "hat", "bridge", "", "", ""
    ],


    //level 3

    ["fish", "", "", "", "",

        "bridge", "", "", "diver", "",

        "animate2", "animate2", "animate2", "bridge", "",

        "seaweed", "diver", "animate", "animate", "animate",

        "flag", "rock", "", "bag", "hat"],


    // level 0

    ["flag", "seaweed", "bridge", "bridge", "",

        "bag", "diver", "diver", "diver", "",

        "", "", "", "animate2", "animate2",

        "", "animate", "animate", "animate", "animate",

        "fish", "", "", "rock", "hat"
    ]


]; // end of levels

var points = 1000;

var myfunc = setInterval(function() {
   points--;
}, 1000)


//variable declaration
const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["diver", "bag", "rock"]; 
const newGame = 0;
var canMove;
var currentLevel = 0; //starting level
var riderOn = false; // is the rider on
var currentLocationOfHorse = 0;
var currentAnimation; //allows 2 animation per level
var currentAnimation2;
var widthOfBoard = 5;
var move = true;
var i;
var points = 1000;
var endGame = true;

//start game
window.addEventListener("load", function() {

    loadLevel(newGame);
    window.clearInterval(currentAnimation);
    window.clearInterval(currentAnimation2);
    endGame = false;
    document.getElementById("welcomeScreen").style.display = "block";
});


//move horse
document.addEventListener("keydown", function(e) {
    
    switch (e.keyCode) {
        case 37: //left arrow
            
            if (currentLocationOfHorse % widthOfBoard !== 0 && move == true) {
                tryToMove("left");
            }
            break;
            
        case 38: //up arrow

            if (currentLocationOfHorse - widthOfBoard >= 0 && move == true) {
                tryToMove("up");
            }
            break;

        case 39: //right arrow

            if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1 && move == true) {
                tryToMove("right");
            }
            break;

        case 40: //down arrow

            if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard && move == true) {
                tryToMove("down");
            }
            break;
    } //switch
}); //key event listener


// try to move horse
function tryToMove(direction) {

    
    let oldLocation = currentLocationOfHorse; //location before move
    let oldClassName = gridBoxes[oldLocation].className; // class of location before move
    let nextLocation = 0; //location we wish to move to
    let nextClass = ""; //class of location we wish to move to
    let nextLocation2 = 0;
    let nextClass2 = "";
    let nextClass3 = ""; //class for bridge image
    let newClass = ""; //new class to switch to if move successful

    switch (direction) {
            
        case "left":
            nextLocation = currentLocationOfHorse - 1;
            break;

        case "right":
            nextLocation = currentLocationOfHorse + 1;
            break;

        case "up":
            nextLocation = currentLocationOfHorse - widthOfBoard;
            break;

        case "down":
            nextLocation = currentLocationOfHorse + widthOfBoard;
            break;
    } //switch
    nextClass = gridBoxes[nextLocation].className;

    //if the obstacle is not passable, don't move
    if (noPassObstacles.includes(nextClass)) {return;}

    //if it's a fence, and there is no rider, not move
    if (!riderOn && nextClass.includes("seaweed")) {return;}

    // if there is a fence, move two spaces with animation
    if (nextClass.includes("seaweed")) {
        
        // hat must be on to jump
        if (riderOn) {
			move = false;
            gridBoxes[currentLocationOfHorse].className = "";
            oldClassName = gridBoxes[nextLocation].className;

            // set values according to direction
            if (direction == "left") {
                
                nextClass = "fishleftsea";
                nextClass2 = "fishlefthat";
                nextClass3 = "fishleftbubbles";
                
                nextLocation2 = nextLocation - 1;
        
            } else if (direction == "right") {
				
                nextClass = "fishrightsea";
                nextClass2 = "fishrighthat";
                nextClass3 = "fishrightbubbles";

                nextLocation2 = nextLocation + 1;
			
            } else if (direction == "up") {
				
                nextClass = "fishupsea";
                nextClass2 = "fishuphat";
                nextClass3 = "fishupbubbles";

                nextLocation2 = nextLocation - widthOfBoard;
				
            } else if (direction == "down") {
				
                nextClass = "fishdownsea";
                nextClass2 = "fishdownhat";
                nextClass3 = "fishdownbubbles";

                nextLocation2 = nextLocation + widthOfBoard;
            } //else if

            //error checking can't land on obstacle
			let errorCheck = gridBoxes[nextLocation2].className;
			if(noPassObstacles.includes(errorCheck)){
				return;
			}//if
			
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;
            
            // show fish jumping
            gridBoxes[nextLocation].className = nextClass;

            setTimeout(function() {

                // set jump back to just a fence
                gridBoxes[nextLocation].className = oldClassName;

                // update current location of horse to be 2 spaces past take off
                currentLocationOfHorse = nextLocation2;

                //get class of box after jump
                nextClass = gridBoxes[currentLocationOfHorse].className;


                // show horse and rider after landing
                gridBoxes[currentLocationOfHorse].className = nextClass2;
                gridBoxes[currentLocationOfHorse].className = nextClass3;

                //if next box is a flag go up a level
                levelUp(nextClass);
            }, 350);
            return;
        } //rider
    } //if class has seaweed
    
    if(noPassObstacles.includes(gridBoxes[nextLocation2].className)){
				return;
    }//if

    //if there is a rider, add rider
    if (nextClass == "hat") {
        riderOn = true;
    } //if

    //if there is a bridge in the old location keep it
    if (oldClassName.includes("bridge")) {
        gridBoxes[oldLocation].className = "bridge";
    } else {
        gridBoxes[oldLocation].className = "";
    } //else

    // build name of new class
    newClass = (riderOn) ? "fishhat" : "fish";
    newClass3 = (riderOn) ? "fishhatbubbles" : "fishbubbles";
    newClass += direction;
    newClass3 += direction;

    // if there is a bridge in the next location , keep it
    if (gridBoxes[nextLocation].classList.contains("bridge")) {
        newClass += "bridge";
    }

    //move 1 space
    currentLocationOfHorse = nextLocation;
    gridBoxes[currentLocationOfHorse].className = newClass;

    //if it is an enemy, end game
    if (nextClass.includes("shark")) {
        
        document.getElementById("lose").style.display = "block"
        currentLevel = newGame;
        window.clearInterval(currentAnimation);
        window.clearInterval(currentAnimation2);
        endGame = false;
        
        return;
    }//if

    //move up to next level if needed
    levelUp(nextClass);

} //trytoMove


// move up a level
function levelUp(nextClass) {
	
	
    if (nextClass == "flag" && riderOn) {
		move = false;
        document.getElementById("levelup").style.display = "block";
        clearTimeout(currentAnimation);
        clearTimeout(currentAnimation2);

        setTimeout(function() {
            document.getElementById("levelup").style.display = "none";
             move = true;
            if(currentLevel < 4){ 
				currentLevel++;
				}else{
                currentLevel = newGame;
                window.clearInterval(currentAnimation);
                window.clearInterval(currentAnimation2);
                endGame = false;
				document.getElementById("gameOver").style.display = "block";
				return;
				}
            //make if statement if no more levels
           
            loadLevel(currentLevel);

        }, 1000);
    } //if
} //levelUp


//load levels 0- maxlevel


function loadLevel() {
	move = true;
if(currentLevel == 5){
	move = false;
document.getElementById("gameOver").style.display = "block";
	console.log("You got " + points + " points");

}



    let levelMap = levels[currentLevel];
    let animateBoxes;
    let animateBoxes2;
    riderOn = false;
    endGame =true;
    //load board
    for (i = 0; i < gridBoxes.length; i++) {
        gridBoxes[i].className = levelMap[i];
        if (levelMap[i].includes("shark")) currentLocationOfHorse = i;
    } //for

    animateBoxes = document.querySelectorAll(".animate");
    animateBoxes2 = document.querySelectorAll(".animate2");
    animateEnemy(animateBoxes, 0, "right");
    animateEnemy2(animateBoxes2, 0, "right");
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("lose").style.display = "none";
		
} // loadLevel



// animate enemy left to right (could add up and down to this)
//boxes- array of grid boxes that include animation
// index - current location of animation
// direction - current direction of animation
function animateEnemy(boxes, index, direction) {

    if (boxes.length <= 0) {
        return;
    }

    //update images
    if (direction == "right") {
        boxes[index].classList.add("sharkr");
    } else {
        boxes[index].classList.add("sharkl");
    }


    //remove images from other boxes
    for (i = 0; i < boxes.length; i++) {
        if (i != index) {
            boxes[i].classList.remove("sharkl");
            boxes[i].classList.remove("sharkr");
        } //if

    } //for

    //moving right
    if (direction == "right") {
        
        //turn around if hit right side
        if (index == boxes.length - 1) {
            index--;
            direction = "left";
        } else {
            index++;
        }

    //moving left
    } else {
        
        //turn around if hit left side
        if (index == 0) {
            index++;
            direction = "right";
        } else {
            index--;
        } //else
    } //else
    currentAnimation = setTimeout(function() {
    animateEnemy(boxes, index, direction);
    }, 750);
    
    var nextClass = gridBoxes[currentLocationOfHorse].className;
    if (nextClass.includes("shark")) {
        currentLevel = newGame;
        window.clearInterval(currentAnimation);
        window.clearInterval(currentAnimation2);
        endGame = false;
        document.getElementById("lose").style.display = "block";
        return;
        
} //if
} // animateEnemy

function animateEnemy2(boxes, index, direction) {

    if (boxes.length <= 0) {
        return;
    }

    //update images
    if (direction == "right") {
        boxes[index].classList.add("sharkr");
    } else {
        boxes[index].classList.add("sharkl");
    }

    //remove images from other boxes
    for (i = 0; i < boxes.length; i++) {
        if (i != index) {
            boxes[i].classList.remove("sharkl");
            boxes[i].classList.remove("sharkr");
        } //if
    } //for

    //moving right
    if (direction == "right") {
        
        //turn around if hit right side
        if (index == boxes.length - 1) {
            index--;
            direction = "left";
        } else {
            index++;
        }

        //moving left
    } else {
        
        //turn around if hit left side
        if (index == 0) {
            index++;
            direction = "right";
        } else {
            index--;
        } //else
    } //else
    
    currentAnimation2 = setTimeout(function() {
    animateEnemy2(boxes, index, direction);
    }, 750);
	
var nextClass = gridBoxes[currentLocationOfHorse].className;
    
 if (nextClass.includes("shark")) {
     currentLevel = newGame;
                window.clearInterval(currentAnimation2);
                endGame = false;
        document.getElementById("lose").style.display = "block";	
		return;
 }


} // animateEnemys


// reload the game
function reLoadGame() {
	location.reload();
} 
