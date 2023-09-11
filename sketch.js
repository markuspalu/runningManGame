let rectX = 20;
let rectY = 250;
let rectDir = 0;
let rectSpeedY = 0;
let rectSpeedX = 0;

let gravity = 1.2;

let randomTreeSize = 0;
let randomTreeX = 0;
let randomTreeY = 0;

let randomizeTreeX = 200;
let randomizeTreeY = 200;
let randomTreeArray = [];

let treeX = 400;
let treeSpeed = 3;

let spawnTrunk = false;

let randomGreen = [
  [39, 83, 4],
  [98, 151, 7],
  [141, 185, 47],
  [76, 108, 33],
  [54, 142, 94],
  [39, 106, 48],
];

let g = [39, 83, 4];

let timer = 5000;
let nextTime = timer;

let angle = 0;
let speed = 0.2;

let randomSpawn = 0;

let counter = 0;

let gameOver = false;

let jumpSound;
let gameoverSound;
let gameoverPlayed = false;

function preload() {
  soundFormats("mp3");
  jumpSound = loadSound("assets/jump");
  gameoverSound = loadSound("assets/gameover");
}

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 50; i++) {
    randomizeTree(treeX, 200);
  }
}

function randomizeTree(x, y) {
  // 200, 200
  randomTreeX = random(x - 15, x + 35);
  randomTreeY = random(y + 20, y + 60);
  randomTreeSize = random(18, 28);
  randomTreeArray.push({
    x: randomTreeX,
    y: randomTreeY,
    size: randomTreeSize,
  });
}

function player(x, y) {
  fill("plum");
  strokeWeight(2);
  rect(x, y, 50, 50, 10);

  fill("white");
  circle(x + 30, y + 10, 15);
  circle(x + 50, y + 10, 15);

  fill("black");
  strokeWeight(5);
  let xc1 = constrain(treeX, x + 27, x + 33);
  let xc2 = constrain(treeX, x + 47, x + 53);
  let yc1 = constrain(randomizeTreeY + 10, y + 10, y + 12);
  let yc2 = constrain(randomizeTreeY + 10, y + 10, y + 12);

  point(xc1, yc1);
  point(xc2, yc2);
  strokeWeight(2);

  fill("plum");

  if (rectY < 250) {
    line(x + 50, y + 30, x + 25, y + 30);
    line(x + 25, y + 30, x + 20, y + 33);

    push();
    translate(x + 35, y + 50);
    rotate(radians(-135));
    rect(-5, 0, 10, 20, 20);
    pop();

    push();
    translate(x + 15, y + 50);
    rotate(radians(45));
    rect(-5, 0, 10, 20, 20);
    pop();
  } else {
    line(x + 50, y + 30, x + 25, y + 30);
    line(x + 25, y + 30, x + 20, y + 27);

    push();
    translate(x + 35, y + 50);
    rotate(angle);
    rect(-5, 0, 10, 20, 20);
    pop();

    push();
    translate(x + 15, y + 50);
    rotate(angle + HALF_PI);
    rect(-5, 0, 10, 20, 20);
    pop();

    angle += speed + treeSpeed * 0.02;
  }
}

function tree(x) {
  fill(100, 65, 23);
  rect(x, 260, 20, 100);

  fill(g[0], g[1], g[2]);
  noStroke();

  randomTreeArray.forEach((element) =>
    circle((element.x -= treeSpeed), element.y, element.size)
  );

  if (randomTreeArray[0].x < 0) {
    randomSpawn = random(0, 500);
    randomTreeArray.forEach(
      (element) => (element.x = random(400, 450) + randomSpawn)
    );
    g = random(randomGreen);
    counter++;
    spawnTrunk = true;
  } else {
    spawnTrunk = false;
  }
  stroke(1);
}

function drawSun() {
  push();
  translate(400, 0);
  rotate(frameCount * 0.01);
  line(-120, 0, 120, 0);
  line(0, -120, 0, 120);
  line(-80, -80, 80, 80);
  line(-80, 80, 80, -80);
  pop();

  fill("yellow");
  circle(width, 0, 150);
}

function drawCounter() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill("black");
  text(counter, 20, 20);
}

function death() {
  if (dist(rectX + 10, rectY, treeX, 240) < 70) {
    gameOver = true;
  }
}

function gameOverScreen() {
  gameoverSoundPlayed = true;
  background("lightblue");
  fill("black");
  textAlign(CENTER, CENTER);
  let gameoverText = "You got " + counter + " points";
  textSize(32);
  text("Game over", width / 2, height / 2 - 50);
  textSize(28);
  text(gameoverText, width / 2, height / 2);
  textSize(24);
  text("Press 'R' to restart", width / 2, height / 2 + 50);
}

function draw() {
  if (gameOver) {
    gameOverScreen();
    if (!gameoverPlayed) {
      gameoverSound.play();
      gameoverPlayed = true;
    }
  } else {
    background("lightblue");
    drawCounter();
    drawSun();
    player(rectX, rectY - 20);

    tree(treeX);
    treeX -= treeSpeed;
    if (spawnTrunk) {
      treeX = 412 + randomSpawn;
    }

    fill(0, 200, 0);
    rect(0, 300, width);

    rectSpeedY += gravity;
    rectY += rectSpeedY;

    if (rectY > 250) {
      rectY = 250;
      rectSpeedY = 0;
    }

    death();

    if (millis() > nextTime) {
      treeSpeed += 1;
      nextTime = millis() + timer;
    }

    if (keyIsDown(LEFT_ARROW) && rectX > 0) {
      rectX -= 5;
    } else if (keyIsDown(RIGHT_ARROW) && rectX < width - 50) {
      rectX += 5;
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && rectY === 250) {
    rectSpeedY = -20;
    jumpSound.play();
  } else if ((key === "R" || key === "r") && gameOver) {
    treeSpeed = 3;
    gameOver = false;
    gameoverPlayed = false;
    randomTreeArray[0].x = -100;
    counter = -1;
  }
}
