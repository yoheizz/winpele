import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export class Player {
    constructor(x,y,name,cpu) {
      this.x = x;
      this.y = cfg.P_START_y;
      this.width = cfg.PLAYER_W;
      this.height =cfg.PLAYER_H;
      this.vx = 0;
      this.vy = 0;
      this.vg = cfg.P_GRAVITY;
      this.jumpStrength = cfg.P_JUMP;
      this.isJumping = false;
      this.speed = cfg.P_SPEED;
      this.startTime = performance.now();
      this.color = cpu ? uti.getColor() : "hotpink";
      this.name = name ?? "CPU";
      this.isDead = false;
      this.isCpu = cpu ?? true;
      this.elapsedTime = 0;
      this.initialx = this.x;
      this.initialy = this.y
    }
  
    draw() {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText(this.name,this.x,this.y-10);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black"
        ctx.fillRect(this.x + 10, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + this.width - 15, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + 10, this.y + this.height - 15, this.width - 20, this.height / 5);
    }
    update() {
      this.elpased(cfg.PLAYER_E_TIME);
      if(this.isCpu)return;

      document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          this.left();
        } else if (event.key === 'ArrowRight') {
          this.right();
        } else if (event.key === 'ArrowUp') {
         this.up();
        }
      });

      document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          this.keyup();
        }
      });

      const buttonHandlers = {
        'Jump': () => this.up(),
        'Left': () => this.left(),
        'Right': () => this.right()
      };
  
      Object.keys(buttonHandlers).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        button.addEventListener('touchstart', buttonHandlers[buttonId]);
      });
  
      document.addEventListener('touchend', () => this.keyup());    
    }

    elpased(time){
      if(this.isDead)return;
      const currentTime = performance.now();
      const elpsedTimeInSeconds = (currentTime - this.startTime) / 1000;
      if (elpsedTimeInSeconds >= time) {
        this.vy += this.vg;
        this.x += this.vx;
        this.y += this.vy;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
    }
    dead() {
        if(!this.isDead)return;
        this.resetPosition();
        // this.rebone(3); //保留
    }
    
    resetPosition() {
      this.x = cfg.CANVAS_W - (100 * cfg.DEAD_LIST.length);
      this.y = cfg.DEADLIST_H-this.height*1.1;
    }
    
    rebone(time) {
      const elpsedTime = (performance.now() - this.startTime) / 1000;
      if (this.isDead && elpsedTime >= time) {
        this.isDead = false;
        const index = cfg.DEAD_LIST.indexOf(this);
        if (index !== -1) {
          cfg.DEAD_LIST.splice(index, 1);
        }
        this.startTime = performance.now();
        this.vx = 0;
        this.vy = 0;
      }
    }
    restart(){
      this.x = this.initialx;
      this.y = this.initialy;
      this.vx = 0;
      this.vy = 0;
      this.isJumping = false;
      this.isDead = false;
      this.startTime = performance.now(); 
      if(this.isCpu)this.color = uti.getColor();
    }
    getTime(){
      cfg.GAME_TIME = ((performance.now() - this.startTime) / 1000).toFixed(2);
    }
    left(){
      this.vx = -this.speed;
    }
    right(){
      this.vx = this.speed;
    }
    up(){
      if(!this.isJumping){
      this.vy = this.jumpStrength;
      this.isJumping = true;
      }
    }
    keyup(){
      this.vx = 0;
    }
};