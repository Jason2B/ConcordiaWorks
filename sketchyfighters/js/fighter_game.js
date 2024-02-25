console.log("game.js is loaded :)");

// PART A -------------------------------------------------
//* creating the elements 

//Create the Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
document.querySelector("#gameBox").appendChild(canvas);

//Load Sprites ->

//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.src = "images/paper.webp"
bgImage.onload = function () {
    bgReady = true;
};

//Win Frame Image
var winAReady = false;
var winAImage = new Image();
winAImage.src = "images/winblue.png";
winAImage.onload = function () {
    winAReady = true;
};
var winBReady = false;
var winBImage = new Image();
winBImage.src = "images/winred.png";
winBImage.onload = function () {
    winBReady = true;
};

// playerA Image
var playerAReady = false;
var playerAImage = new Image();
playerAImage.src = "images/spriteblue.png";
playerAImage.onload = function () {
    playerAReady = true;
}
// playerB Image
var playerBReady = false;
var playerBImage = new Image();
playerBImage.src = "images/spritered.png";
playerBImage.onload = function () {
    playerBReady = true;
}

//For player animation
var playerCurrentFrame = 0;

var bgAudioReady = false;
var bgAudio = document.getElementById("bg");
bgAudio.oncanplay = function () {
    bgAudioReady = true;
    bgAudio.loop = true;
};
// START OF GAME
document.getElementById("gameBox").style.display = "none";
document.getElementById("countdown").style.display = "none";

document.getElementById("playbtn").addEventListener( "click", function() {
    if (bgAudio.paused) {
        document.getElementById("playbtn").style.display = "none";
        document.getElementById("countdown").style.display = "block";
            document.getElementById("fight").play();

        setTimeout(function () { 
                document.getElementById("gameBox").style.display = "block";
                bgAudio.play(); 
                bgAudio.volume = 0.3;
            }, 3000);
		} else {
        bgAudio.pause();
        ctx.drawImage(tutorialImage,(canvas.width - tutorialImage.width)/2, 
                (canvas.height - tutorialImage.height) / 2);
		}
    });
// PART B -------------------------------------------------
//* placing the elements 

// Creating glabal game objects
var playerA = {
    speed: 12, //movement in pixels per tick
    width: 75,
    height: 100,
    l: 15
}
var playerB = {
    speed: 12, //movement in pixels per tick
    width: 75,
    height: 100,
    l: 15
}

//Part C * interaction - Velocity variables
var AvX = 0;
var AvY = 0;

var BvX = 0;
var BvY = 0;

var jumpA = false;
var jumpB = false;
var cA = 0;
var cB = 0;
var dirA = 0;
var dirB = 0;

var punchA = false;
var punchB = false;
checkCollision = false;

// Set Initial State (START)
var init = function () {

    //Placing playerA
    playerA.x = (canvas.width - playerA.width) * 0.75; 
    playerA.iy = (canvas.height - (playerA.height) - 10);
    playerA.y = playerA.iy;

    //Placing playerB 
    playerB.x = (canvas.width - playerB.width) / 4; 
    playerB.iy = (canvas.height - (playerB.height) - 10);
    playerB.y = playerB.iy;

};
//Arrow key movement
addEventListener("keydown", function (e) {
    console.log(e);
    //playerA
    if (e.keyCode == 38 && playerA.y == playerA.iy) { // JumpA
        jumpA = true;
    }
    if (e.keyCode == 37) { // Left
        AvX = -playerA.speed;
        AvY = 0;
        dirA = 0;
    }
    if (e.keyCode == 39) { // Right
        AvX = playerA.speed;
        AvY = 0;
        dirA = 101;
    }
    if (e.keyCode == 191) { // ATTACK A
        if (checkCollision(playerB,playerA)) {
            playerB.l--;
            document.getElementById("laserhit").play();
            console.log('Blue Hit! - ' + 'Red Lives: ' + playerB.l);
            //MOVE WHEN HIT
            // if (BvX > 0) {
            //     playerB.x = playerB.x - 55;
            // }
            // else {
            //     playerB.x = playerB.x + 55;
            // }
        }
        else {
            document.getElementById("lasermiss").play();
            console.log('missA');
        }        
    punchA = true;
    }

    //playerB
        if (e.keyCode == 87 && playerB.y == playerB.iy) { // JumpB
        jumpB = true;
    }
    if (e.keyCode == 65) { // Left
        BvX = -playerB.speed;
        BvY = 0;
        dirB = 101;
    }
    if (e.keyCode == 68) { // Right
        BvX = playerB.speed;
        BvY = 0;
        dirB = 0;
    }
    if (e.keyCode == 71) { // ATTACK B
        if (checkCollision(playerA,playerB)) {
            playerA.l--;
            document.getElementById("kickhit").play();
            console.log('Red Hit! - ' + 'Blue Lives: ' + playerA.l);
            //MOVE WHEN HIT
            // if (AvX > 0) {
            //     jumpA = true;
            //     playerA.x = playerA.x + 55;
            // }
            // else {
            //     playerA.x = playerA.x - 55;
            // }
        }
        else {
            document.getElementById("kickmiss").play();
            console.log('missB');
        }        
    punchB = true;
    }
}, false);

addEventListener("keyup", function (e) {
    // STOPS MOVING PLAYER
    if (e.keyCode == 191) { // punchA
        punchA = false;
    }
    if (e.keyCode == 71) { // punchB
        punchB = false;
    }
    //Arrow keys
    AvX = 0;
    BvX = 0;

}, false);


// Main Game Loop

var main = function () {
//WIN display win frame
    if (checkWinA()) {
        if (winAReady) {
            ctx.drawImage(winAImage, (canvas.width - winAImage.width)/2, 
                (canvas.height - winAImage.height) / 2);
        }
        document.getElementById("victory").play();
        document.getElementById("victory").volume = 0.3;
            bgAudio.pause(); 

        console.log(win);
    }
    if (checkWinB()) {
        if (winBReady) {
            ctx.drawImage(winBImage, (canvas.width - winBImage.width)/2, 
                (canvas.height - winBImage.height) / 2);

        }
        document.getElementById("victory").play();
            document.getElementById("victory").volume = 0.3;
            bgAudio.pause(); 

        console.log(win);
    }
    else {
    //----> MOVE playerA (BLUE)<----
        if (playerA.x > 0 && playerA.x < canvas.width - playerA.width) {
            playerA.x += AvX;
        }
        else {
            playerA.x -= AvX;
            AvX = -AvX; //bounce horizontal
        }

    // ----> MOVE playerB (RED)<----
        if (playerB.x > 0 && playerB.x < canvas.width - playerB.width) {
            playerB.x += BvX;
        }
        else {
            playerB.x -= BvX;
            BvX = -BvX; //bounce horizontal
        }

    // ^^^ JUMP playerA (BLUE)^^^
        if (jumpA) {
            console.log("jumpA");
            
            if (cA < 28) {
                playerA.y = playerA.iy - cA*6;
                cA++;
                console.log(cA);
            }
            else {
                jumpA = false;
                cA = 0;
            }
        }
        if (playerA.y < playerA.iy) {
            playerA.y = playerA.y + 8;
        }
        else {
            playerA.y = playerA.iy;
        }

    //^^^ JUMP playerB (RED) ^^^     
        if (jumpB) {
            console.log("jumpB");
            if (cB < 28) {
                playerB.y = playerB.iy - cB*6;
                cB++;
            }
            else {
                jumpB = false;
                cB = 0;
            }
        }
        if (playerB.y < playerB.iy) {
            playerB.y = playerB.y + 8;
        }
        else {
            playerB.y = playerB.iy;
        }
}
    render();
    window.requestAnimationFrame(main);
}

//Draw Everything
var render = function () {

     if (bgReady) {
        ctx.fillStyle = ctx.createPattern(bgImage, 'repeat');
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    if (playerAReady) {
		// Draw the right image according to direction
        if (jumpA) { //JUMP
			ctx.drawImage(playerAImage, 150, dirA, 75, 100, playerA.x, playerA.y, 75, 100);
		}
        else if (AvX > 0 && AvY == 0) { //GOING right
            ctx.drawImage(playerAImage, 75, dirA, 75, 100, playerA.x, playerA.y, 75, 100);
        }
        else if (punchA) { //PUNCH
            ctx.drawImage(playerAImage, 226, dirA, 75, 100, playerA.x, playerA.y, 75, 100);
        }
        else if (AvX == 0 && AvY == 0) { //STANCE
			ctx.drawImage(playerAImage, 0, dirA, 75, 100, playerA.x, playerA.y, 75, 100);
		}
		else { //GOING Left -- DEFAULT
		    ctx.drawImage(playerAImage, 75, dirA, 75, 100, playerA.x, playerA.y, 75, 100);
        }
	}    
    if (playerBReady) {
        // Draw the right image according to direction
        if (jumpB) { //GOING UP
            ctx.drawImage(playerBImage, 76, dirB, 75, 100, playerB.x, playerB.y, 75, 100);
		}
		else if (BvX < 0 && BvY == 0) { //GOING LEFT
			ctx.drawImage(playerBImage, 151, dirB, 75, 100, playerB.x, playerB.y, 75, 100);
		}
        else if (punchB) { //PUNCH
            ctx.drawImage(playerBImage, 226, dirB, 75, 100, playerB.x, playerB.y, 75, 100);
        }
		else if (BvX == 0 && BvY == 0) { //STANCE
			ctx.drawImage(playerBImage, 0, dirB, 75, 100, playerB.x, playerB.y, 75, 100);
		}
		else { //GOING RIGHT  -- DEFAULT
			ctx.drawImage(playerBImage, 151, dirB, 75, 100, playerB.x, playerB.y, 75, 100);
		}
    }

    //Label - Health Bar
    var healthA = (5 * playerA.l);
    var healthB = (5 * playerB.l);

    // Health Bar playerA (BLUE)
    if (healthA <= 0) {
        ctx.fillStyle = "red";
        ctx.fillText("FINISH HIM!", playerA.x, playerA.y);
    }
    else if (healthA < 25) {
        ctx.fillStyle = "red";
        ctx.fillRect(playerA.x,(playerA.y - 10), healthA, 10);

    }
    else if (healthA < 50) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(playerA.x, (playerA.y - 10), healthA, 10);
    }
    else {
        ctx.fillStyle = "green";
        ctx.fillRect(playerA.x, (playerA.y - 10), healthA, 10);
    }
    // Health Bar playerB (RED)
    if (healthB <= 0) {
        ctx.fillStyle = "blue";
        ctx.font = "10px";
        ctx.fillText("FINISH HIM!", playerB.x, playerB.y);
    }
    else if (healthB < 25) {
        ctx.fillStyle = "red";
        ctx.fillRect(playerB.x, (playerB.y - 10), healthB, 10);

    }
    else if (healthB < 50) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(playerB.x, (playerB.y - 10), healthB, 10);
    }
    else {
        ctx.fillStyle = "green";
        ctx.fillRect(playerB.x, (playerB.y - 10), healthB, 10);
    }
    ctx.fillStyle = "black";
    ctx.font = "20px reenie beanie"

    // console.log(healthA);
    // console.log(healthB);
    console.log("render")
}

//Function to Check for Collisions on PUNCH *******
var checkCollision = function (obj1,obj2) {
    if (
        obj1.x < (obj2.x +obj2.width) &&
        (obj1.x + obj1.width) > obj2.x
    )
    {
        return true;
    }
};

//Check if we have won
var checkWinB = function () {
    if (playerA.l >= 0) { 
        return false;
    } else { 
        return true;
    }
};

var checkWinA = function () {
    if (playerB.l >= 0) { 
        return false;
    } else { 
        return true;
    }
};
var frameAnimation = function () {

    //handle the animation
    switch(playerCurrentFrame) {
        case 0: //first frame
            ctx.drawImage(playerBImage, 0, 0, 75, 100, playerB.x, playerB.y, 75, 100,);
            playerCurrentFrame++;
            break;
        case 1: //second frame
            ctx.drawImage(playerImageB, 76, 0, 75, 100, playerB.x, playerB.y, 75, 100,);
            playerCurrentFrame++;
            break;
        case 2:  //third frame
            ctx.drawImage(playerImageB, 156, 0, 75, 100, playerB.x, playerB.y, 75, 100,);
            playerCurrentFrame++;
            break;
        case 3:  //fourth frame
            ctx.drawImage(playerImageB, 226, 0, 75, 100, playerB.x, playerB.y, 75, 100,);
            playerCurrentFrame++;
            break;
        case 4:  //fourth frame
            ctx.drawImage(playerImageB, 300, 0, 75, 100, playerB.x, playerB.y, 75, 100,);
            playerCurrentFrame++;
            break;

    }
	
};

init();
//Start the gameplay
window.requestAnimationFrame(main);







