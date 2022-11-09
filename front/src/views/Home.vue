<template>
  <div className="absolute flex justify-center h-full w-full">
    <div style="position: relative;display: inline-block;">
        <!-- player 1 name -->
        <div style="position: relative; display: flex; width: 100%;">
            <div class='player_1_name'> Joueur 1</div>
            <!-- player 1 score -->
            <div class='player_score' id="score_1">0 </div>
            <!-- timer -->
            <div class="timer" id="timer"> XXX </div>
            <!-- player 2 score -->
            <div class='player_score' id="score_2"> 0 </div>
            <!-- player 2 name -->
            <div class='player_2_name'> Joueur 2</div>
        </div>
        <div class="message" id="message" > {{ message }}</div>
        <canvas ref = "game" style="border: 1px solid black;"></canvas>
		<button @click="animate(); decreaseTimer()">Join game</button> 
    </div> 
  </div>
</template>

<script>
import {paddle} from '@/pong/Js/classes.js'
import {ball} from '@/pong/Js/classes.js'
import {Sprite} from '@/pong/Js/classes.js'
import {Goal} from '@/pong/Js/utils.js'
import {checkWinner} from '@/pong/Js/utils.js'
export default {
  name: 'homePage',
  components : {
  },
  methods : {
	getImgUrl: function (img) {
				return require('@/assets' + img);
			},
	animate : function() {
  window.requestAnimationFrame(this.animate);
  
  // if (this.gameState === "Off") {
  //   this.message = "flex";
  // } else {
  //   this.message = "none";
  // }
  this.background.update(this.ctx);
  this.paddle1.update(this.ctx, this.canvas);
  this.paddle2.update(this.ctx, this.canvas);
  this.ballon.update(this.paddle1, this.paddle2, this.ctx, this.background, this.ballon, this.gameState, this.score_2, this.score_1, Goal);
  if (this.paddle1.GoalAnim.display === true) this.paddle1.GoalAnim.update(this.ctx);
  if (this.paddle2.GoalAnim.display === true) this.paddle2.GoalAnim.update(this.ctx);

  // paddle1 movement
  if (this.keys.z.pressed && this.paddle1.lastKey === "z") {
    this.paddle1.velocity.y = -this.paddle1.speed;
  } else if (this.keys.s.pressed && this.paddle1.lastKey === "s") {
    this.paddle1.velocity.y = this.paddle1.speed;
  }

  // paddle2 movement
  if (this.keys.ArrowUp.pressed && this.paddle2.lastKey === "ArrowUp") {
    this.paddle2.velocity.y = -this.paddle2.speed;
  } else if (this.keys.ArrowDown.pressed && this.paddle2.lastKey === "ArrowDown") {
    this.paddle2.velocity.y = this.paddle2.speed;
  }
},
  decreaseTimer : function () {
  setTimeout(this.decreaseTimer, 1000);
  if (this.gameState === "On" && this.timer >= 0) {
    if (this.timer > 0) {
      this.timer--;
      document.querySelector("#timer").innerHTML = this.timer;
    } else this.message = checkWinner(this.score_1, this.score_2, this.message, this.gameState, this.ballon, this.canvas);
  }
},
  checkWinner : function () {
  if (this.score_1 > this.score_2) {
    this.message = "Player 1 Win";
  } else if (this.score_2 > this.score_1) {
    this.message = "Player 2 Win";
  } else {
    this.message = "Tie";
  }
  this.gameState = "Off";
  this.ballon.reset(this.canvas);
  this.ballon.velocity.x = 0;
  this.ballon.velocity.y = 0;
  return this.message;
}
	},
  data() {
	return {
	paddle1 : null,
	paddle2 : null,
	background : null,
	ballon : null,
	keys : null,
	gameState : 'Off',
	message : '',
	score_1 : 0,
	score_2 : 0,
	timer : 0,
	canvas : null,
	loaded : false,
	ctx : {},
	gameOn: false
	}
	},
  mounted() {
this.canvas = this.$refs.game;
this.ctx = this.$refs.game.getContext("2d");

this.canvas.width = 1024;
this.canvas.height = 576;

// this.message = document.querySelector("#message").innerHTML;


this.timer = 99;

this.background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: this.getImgUrl("/game/SpaceBackground.png"),
  width: this.canvas.width,
  height: this.canvas.height,
});

this.paddle1 = new paddle({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  width: parseInt(this.canvas.width / 34, 10),
  height: parseInt(this.canvas.height / 3.5, 10),
  imageSrc: this.getImgUrl("/game/Paddle1.png"),
  GoalSoundSrc: this.getImgUrl("/game/Siuu.mp3"),
  GoalAnimSrc: this.getImgUrl("/game/nyancat-removebg-preview.png"),
  GoalAnimFrame: 9,
  canvas : this.canvas
});

this.paddle2 = new paddle({
  position: {
    x: this.canvas.width - parseInt(this.canvas.width / 34, 10),
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  width: parseInt(this.canvas.width / 34, 10),
  height: parseInt(this.canvas.height / 3.5, 10),
  imageSrc: this.getImgUrl("/game/Paddle2.png"),
  GoalSoundSrc: this.getImgUrl("/game/Marex.wav"),
  GoalAnimSrc: this.getImgUrl("/game/horny-jail-bonk.png"),
  GoalAnimFrame: 6,
  canvas: this.canvas
});

this.ballon = new ball({
  position: {
    x: (this.canvas.width - parseInt(this.canvas.height / 19.2, 10)) / 2,
    y: (this.canvas.height - parseInt(this.canvas.height / 19.2, 10)) / 2,
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
  width: parseInt(this.canvas.height / 19.2, 10),
  height: parseInt(this.canvas.height / 19.2, 10),
  imageSrc: this.getImgUrl("/game/Balls.png"),
  speed: 4,
  framesMax: 10,
  canvas: this.canvas
});


this.keys = {
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
  this.timer = 9;

  window.addEventListener("keydown", (event) => {
  // paddle1
  switch (event.key) {
    case "z":
      this.keys.z.pressed = true;
      this.paddle1.lastKey = "z";
      break;
    case "s":
      this.keys.s.pressed = true;
      this.paddle1.lastKey = "s";
      break;
  }

  // paddle2
  switch (event.key) {
    case "ArrowUp":
      this.keys.ArrowUp.pressed = true;
      this.paddle2.lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      this.keys.ArrowDown.pressed = true;
      this.paddle2.lastKey = "ArrowDown";
      break;
  }

  switch (event.key) {
    case " ":
      if (this.gameState === "Off") {
        this.gameState = "On";
        this.ballon.getCoord();
        this.ballon.velocity.x = 7;
        this.ballon.velocity.y = 0;
      }
      break;
    case "i":
      console.log("Ball pos X --> ", this.ballon.position.x);
      console.log("Ball pos Y --> ", this.ballon.position.y);
      break;
  }
});
window.addEventListener("keyup", (event) => {
  // paddle1
  switch (event.key) {
    case "z":
      this.keys.z.pressed = false;
      break;
    case "s":
      this.keys.s.pressed = false;
      break;
  }

  // paddle2
  switch (event.key) {
    case "ArrowUp":
      this.keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      this.keys.ArrowDown.pressed = false;
      break;
  }
});
}
}
</script>

<style src="../pong/game.css" />
