const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const winnerText = document.querySelector("#winner");

canvas.width = 1024;
canvas.height = 576;

const playerWidth = 60;
const playerHeight = 150;
const gravity = 0.7;
const groundOffset = 95;
let gameover = false;

const bg = new Sprite({
  pos: {
    x: 0, 
    y: 0
  },
  imgSrc: "./img/background.png"
});

const shop = new Sprite({
  pos: {
    x: 650,
    y: 160
  },
  imgSrc: "./img/shop.png",
  scale: 2.5,
  numFrames: 6
})

const player = new Fighter({
  pos: {
    x: (canvas.width / 2) - (playerWidth / 2) - 100,
    y: canvas.height - playerHeight - 300
  }, 
  width: playerWidth, 
  height: playerHeight, 
  vel: {x: 0, y: 0}, 
  color: "red",
  imgSrc: "./img/player/Idle.png",
  scale: 2.5,
  numFrames: 8,
  offset: {
    x: 215,
    y: 157
  }
});

const enemy = new Fighter({
  pos: {
    x: (canvas.width / 2) - (playerWidth / 2) + 100,
    y: canvas.height - playerHeight - 300
  }, 
  width: playerWidth, 
  height: playerHeight,
  vel: {x: 0, y: 0}, 
  color: "blue",
  offset: {
    x: -40,
    y: 0
  }
});

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  // c.fillStyle = "black";
  // c.fillRect(0, 0, canvas.width, canvas.height);

  // background
  bg.update();
  shop.update();
  
  player.vel.x = 0;
  enemy.vel.x = 0;

  // player horizantal movement
  if (keys.d.pressed && player.lastKey === "d") player.vel.x = 8;
  else if (keys.a.pressed && player.lastKey === "a") player.vel.x = -8;

  // enemy movement
  if (keys.right.pressed && enemy.lastKey === "right") enemy.vel.x = 8;
  else if (keys.left.pressed && enemy.lastKey === "left") enemy.vel.x = -8;

  // detect collision
  if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {
    player.landAttack();
    enemy.health -= 20;
    document.querySelector('.enemy-health-bar').style.width = enemy.health + '%';
  }
  if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
    enemy.landAttack();
    player.health -= 20;
    document.querySelector('.player-health-bar').style.width = player.health + '%';
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
  }

  player.update();
  // enemy.update();
}

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  },
  d: {
    pressed: false
  },
  a: {
    pressed: false
  }
}

animate();

window.addEventListener("keydown", event => {
  // console.log(`key = ${event.key}`);
  // Player Controls
  if (event.key === "d") {
    keys.d.pressed = true;
    player.lastKey = "d";
  } 
  else if (event.key === "a") {
    keys.a.pressed = true;
    player.lastKey = "a"
  } 
  else if (event.key === "w") {
    player.vel.y = -16;
  }
  else if (event.key === " ") {
    player.attack();
  }
  // Enemy Controls
  if (event.key === "ArrowRight") {
    keys.right.pressed = true;
    enemy.lastKey = "right";
  } 
  else if (event.key === "ArrowLeft") {
    keys.left.pressed = true;
    enemy.lastKey = "left";
  } 
  else if (event.key === "ArrowUp") {
    enemy.vel.y = -16;
  }
  else if (event.key === "ArrowDown") {
    enemy.attack();
  }
});

window.addEventListener("keyup", event => {
  // Player Controls
  if (event.key == "d") {
    keys.d.pressed = false;
  } 
  else if (event.key === "a") {
    keys.a.pressed = false;
  }
  // Enemy Controls
  if (event.key === 'ArrowRight') {
    keys.right.pressed = false;
  } 
  else if (event.key === 'ArrowLeft') {
    keys.left.pressed = false;
  }
});