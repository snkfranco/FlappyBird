// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdx = boardWidth/8;
let birdy = boardHeight/2;
let birdImage;

let bird = {
    x : birdx,
    y : birdy,
    width : birdWidth,
    height : birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

// physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // load images
    birdImage = new Image();
    birdImage.src = "./Assets/flappybird.png";
    birdImage.onload = function() {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImage = new Image();
    topPipeImage.src = "./Assets/toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./Assets/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    // bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    
    }

    //clear pipes
    // while (pipeArray.length > 0 && pipeArray[0].x < -pipe.width){
    //     pipeArray.shift();
    // } 

    //score
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText(score, 20, 45);

    if (gameOver) {
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", boardWidth/6, boardHeight/2);
        context.font = "30px sans-serif";
        context.fillText("Score:" + score, boardWidth/3, boardHeight - 280);

    }

    velocityX = velocityX - 0.0001;
    openingSpace = openingSpace - 10;
}

function placePipes() {

    if (gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImage,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottompipe = {
        img : bottomPipeImage,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottompipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdy;
            velocityX = -1.8;
            pipeArray = [];
            score = 0;
            openingSpace = board.height/4;
            gameOver = false;
        }
    }
}

function detectCollision(a,b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}