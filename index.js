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
  },
  sprites: {
    idle: {
      imgSrc: "./img/player/Idle.png",
      numFrames: 8
    },
    run: {
      imgSrc: "./img/player/Run.png",
      numFrames: 8
    },
    jump: {
      imgSrc: "./img/player/Jump.png",
      numFrames: 2
    },
    fall: {
      imgSrc: "./img/player/Fall.png",
      numFrames: 2
    },
    death: {
      imgSrc: "./img/player/Death.png",
      numFrames: 6
    },
    attack1: {
      imgSrc: "./img/player/Attack1.png",
      numFrames: 6
    },
    attack2: {
      imgSrc: "./img/player/Fall.png",
      numFrames: 6
    },
    takeHit: {
      imgSrc: "./img/player/Take Hit.png",
      numFrames: 4
    },
    takeHit2: {
      imgSrc: "./img/player/Take Hit 2.png",
      numFrames: 6
    },
  },
  attackbox: {
    offset: {
      x: playerWidth,
      y: 20
    },
    width: 160,
    height: 100,
    color: "yellow"
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
  imgSrc: "./img/player/Idle.png",
  scale: 2.5,
  numFrames: 4,
  offset: {
    x: 215,
    y: 170
  },
  sprites: {
    idle: {
      imgSrc: "./img/enemy/Idle.png",
      numFrames: 4
    },
    run: {
      imgSrc: "./img/enemy/Run.png",
      numFrames: 8
    },
    jump: {
      imgSrc: "./img/enemy/Jump.png",
      numFrames: 2
    },
    fall: {
      imgSrc: "./img/enemy/Fall.png",
      numFrames: 2
    },
    death: {
      imgSrc: "./img/enemy/Death.png",
      numFrames: 7
    },
    attack1: {
      imgSrc: "./img/enemy/Attack1.png",
      numFrames: 4
    },
    attack2: {
      imgSrc: "./img/enemy/Attack2.png",
      numFrames: 4
    },
    takeHit: {
      imgSrc: "./img/enemy/Take Hit.png",
      numFrames: 3
    },
    takeHit2: {
      imgSrc: "./img/enemy/Take Hit 2.png",
      numFrames: 4
    }
  },
  attackbox: {
    offset: {
      x: -160,
      y: 20
    },
    width: 160,
    height: 100,
    color: "yellow"
  }
});

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);

  // background
  bg.update();
  shop.update();
  
  player.vel.x = 0;
  enemy.vel.x = 0;

  // player movement and idle animation
  if (keys.d.pressed && player.lastKey === "d") {
    player.vel.x = 8;
    player.switchSprite("run");
  } else if (keys.a.pressed && player.lastKey === "a") {
    player.vel.x = -8;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  // player jump and fall animation
  if (player.vel.y < 0) {
    player.switchSprite("jump");
  } else if (player.vel.y > 0){
    player.switchSprite("fall");
  }

  // enemy movement and idle animation
  if (keys.right.pressed && enemy.lastKey === "right") {
    enemy.vel.x = 8;
    enemy.switchSprite("run");
  } else if (keys.left.pressed && enemy.lastKey === "left") {
    enemy.vel.x = -8;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  // enemy jump and fall animation
  if (enemy.vel.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.vel.y > 0){
    enemy.switchSprite("fall");
  }

  // detect collision
  if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4) {
    player.landAttack();
    enemy.takeHit();
    gsap.to(".enemy-health-bar", {
      width: enemy.health + '%'
    });
  }
  if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.landAttack();
    player.takeHit();
    gsap.to(".player-health-bar", {
      width: player.health + '%'
    });
  }

  // player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  // enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId});
  }
  c.fillStyle = 'rgba(255, 255, 255, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
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
  // player controls
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a"
        break;
      case "w":
        player.vel.y = -16;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  // enemy controls
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.right.pressed = true;
        enemy.lastKey = "right"
        break;
      case "ArrowLeft":
        keys.left.pressed = true;
        enemy.lastKey = "left";
        break;
      case "ArrowUp":
        enemy.vel.y = -16;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
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