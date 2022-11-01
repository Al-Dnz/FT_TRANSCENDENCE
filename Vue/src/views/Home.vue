<template>
  <div className="absolute flex justify-center h-full w-full">
    <div style="position: relative;display: inline-block;">
        <!-- player 1 name -->
        <div style="position: relative; display: flex; width: 90%;">
            <div class='player_1_name'> Joueur 1</div>
            <!-- player 1 score -->
            <div class='player_score' id="score_1">0 </div>
            <!-- timer -->
            <div class="timer" id="timer" > XXX </div>
            <!-- player 2 score -->
            <div class='player_score' id="score_2"> 0 </div>
            <!-- player 2 name -->
            <div class='player_2_name'> Joueur 2</div>
        </div>
        <div class="message" id="message"> Space for Start</div>
        <canvas id = "Game"></canvas>
    </div> 
  </div>
</template>

<script>
export default {
  name: 'homePage',
  components : {
  },
  mounted() {
	const Script1 = document.createElement("script");
    Script1.setAttribute(
      "src",
      require("../../game/Js/classes.js")
    );
    document.head.appendChild(Script1);
	const Script2 = document.createElement("script");
    Script2.setAttribute(
      "src",
      require("../../game/Js/utils.js")
    );
    document.head.appendChild(Script2);
	const Script3 = document.createElement("script");
    Script3.setAttribute(
      "src",
      require("../../game/game.js")
    );
    document.head.appendChild(Script3);
  }
}
</script>

<style src="../../game/oelourd.css" />
