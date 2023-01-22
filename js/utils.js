function rectangularCollision({rectangle1, rectangle2}) {
  return (
    rectangle1.attackBox.pos.x + rectangle1.attackBox.width >= rectangle2.pos.x 
    && rectangle1.attackBox.pos.x <= rectangle2.pos.x + rectangle2.width
    && rectangle1.attackBox.pos.y + rectangle1.attackBox.height <= rectangle2.pos.y + rectangle2.height
    && rectangle1.attackBox.pos.y + rectangle1.attackBox.height >= rectangle2.pos.y 
    && rectangle1.isAttacking
  );
}

let timer = 90;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#time').textContent = timer;
  } else {
    determineWinner({player, enemy, timerId});
  }
}

function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId);
  winnerText.style.display = "flex";
  if (player.health === enemy.health) {
    winnerText.textContent = "Tie Game!";
  } else if (player.health > enemy.health) {
    winnerText.textContent = "Player1 Wins!";
  } else {
    winnerText.textContent = "Player2 Wins!";
  }
  gameover = true;
}