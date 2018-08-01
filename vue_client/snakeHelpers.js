function updateHeadVelocity() {
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

function createNewTail() {
  tail.lastX = tail.x;
  tail.lastY = tail.y;
  if (tail.direction === 0) { tail.lastY -= blockSize };
  if (tail.direction === 1) { tail.lastX -= blockSize };
  if (tail.direction === 2) { tail.lastY += blockSize };
  if (tail.direction === 3) { tail.lastX += blockSize };

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
}

function updatePosition() {
  snake.x += snake.vx;
  snake.y += snake.vy;
  var head = snake;
  while (head.next !== undefined) {
    head.next.x += head.next.vx;
    head.next.y += head.next.vy;
    head = head.next;
  }
}

function foodInSnake() {
  var head = snake;
  while (head !== undefined) {
    if (hitTestRectangle(snake, head)) {
      return true;
    }
    head = head.next;
  }
  return false;
}

function lose() {
  alert("DEAD. Game Over. New Game.");
  newGame();
}

function win() {
  alert("Congratulations! You Won!");
  newGame();
}

function newGame() {
  snake.x = startPosition;
  snake.y = startPosition;
  snake.vx = velocity;
  snake.vy = 0;
  snake.nextDirection = 1;
  var body = snake.next;
  while (body !== undefined) {
    app.stage.removeChild(body);
    body = body.next;
  }
  tail = snake;
  tail.lastX = snake.x;
  tail.lastY = snake.y;
  food.x = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
  food.y = Math.floor(Math.random() * numBlocks) * blockSize + blockSize / 2;
  length = 1;
}