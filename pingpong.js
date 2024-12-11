// Select the canvas element
const canvas = document.getElementById("table");
const context = canvas.getContext("2d");

// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velX: 5,
  velY: 5,
  speed: 5,
  color: "green",
};

// User paddle
const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "red",
};

// CPU paddle
const cpu = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "red",
};

// Separator line
const separator = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "orange",
};

// Draw a rectangle function
function drawRectangle(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

// Draw a circle function
function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}

// Draw the score function
function drawScore(text, x, y) {
  context.fillStyle = "white";
  context.font = "60px Arial";
  context.fillText(text, x, y);
}

// Draw the separator line
function drawSeparator() {
  for (let i = 0; i <= canvas.height; i += 20) {
    drawRectangle(separator.x, separator.y + i, separator.width, separator.height, separator.color);
  }
}

// Restart the ball
function restart() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velX = -ball.velX;
  ball.speed = 5;
}

// Detect collision between the ball and a paddle
function detectCollision(ball, player) {
  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  return (
    player.left < ball.right &&
    player.top < ball.bottom &&
    player.right > ball.left &&
    player.bottom > ball.top
  );
}

// Mouse event to control the user paddle
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;

  // Prevent the paddle from going out of bounds
  if (user.y < 0) user.y = 0;
  if (user.y + user.height > canvas.height) user.y = canvas.height - user.height;
}

// CPU paddle movement
function cpuMovement() {
  if (cpu.y + cpu.height / 2 < ball.y) {
    cpu.y += 5;
  } else {
    cpu.y -= 5;
  }

  // Prevent the CPU paddle from going out of bounds
  if (cpu.y < 0) cpu.y = 0;
  if (cpu.y + cpu.height > canvas.height) cpu.y = canvas.height - cpu.height;
}

// Draw everything
function render() {
  drawRectangle(0, 0, canvas.width, canvas.height, "black"); // Canvas background
  drawScore(user.score, canvas.width / 4, canvas.height / 5); // User score
  drawScore(cpu.score, (3 * canvas.width) / 4, canvas.height / 5); // CPU score
  drawSeparator();
  drawRectangle(user.x, user.y, user.width, user.height, user.color); // User paddle
  drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color); // CPU paddle
  drawCircle(ball.x, ball.y, ball.radius, ball.color); // Ball
}

// Update positions and handle logic
function update() {
  // Update ball position
  ball.x += ball.velX;
  ball.y += ball.velY;

  // Check for top and bottom boundary collision
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velY = -ball.velY;
  }

  // Check for scoring
  if (ball.x - ball.radius < 0) {
    cpu.score++;
    restart();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    restart();
  }

  // Determine which paddle (user or CPU) the ball is near
  let player = ball.x + ball.radius < canvas.width / 2 ? user : cpu;

  // Check for paddle collision
  if (detectCollision(ball, player)) {
    // Calculate where the ball hit the paddle
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    // Calculate the angle in radians
    let angleRad = (Math.PI / 4) * collidePoint;

    // Determine the direction the ball should move
    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velX = direction * ball.speed * Math.cos(angleRad);
    ball.velY = ball.speed * Math.sin(angleRad);

    // Increase ball speed
    ball.speed += 1;
  }

  // Update CPU paddle movement
  cpuMovement();
}

// Game loop
function gameLoop() {
  update();
  render();
}

// Run the game loop at 50 frames per second
setInterval(gameLoop, 1000 / 50);
