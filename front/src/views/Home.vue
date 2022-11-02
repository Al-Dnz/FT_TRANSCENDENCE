<template>
  <div className="absolute flex justify-center h-full w-full">
    <div style="position: relative;display: inline-block;">
        <!-- player 1 name -->
        <div style="position: relative; display: flex; width: 90%;">
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
        <div class="message" id="message" :class="gameOn ? 'flex' : 'none' "> Space for Start</div>
        <canvas id = "Game"></canvas>
		<button @click="animate">Join game</button> 
    </div> 
  </div>
</template>

<script>
import {paddle} from '@/pong/Js/classes.js'
import {ball} from '@/pong/Js/classes.js'
import {Sprite} from '@/pong/Js/classes.js'
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
  /*
  if (this.gameState === "Off") {
    this.message.style.display = "flex";
  } else {
    this.message.style.display = "none";
  }*/
  console.log(this.background);
  console.log(this.ctx);
  this.background.update(this.ctx);
  this.paddle1.update(this.ctx);
  this.paddle2.update(this.ctx);
  this.ballon.update(this.paddle1, this.paddle2, this.ctx);
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
}
	},
  data() {
	return {
	paddle1 : null,
	paddle2 : null,
	background : null,
	ballon : null,
	keys : null,
	gameState : '',
	message : '',
	score_1 : 0,
	score_2 : 0,
	timer : 0,
	canvas : null,
	loaded : false,
	ctx : '',
	gameOn: false
	}
	},
  mounted() {
this.canvas = document.querySelector("#Game");
console.log(this.canvas);
this.ctx = this.canvas.getContext("2d");

this.canvas.width = 1024;
this.canvas.height = 576;

console.log(this.canvas.width);
console.log(this.canvas.height);

let score_1 = 0;
let score_2 = 0;

let gameState = "Off";

let message = document.querySelector("#message");

console.log();

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
});

this.ballon.image.tr;

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
  this.timer = 99;
  }
}
</script>

<style src="../pong/game.css" />
