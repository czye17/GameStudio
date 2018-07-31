var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

// set aliases
var Application = PIXI.Application, Graphics = PIXI.Graphics, loader = PIXI.loader, resources = PIXI.loader.resources, Sprite = PIXI.Sprite;
//Create a Pixi Application
let app = new Application({ width: 256, height: 256, antialias: true });
// app.renderer.backgroundColor = 0x061639;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
var blockSize = 32;
var numBlocks = 15;
var canvasWidth = blockSize * numBlocks;
var canvasHeight = blockSize * numBlocks;
app.renderer.resize(canvasWidth, canvasHeight);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
loader.add("vue_client/images/cat.png").load(setup);

var snake, food, state, tail;
var velocity = 1;
var EPSILON = 1;

var half = Math.floor(numBlocks / 2);
var startPosition = half * blockSize + blockSize / 2;

//This `setup` function will run when the image has loaded
function setup() {

  // Initialize Stage
  snake = new Sprite(resources["vue_client/images/cat.png"].texture);
  snake.width = blockSize;
  snake.height = blockSize;

  // Initialize Snake
  // snake = new Graphics();
  // snake.beginFill(0x66CCFF);
  // snake.lineStyle(4, 0xFF3300, 1);
  // snake.drawRect(0, 0, blockSize, blockSize);
  // snake.endFill();
  // snake.anchor.set(0.5, 0.5);
  snake.vx = velocity;
  snake.vy = 0;
  snake.anchor.set(0.5, 0.5);

  snake.x = startPosition;
  snake.y = startPosition;
  snake.direction = 1;
  snake.nextDirection = 1;

  tail = snake;
  tail.lastX = snake.x;
  tail.lastY = snake.y;

  // Initialize Food
  food = new Graphics();
  food.beginFill(0xFFFFFF);
  food.drawCircle(0, 0, blockSize / 2);
  food.endFill();
  food.x = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
  food.y = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
  app.stage.addChild(food);

  //Add the snake to the stage
  app.stage.addChild(snake);

  //Capture the keyboard arrow keys
  let left = keyboard(37), up = keyboard(38), right = keyboard(39), down = keyboard(40);

  //Left arrow key `press` method
  left.press = () => {
    //Change the snake's velocity when the key is pressed
    if (snake.direction !== 1) {
      snake.nextDirection = 3;
    }
    // console.log("LEFT");
  };

  //Up
  up.press = () => {
    if (snake.direction !== 0) {
      snake.nextDirection = 2;
    }
    // console.log("UP");
  };

  //Right
  right.press = () => {
    if (snake.direction !== 3) {
      snake.nextDirection = 1;
    }
    // console.log("RIGHT");
  };

  //Down
  down.press = () => {
    if (snake.direction !== 2) {
      snake.nextDirection = 0;
    }
    // console.log("DOWN");
  };

  state = play;

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  snake.x += snake.vx;
  snake.y += snake.vy;
  var head = snake;
  while (head.next !== undefined) {
    head.next.x += head.next.vx;
    head.next.y += head.next.vy;
    head = head.next;
  }
  var gridX = Math.round(snake.x / blockSize) * blockSize - blockSize / 2;
  var gridY = Math.round(snake.y / blockSize) * blockSize - blockSize / 2;
  tail.lastX = tail.x;
  tail.lastY = tail.y;
  if (tail.direction === 0) { tail.lastY -= blockSize };
  if (tail.direction === 1) { tail.lastX -= blockSize };
  if (tail.direction === 2) { tail.lastY += blockSize };
  if (tail.direction === 3) { tail.lastX += blockSize };

  // console.log(gridX - snake.x, gridY - snake.y);
  if (gridX === snake.x && gridY === snake.y) {
    var head = snake;
    do {
      head.vx = 0; head.vy = 0;
      if (head.nextDirection === 0) { head.vy = velocity; }
      if (head.nextDirection === 1) { head.vx = velocity; }
      if (head.nextDirection === 2) { head.vy = -velocity; }
      if (head.nextDirection === 3) { head.vx = -velocity; }
      if (head.next !== undefined) {
        head.next.nextDirection = head.direction;
      }
      head.direction = head.nextDirection;
      head = head.next;
    } while (head !== undefined)
  }

  if (contain(snake, { x: 0, y: 0, width: canvasWidth, height: canvasHeight })) {
    alert("DEAD.");
    snake.x = startPosition;
    snake.y = startPosition;
    snake.nextDirection = 1;
    var curr = snake.next;
    while (curr !== undefined) {
      app.stage.removeChild(curr);
      curr = curr.next;
    }
  }

  if (hitTestRectangle(snake, food)) {
    var newTail = new Sprite(resources["vue_client/images/cat.png"].texture);
    newTail.width = blockSize;
    newTail.height = blockSize;
    newTail.direction = tail.direction;
    newTail.vx = 0; newTail.vy = 0;
    if (newTail.direction === 0) { newTail.vy = velocity; }
    if (newTail.direction === 1) { newTail.vx = velocity; }
    if (newTail.direction === 2) { newTail.vy = -velocity; }
    if (newTail.direction === 3) { newTail.vx = -velocity; }
    newTail.x = tail.lastX;
    newTail.y = tail.lastY;
    newTail.anchor.set(0.5, 0.5);
    tail.next = newTail;
    app.stage.addChild(newTail);
    tail = newTail;

    food.x = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
    food.y = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
  } else {
    food.tint = 0xffffff;
  }


}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {
  return (r1.x === r2.x && r1.y === r2.y);
};

function contain(sprite, container) {

  let collision = undefined;

  //Left
  if (sprite.x < container.x + blockSize / 2) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y + blockSize / 2) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x > container.width - blockSize / 2) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y > container.height - blockSize / 2) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}