// ctx.fillStyle = "red";
// ctx.fillRect(0, 0, canvas.width, canvas.height);

// canvas.height = canvas.width * 2;

// var canvas = document.getElementById("Game");
// var heightRatio = 0.5;
// canvas.height = canvas.width * heightRatio;

const canvas = document.querySelector("#Game");
const ctx = canvas.getContext("2d");

canvas.width = 10240;
canvas.height = 5760;

console.log(canvas.width);
console.log(canvas.height);

let score_1 = 0;
let score_2 = 0;

let gameState = "Off";

let message = document.querySelector("#message");

console.log();

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/SpaceBackground.png",
  width: canvas.width,
  height: canvas.height,
});

const paddle1 = new paddle({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  width: parseInt(canvas.width / 34, 10),
  height: parseInt(canvas.height / 3.5, 10),
  imageSrc: "./assets/Paddle1.png",
  GoalSoundSrc: "./assets/Siuu.mp3",
  GoalAnimSrc: "./assets/nyancat-removebg-preview.png",
  GoalAnimFrame: 9,
});

const paddle2 = new paddle({
  position: {
    x: canvas.width - parseInt(canvas.width / 34, 10),
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  width: parseInt(canvas.width / 34, 10),
  height: parseInt(canvas.height / 3.5, 10),
  imageSrc: "./assets/Paddle2.png",
  GoalSoundSrc: "./assets/Marex.wav",
  GoalAnimSrc: "./assets/horny-jail-bonk.png",
  GoalAnimFrame: 6,
});

const ballon = new ball({
  position: {
    x: (canvas.width - parseInt(canvas.height / 19.2, 10)) / 2,
    y: (canvas.height - parseInt(canvas.height / 19.2, 10)) / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  coord: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  width: parseInt(canvas.height / 19.2, 10),
  height: parseInt(canvas.height / 19.2, 10),
  imageSrc: "./assets/Balls.png",
  speed: 4,
  framesMax: 10,
});

ballon.image.tr;

const keys = {
  z: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
};

(function animate() {
  window.requestAnimationFrame(animate);

  if (gameState === "Off") {
    message.style.display = "flex";
  } else {
    message.style.display = "none";
  }

  background.update();
  paddle1.update();
  paddle2.update();
  ballon.update();
  if (paddle1.GoalAnim.display === true) paddle1.GoalAnim.update();
  if (paddle2.GoalAnim.display === true) paddle2.GoalAnim.update();

  // paddle1 movement
  if (keys.z.pressed && paddle1.lastKey === "z") {
    paddle1.velocity.y = -paddle1.speed;
  } else if (keys.s.pressed && paddle1.lastKey === "s") {
    paddle1.velocity.y = paddle1.speed;
  }

  // paddle2 movement
  if (keys.ArrowUp.pressed && paddle2.lastKey === "ArrowUp") {
    paddle2.velocity.y = -paddle2.speed;
  } else if (keys.ArrowDown.pressed && paddle2.lastKey === "ArrowDown") {
    paddle2.velocity.y = paddle2.speed;
  }
})();

window.addEventListener("keydown", (event) => {
  // paddle1
  switch (event.key) {
    case "z":
      keys.z.pressed = true;
      paddle1.lastKey = "z";
      break;
    case "s":
      keys.s.pressed = true;
      paddle1.lastKey = "s";
      break;
  }

  // paddle2
  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      paddle2.lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = true;
      paddle2.lastKey = "ArrowDown";
      break;
  }

  switch (event.key) {
    case " ":
      if (gameState === "Off") {
        gameState = "On";
        ballon.getCoord();
        ballon.velocity.x = 7;
        ballon.velocity.y = 0;
      }
      break;
    case "i":
      console.log("Ball pos X --> ", ballon.position.x);
      console.log("Ball pos Y --> ", ballon.position.y);
      break;
  }
});

window.addEventListener("keyup", (event) => {
  // paddle1
  switch (event.key) {
    case "z":
      keys.z.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
  }

  // paddle2
  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
  }
});

let timer = 99;
(function decreaseTimer() {
  setTimeout(decreaseTimer, 1000);
  if (gameState === "On" && timer >= 0) {
    if (timer > 0) {
      timer--;
      document.querySelector("#timer").innerHTML = timer;
    } else checkWinner();
  }
})();

function checkWinner() {
  if (score_1 > score_2) {
    message.innerHTML = "Player 1 Win";
  } else if (score_2 > score_1) {
    message.innerHTML = "Player 2 Win";
  } else {
    message.innerHTML = "Tie";
  }
  gameState = "Off";
  ballon.reset();
  ballon.velocity.x = 0;
  ballon.velocity.y = 0;
}

class Sprite {
	constructor({
	  position,
	  imageSrc,
	  scale = { x: 1, y: 1 },
	  framesMax = 1,
	  offset = { x: 0, y: 0 },
	  height,
	  width,
	  coord = { top: 0, left: 0, right: 0, bottom: 0, center: { x: 0, y: 0 } },
	  display = true,
	}) {
	  this.width = width;
	  this.height = height;
	  this.position = position;
	  this.image = new Image();
	  this.image.src = imageSrc;
	  this.scale = scale;
	  this.framesMax = framesMax;
	  this.framesCurrent = 0;
	  this.framesElapsed = 0;
	  this.framesHold = 5;
	  this.offset = offset;
	  this.coord = coord;
	  this.display = display;
	  if (!this.width) this.width = this.image.width * scale.x;
	  else scale.x = (this.width / this.image.width) * framesMax;
	  if (!this.height) this.height = this.image.height * scale.y;
	  else scale.y = this.height / this.image.height;
	  this.coord.top = this.position.y;
	  this.coord.right = this.position.x + this.width;
	  this.coord.bottom = this.position.y + this.height;
	  this.coord.left = this.position.x;
	  this.coord.center = {
		x: this.position.x + this.width / 2,
		y: this.position.y + this.height / 2,
	  };
	}
  
	draw() {
	  ctx.drawImage(
		this.image,
		this.framesCurrent * (this.image.width / this.framesMax),
		0,
		this.image.width / this.framesMax,
		this.image.height,
		this.position.x - this.offset.x,
		this.position.y - this.offset.y,
		(this.image.width / this.framesMax) * this.scale.x,
		this.image.height * this.scale.y
	  );
	}
  
	animateFrames() {
	  this.framesElapsed++;
  
	  if (this.framesElapsed % this.framesHold === 0) {
		if (this.framesCurrent < this.framesMax - 1) {
		  this.framesCurrent++;
		} else {
		  this.framesCurrent = 0;
		}
	  }
	}
  
	getCoord() {
	  this.coord.top = this.position.y;
	  this.coord.right = this.position.x + this.width;
	  this.coord.bottom = this.position.y + this.height;
	  this.coord.left = this.position.x;
	  this.coord.center = {
		x: this.position.x + this.width / 2,
		y: this.position.y + this.height / 2,
	  };
	}
  
	update() {
	  // this.getCoord(); maybe i need this
	  this.draw();
	  this.animateFrames();
	}
  }
  
  class paddle extends Sprite {
	constructor({
	  position,
	  velocity,
	  imageSrc,
	  GoalSoundSrc,
	  scale = { x: 1, y: 1 },
	  framesMax = 1,
	  offset = { x: 0, y: 0 },
	  speed = 9,
	  GoalAnimSrc,
	  GoalAnimFrame,
	  height = 0,
	  width = 0,
	}) {
	  super({
		position,
		imageSrc,
		scale,
		framesMax,
		offset,
		height,
		width,
	  });
	  this.velocity = velocity;
	  this.framesCurrent = 0;
	  this.framesElapsed = 0;
	  this.framesHold = 5;
	  this.speed = speed;
	  this.GoalSound = new Audio();
	  this.GoalSound.volume = 0.1;
	  this.GoalSound.src = GoalSoundSrc;
	  this.GoalAnimSrc = GoalAnimSrc;
	  this.GoalAnim = new Sprite({
		position: {
		  x: 0,
		  y: 0,
		},
		imageSrc: GoalAnimSrc,
		height: canvas.height,
		framesMax: GoalAnimFrame,
		width: canvas.width,
		display: false,
	  });
	  // this.GoalAnim.imageSrc = GoalAnimSrc;
	}
	update() {
	  this.draw();
	  // movement paddle
	  if (
		!(this.position.y + this.velocity.y + this.height > canvas.height) &&
		this.position.y + this.velocity.y >= 0
	  )
		this.position.y += this.velocity.y;
  
	  this.velocity.y = 0;
	}
	reset() {
	  this.speed = 9;
	}
  }
  
  class ball extends Sprite {
	constructor({
	  position,
	  velocity,
	  imageSrc,
	  scale = { x: 1, y: 1 },
	  framesMax = 1,
	  offset = { x: 0, y: 0 },
	  width,
	  height,
	  speed,
	}) {
	  super({
		position,
		imageSrc,
		scale,
		framesMax,
		offset,
		width,
		height,
	  });
	  this.width = width;
	  this.height = height;
	  this.velocity = velocity;
	  this.framesCurrent = 0;
	  this.framesElapsed = 0;
	  this.framesHold = 5;
	  this.radius = this.height / 2;
	  this.speed = speed;
	}
  
	collision(paddle) {
	  this.getCoord();
	  paddle.getCoord();
	  return (
		this.coord.right > paddle.coord.left &&
		this.coord.top < paddle.coord.bottom &&
		this.coord.left < paddle.coord.right &&
		this.coord.bottom > paddle.coord.top
	  );
	}
	reset() {
	  this.position.x = (canvas.width - 40) / 2;
	  this.position.y = (canvas.height - 40) / 2;
	  this.speed = 5;
	  this.velocity.y = 0;
	}
  
	update() {
	  this.draw();
	  if (this.velocity.x !== 0 || this.velocity.y !== 0) this.animateFrames();
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  if (
		this.position.y + this.height > background.coord.bottom ||
		this.position.y < 0
	  ) {
		this.velocity.y = -this.velocity.y;
	  }
  
	  let paddle =
		this.coord.center.x < background.coord.center.x ? paddle1 : paddle2;
  
	  if (this.collision(paddle)) {
		let collidePoint =
		  (this.coord.center.y - paddle.coord.center.y) / (paddle.height / 2);
		let angleRad = (Math.PI / 8) * collidePoint;
  
		let direction = this.coord.center.x < background.coord.center.x ? 1 : -1;
  
		this.velocity.x = this.speed * Math.cos(angleRad) * direction;
		this.velocity.y = this.speed * Math.sin(angleRad);
  
		this.speed += 0.5;
		paddle1.speed += 0.25;
		paddle2.speed += 0.25;
	  }
	  if (ballon.coord.left <= background.coord.left) {
		if (gameState === "On") {
		  score_2++;
		  document.querySelector("#score_2").innerHTML = score_2;
		  Goal(this, paddle2);
		}
	  } else if (ballon.coord.right >= background.coord.right) {
		if (gameState === "On") {
		  score_1++;
		  document.querySelector("#score_1").innerHTML = score_1;
		  Goal(this, paddle1);
		}
	  }
	}
  }

  function Goal(ball, player) {
	ball.reset();
	ball.velocity.x = 0;
	// reset paddle speed
	paddle1.reset();
	paddle2.reset();
  
	player.GoalAnim.display = true;
	player.GoalSound.play();
  
	setTimeout(() => {
	  player.GoalAnim.display = false;
	}, 2000);
  
	setTimeout(() => {
		if (gameState === "On") {
		player.GoalSound.pause();
		player.GoalSound.currentTime = 0;
		player === paddle1 ? (ball.velocity.x = 5) : (ball.velocity.x = -5);
	}
	}, 3000);
}  