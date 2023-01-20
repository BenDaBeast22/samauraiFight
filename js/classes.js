class Sprite {
  constructor({ pos, imgSrc, scale=1, numFrames=1, offset = {x: 0, y: 0} }) {
    this.pos = pos;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.numFrames = numFrames;
    this.framesCurrent = 0;
    this.frameCounter = 0;
    this.frameRate = 5;
    this.offset = offset;
  }
  draw() {
    if (!this.image) return // prevent trying to draw image that hasn't loaded
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.numFrames),
      0,
      this.image.width / this.numFrames,
      this.image.height,
      this.pos.x - this.offset.x, 
      this.pos.y - this.offset.y, 
      this.image.width / this.numFrames * this.scale, 
      this.image.height * this.scale
    );
  }
  nextFrame() {
    this.frameCounter++;
    if (this.frameCounter % this.frameRate === 0) {
      this.frameCounter = 0;
      if (this.framesCurrent < this.numFrames - 1) {
        this.framesCurrent += 1;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.nextFrame();
  }
}

class Fighter extends Sprite {
  constructor({
    pos, 
    width, 
    height, 
    vel, 
    color,  
    imgSrc, 
    scale=1, 
    numFrames=1,
    offset = {x: 0, y: 0}
  }) {
    super({
      pos,
      imgSrc, 
      scale,
      numFrames,
      offset
    });
    this.width = width;
    this.height = height;
    this.color = color;
    this.vel = vel;
    this.onGround;
    this.lastKey;
    this.attackBox = {
      pos: {
        x: this.pos.x + offset.x,
        y: this.pos.y + offset.y
      },
      offset: offset,
      width: 100,
      height: 50, 
      color: "yellow"
    }
    this.isAttacking;
    this.didLandAttack;
    this.health = 100;
    this.groundOffset = 95;
    this.framesCurrent = 0;
    this.frameRate = 6;
  }

  // draw() {
  //   // sprite
  //   c.fillStyle = this.color;
  //   c.fillRect(this.pos.x, this.pos.y, this.width, this.height);

  //   // attack box
  //   if (this.isAttacking || this.didLandAttack) {
  //     c.fillStyle = this.attackBox.color;
  //     c.fillRect(
  //       this.attackBox.pos.x,
  //       this.attackBox.pos.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     );
  //   }
  // }

  update() {
    this.draw();
    this.nextFrame();
    this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.pos.y = this.pos.y + this.attackBox.offset.y;
    // vertical movement
    this.pos.y += this.vel.y;
    // ground physics
    if (this.pos.y + this.height + this.vel.y < canvas.height - this.groundOffset) {
      // vertical acceleration
      this.vel.y += gravity
      this.onGround = false;
    } else {
      // vertical collision
      this.pos.y = canvas.height - this.height - this.groundOffset;
      this.onGround = true;
    }
    // horizantal movement
    this.pos.x += this.vel.x;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 500)
  }

  landAttack() {
    console.log("Hit")
    this.isAttacking = false;
    this.didLandAttack = true;
    setTimeout(() => {
      this.didLandAttack = false;
    }, 100);
  }
}