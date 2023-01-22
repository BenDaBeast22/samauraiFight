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

    // sprite
    // c.fillStyle = this.color;
    // c.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    // attack box
    // if (this.isAttacking || this.didLandAttack) {
    //   c.fillStyle = this.attackBox.color;
    //   c.fillRect(
    //     this.attackBox.pos.x,
    //     this.attackBox.pos.y,
    //     this.attackBox.width,
    //     this.attackBox.height
    //   );
    // }
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
    offset = {x: 0, y: 0},
    sprites,
    attackbox
  }) {
    super({
      pos,
      imgSrc, 
      scale,
      numFrames,
      offset,
      sprites,
    });
    this.width = width;
    this.height = height;
    this.color = color;
    this.vel = vel;
    this.onGround;
    this.lastKey;
    this.attackBox = {
      pos: {
        x: this.pos.x + attackbox.offset.x,
        y: this.pos.y + attackbox.offset.y
      },
      offset: attackbox.offset,
      width: attackbox.width,
      height: attackbox.height, 
      color: attackbox.color
    }
    this.isAttacking;
    this.didLandAttack;
    this.dead;
    this.health = 100;
    this.groundOffset = 95;
    this.framesCurrent = 0;
    this.frameRate = 6;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imgSrc;
    }
  }

  update() {
    this.draw();
    if(!this.dead) this.nextFrame();
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
      this.vel.y = 0;
      this.onGround = true;
      // this.image = this.sprites.idle.image;
    }
    // horizantal movement
    this.pos.x += this.vel.x;
  }

  switchSprite(sprite) {
    // override animtaion when fighter dies
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.numFrames - 1) { 
        this.dead = true;
      }
      return;
    }

    // overide animation when fighter takes hit
    if (this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.numFrames - 1
    ) return;

    // overides animation when fighter attacks
    if (this.image === this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.numFrames - 1
    ) return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.numFrames = this.sprites.idle.numFrames;
          this.framesCurrent = 0;
          console.log("idle")
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.numFrames = this.sprites.run.numFrames;
          this.framesCurrent = 0;
          console.log("run")
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.numFrames = this.sprites.jump.numFrames;
          this.framesCurrent = 0;
          console.log("jump")
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.numFrames = this.sprites.fall.numFrames;
          this.framesCurrent = 0;
          console.log("fall")
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.numFrames = this.sprites.attack1.numFrames;
          this.framesCurrent = 0;
          console.log("attack1")
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.numFrames = this.sprites.takeHit.numFrames;
          this.framesCurrent = 0;
          console.log("take hit");
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.numFrames = this.sprites.death.numFrames;
          this.framesCurrent = 0;
        }
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  landAttack() {
    this.isAttacking = false;
    this.didLandAttack = true;
    setTimeout(() => {
      this.didLandAttack = false;
    }, 100);
  }
}