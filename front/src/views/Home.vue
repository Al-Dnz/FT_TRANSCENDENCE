<template>
  <div className="absolute flex justify-center h-full w-full">
    <div id="background_game" style="width: 100%">
    <div id="app" class="container" style="width: 100%; justify-content: center;"></div>
    <div id="initialScreen" style="display: flex;">
        <div style="margin: 0%; width: 100%; justify-content: center; align-items: center; flex-direction: column; position: relative; display: flex;">
          <div style="margin: 2vh;">
            <button class="btn-1" id = "findGameBtn">Play Normal Mode  </button>
          </div>
          <div style="margin: 2vh;">
            <button class="btn-1" id = "findGameCustomBtn" style="top: 60%;" >Play Custom Mode</button>
          </div>
          <div style="margin: 2vh;">
            <input type="text" v-model="gamesecret" placeholder="Enter game code" />
            <button @click="sendCode" class="btn-1" id = "codeGameBtn" style="top: 60%;" >Validate code</button>
          </div>
        </div>
			</div>
			<div class="queueScreen" id="queueScreen" >
				In Queue . . .
			</div>
			<div id= "gameScreen" style="width: 100%;">
				<!-- width and height SHOULD BE SET DYNAMICALLY -->
				<div class = 'ui' style="position: relative; display: flex; width: 60%;">
					<div class='player_1_name'> <span id ="NamePlayer1">Joueur 1</span></div>
					<!-- player 1 score -->
					<div class='player_score' ><span id="score_1"> 0 </span></div>
					<!-- codeRoom -->
					<div class="codeRoom"><span id="gameCodeDisplay"> xxx </span></div>
					<!-- player 2 score -->
					<div class='player_score' ><span id="score_2"> 0 </span></div>
					<!-- player 2 name -->
					<div class='player_2_name'> <span id ="NamePlayer2">Joueur 2 </span></div>
				</div>
				<div>
					<canvas ref="convas"
							id="board"
							width="640"
							height="480"
							class="board"
							style="border: 1px solid black ;" >
					</canvas>
        </div>
			</div>
	</div>

  </div>
</template>

<script>
//fix background color
import io from 'socket.io-client';
import {Sprite, ball, paddle } from "../frontJS/game.js"
export default {
  name: 'gameComp',
  data() {
    return {
      title: 'BLOCK GAME',
      socket: {},
      context: {},
      board: {},
      square: {},
      position: {},
      background: {},
      paddle1: {},
      paddle2: {},
      ball: {},
      score1: {},
      score2: {},

      then: {},
      now: {},
      elapsed: {},
      startTime: {},
      fpsInterval: {},

      gameCodeDisplay: {},
      gameScreen: {},
      queueScreen: {},
      initialScreen: {},
      newGameBtn: {},
      joinGameBtn: {},
      NamePlayer1: {},
      NamePlayer2: {},
      findGameBtn: {},
      findGameCustomBtn: {},
      returnGameBtn: {},
      gamesecret: ""
    };
  },
  methods: {
    newGame() {
      console.log('NIK');
      this.socket.emit('newGame');
      this.startAnimating(30);
    },/*
    specGame() {
      const code = SpecGameCodeInput.value;
      console.log('Spec YEP');
      this.socket.emit('specGame', code);
      this.startAnimating(30);
    },*/
    findGame() {
      this.socket.emit('findGame');
      this.setScreen("queue");
    },
    findGameCustom() {
      this.socket.emit('findGameCustom');
      this.setScreen("queue");
    },
    reset() {
      this.setScreen("initial");
    },
    leaveGame() {
      console.log("FUCK LA VIE");
      this.setScreen("initial");
      this.socket.emit('leaveGame');
    },
    test() {
      console.log('test');
    },
    startAnimating(fps) {
      this.setScreen("game");
      // this.initialScreen.style.display = 'none';
      // this.queueScreen.style.display = 'block';
      // this.gameScreen.style.display = 'none';

      this.fpsInterval = 1000 / fps;
      this.then = Date.now();
      this.startTime = this.then;

      this.getSizeToServe();

      // this.background.imageSrc = require('../assets/game/SpaceBackground.png');
      // this.background.update(this.context);
      // console.log('this.context', this.context);
      // console.log('this.background.imageSrc', this.background.imageSrc);
      this.game();
    },
    setScreen(State) {
      switch (State) {
        case "initial":
        this.initialScreen.style.display = 'block';
        this.queueScreen.style.display = 'none';
        this.gameScreen.style.display = 'none';
          break;
        case "queue":
        this.initialScreen.style.display = 'none';
        this.queueScreen.style.display = 'block';
        this.gameScreen.style.display = 'none';
          break;
        case "game":
        this.initialScreen.style.display = 'none';
        this.queueScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
          break;
        default:
          break;
      }
    },
    game() {
      window.requestAnimationFrame(this.game);

      this.now = Date.now();
      this.elapsed = this.now - this.then;

      if (this.elapsed > this.fpsInterval) {
        // Get ready for next frame by setting this.then=this.now, but also adjust for your
        // specified this.fpsInterval not being a multiple of RAF's interval (16.7ms)
        this.then = this.now - (this.elapsed % this.fpsInterval);

        // Put your drawing code here
        this.getSizeToServe();
        this.context.clearRect(0, 0, this.board.width, this.board.height);
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.board.width, this.board.height);
        // this.background.draw(this.context);
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(this.ball.position.x, this.ball.position.y, this.ball.width, this.ball.height);
        // this.ball.update(this.context);
        // this.paddle1.draw(this.context);
        this.context.fillRect(this.paddle1.position.x, this.paddle1.position.y, this.paddle1.width, this.paddle1.height);
        // this.paddle2.draw(this.context);
        this.context.fillRect(this.paddle2.position.x, this.paddle2.position.y, this.paddle2.width, this.paddle2.height);
      }
    },
    sendInstruction(instruction) {
      console.log('getInfoToClient');
      this.socket.emit('positionToServer', instruction);
    },
    sendPaddleMove(instruction) {
      this.socket.emit('MovePaddleToServer', instruction);
    },
    getInfo() {
      console.log('getInfo');
      this.socket.emit('getInfoToServer');
    },
    getSizeToServe() {
      this.socket.emit('getSizeToServer');
    },
    sendCode()
    {
      console.log(this.gamesecret)
      this.socket.emit('InvGame', this.gamesecret)
    }
  },
  
  unmounted() {
    this.socket.disconnect();
  },
  created() {
    const authPayload = { auth: { token: this.$cookies.get("trans_access") } };
    this.socket = io("http://" + process.env.VUE_APP_IP + ":3005", authPayload);
 
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.sendPaddleMove('up');
          break;
        case 'ArrowDown':
          this.sendPaddleMove('down');
          break;
        case ' ':
          this.getInfo();
          break;
      }
    });
  },
  mounted() {
    this.queueScreen = document.getElementById('queueScreen');
    this.initialScreen = document.getElementById('initialScreen');
    this.gameScreen = document.getElementById('gameScreen');
    // this.newGameBtn = document.getElementById('newGameBtn');
    // this.specGameBtn = document.getElementById('specGameBtn');
    this.NamePlayer1 = document.getElementById('NamePlayer1');
    this.NamePlayer2 = document.getElementById('NamePlayer2');
    this.findGameBtn = document.getElementById('findGameBtn');
    this.findGameCustomBtn = document.getElementById('findGameCustomBtn');
    this.gameCodeDisplay = document.getElementById('gameCodeDisplay');

    // this.newGameBtn.addEventListener('click', this.newGame);
    
    this.findGameCustomBtn.addEventListener('click', this.findGameCustom);
    this.findGameBtn.addEventListener('click', this.findGame);
    // ----------------------------------------------

    this.socket.on(`test`, (data) => {
      this.test();
    });
    this.socket.on(`init`, (data) => {
      this.NamePlayer1.innerText = data.player1;
      this.NamePlayer2.innerText = data.player2;
    });
    this.socket.on(`gameData`, (data) => {
      this.canvas = data.canvas;
    });
    this.socket.on('gameCode', (gameCode) => {
      this.gameCodeDisplay.innerText = gameCode;
    });
    
    this.score1 = document.getElementById('score_1');
    this.score2 = document.getElementById('score_2');
    this.board = document.getElementById('board');

    var heightRatio = 0.75;
    this.board.height = this.board.width * heightRatio;
    this.context = this.board.getContext('2d');

    this.socket.on(`paddle1ToClient`, (data) => {
      console.log('check');
    });
    this.socket.on(`getInfoToClient`, (data) => {
      this.paddle1.position = data.paddle1.position;
      this.paddle2.position = data.paddle2.position;
      this.ball.position = data.ball.position;
    });

    this.socket.on(`gameState`, (data) => {
      this.paddle1.position = data.paddle1.position;
      this.paddle2.position = data.paddle2.position;
      this.ball.position = data.ball.position;
      this.score1.innerText = data.score.player1;
      this.score2.innerText = data.score.player2;
    });

    this.socket.on('gameOver', (data) => {
      console.log('gameOver');
      this.reset();
      // alert('you loose ?');
    });

    this.socket.on('getSizeToClient', (data) => {
      this.paddle1.width = data.paddle1.width;
      this.paddle1.height = data.paddle1.height;
      this.paddle2.width = data.paddle2.width;
      this.paddle2.height = data.paddle2.height;
      this.ball.width = data.ball.width;
      this.ball.height = data.ball.height;

      this.paddle1.updateScale();
      this.paddle2.updateScale();
      this.ball.updateScale();
    });

    this.socket.on('unknownGame', (data) => {
      // this.returnGameBtn.style.display = 'block';
      console.log('unknownGame');
      this.reset();
      // alert('you loose ?');
    });

    this.socket.on('startGame', (data) => {
      console.log("ISSOU");
      // this.setScreen("game");
      this.startAnimating(30);
    });

    this.socket.on('startGameCustom', (data) => {
      console.log("ISSOUCustm");
      // this.setScreen("game");
      this.startAnimating(30);
    });

    this.socket.on('fullGame', (data) => {
      // this.returnGameBtn.style.display = 'block';
      console.log('fullGame');
      this.reset();
      // alert('you loose ?');
    });

    this.background = new Sprite({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: require('../assets/game/SpaceBackground.png'),
      width: this.board.width,
      height: this.board.height,
      ctx: this.context,
    });

    this.paddle1 = new paddle({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: require('../assets/game/Paddle1.png'),
      canvas: this.board,
    });

    this.paddle2 = new paddle({
      position: {
        x: this.board.width - parseInt(this.board.width / 34, 10),
        y: 0,
      },
      imageSrc: require('../assets/game/Paddle2.png'),
      canvas: this.board,
    });

    this.ball = new ball({
      position: {
        x: (this.board.width - parseInt(this.board.height / 19.2, 10)) / 2,
        y: (this.board.height - parseInt(this.board.height / 19.2, 10)) / 2,
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
      width: parseInt(this.board.height / 19.2, 10),
      height: parseInt(this.board.height / 19.2, 10),
      imageSrc: require('../assets/game/Balls.png'),
      speed: 4,
      framesMax: 10,
    });
  },
};
</script>

<style>
    @import '../assets/css/style.css';
    @import '../assets/css/boutton.css';
</style>
