export function Goal(ball, player, enemy, gameState, canvas) {
  ball.reset(canvas);
  ball.velocity.x = 0;
  // reset paddle speed
  player.reset();
  enemy.reset();

  player.GoalAnim.display = true;
  player.GoalSound.play();

  setTimeout(() => {
    player.GoalAnim.display = false;
  }, 2000);

  setTimeout(() => {
    if (gameState === "On") {
      player.GoalSound.pause();
      player.GoalSound.currentTime = 0;
      player.position.x < enemy.position.x
        ? (ball.velocity.x = 5)
        : (ball.velocity.x = -5);
    }
  }, 3000);
}

export function checkWinner(
  score_1,
  score_2,
  message,
  gameState,
  ballon,
  canvas
) {
  if (score_1 > score_2) {
    message = "Player 1 Win";
  } else if (score_2 > score_1) {
    message = "Player 2 Win";
  } else {
    message = "Tie";
  }
  gameState = "Off";
  ballon.reset(canvas);
  ballon.velocity.x = 0;
  ballon.velocity.y = 0;
  return message;
}
