var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

// set aliases
var Application = PIXI.Application, Text = PIXI.Text, Graphics = PIXI.Graphics, loader = PIXI.loader, resources = PIXI.loader.resources, Sprite = PIXI.Sprite, TextStyle = PIXI.TextStyle;
//Create a Pixi Application
let app = new Application({ width: 256, height: 256, antialias: true });
// app.renderer.backgroundColor = 0x061639;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
var blockSize = 32;
var numBlocks = 15;
var level = 4;
var canvasWidth = blockSize * numBlocks;
var canvasHeight = blockSize * numBlocks;
var maxSize = numBlocks * numBlocks;
app.renderer.resize(canvasWidth, canvasHeight);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
loader.add(["vue_client/images/cat.png", "vue_client/images/apple.jpg"]).load(setup);

var snake, food, state, tail, length, scoreString, scoreBoard;
var velocity = 1;
var EPSILON = 0.01;

var half = Math.floor(numBlocks / 2);
var startPosition = half * blockSize + blockSize / 2;

//This `setup` function will run when the image has loaded
function setup() {

  // Initialize Snake
  snake = new Sprite(resources["vue_client/images/cat.png"].texture);
  snake.width = blockSize;
  snake.height = blockSize;
  snake.anchor.set(0.5, 0.5);

  // Initialize Food
  food = new Graphics();
  food.beginFill(0xFFFFFF);
  food.drawCircle(0, 0, blockSize / 2);
  food.endFill();

  food = new Sprite(resources["vue_client/images/apple.jpg"].texture);
  food.width = blockSize;
  food.height = blockSize;
  food.anchor.set(0.5, 0.5);

  // initialize ScoreBoard
  scoreString = "SCORE:" + length;
  scoreBoard = new Text(scoreString, scoreStyle);
  scoreBoard.position.set(canvasWidth / 2, canvasHeight / 2);
  scoreBoard.anchor.set(0.5, 0.5);

  // Start New Game
  newGame();

  // add children to stage
  app.stage.addChild(scoreBoard);
  app.stage.addChild(food);
  app.stage.addChild(snake);

  //Capture the keyboard arrow keys
  var left = keyboard(37), up = keyboard(38), right = keyboard(39), down = keyboard(40);

  //Left arrow key `press` method
  left.press = () => {
    //Change the snake's velocity when the key is pressed
    if (snake.direction !== 1) {
      snake.nextDirection = 3;
    }
  };

  //Up
  up.press = () => {
    if (snake.direction !== 0) {
      snake.nextDirection = 2;
    }
  };

  //Right
  right.press = () => {
    if (snake.direction !== 3) {
      snake.nextDirection = 1;
    }
  };

  //Down
  down.press = () => {
    if (snake.direction !== 2) {
      snake.nextDirection = 0;
    }
  };

  state = play;

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  // update position based on velocity
  updatePosition();

  // calculate position of nearest grid point
  var gridX = Math.round(snake.x / blockSize) * blockSize - blockSize / 2;
  var gridY = Math.round(snake.y / blockSize) * blockSize - blockSize / 2;

  // if food is eaten
  if (collision(snake, food)) {
    length += 1;
    if (length === maxSize) {
      win();
    }

    if (length === 5) {
      velocity = 2;
    } else if (length === 10) {
      velocity = 4;
    } else if (length === 50) {
      velocity = 8;
    } else if (length === 100) {
      velocity = 16;
    }

    scoreString = "SCORE: " + length;
    scoreBoard.text = scoreString;

    // create new tail
    createNewTail();

    // reset food
    do {
      food.x = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
      food.y = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
    } while (foodInSnake())
  } else {
    food.tint = 0xffffff;
  }

  // if snake is on grid point, reset direction and velocity based on key press
  // console.log(gridX - snake.x, gridY - snake.y);
  if (Math.abs(gridX - snake.x) < EPSILON && Math.abs(gridY - snake.y) < EPSILON) {
    // console.log("HELLO!");
    updateHeadVelocity();
  }

  // check for losing conditions
  var body = snake.next;
  while (body !== undefined) {
    if (collision(snake, body)) {
      lose();
    }
    body = body.next;
  }

  if (contain(snake, { x: 0, y: 0, width: canvasWidth, height: canvasHeight })) {
    lose();
  }
}