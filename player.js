import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export class Player {
    constructor(width,height,x,y,jumpStrength,speed,color,name,cpu) {
      this.x = x ?? cfg.CANVAS_W / 2;
      this.y = y ?? cfg.CANVAS_TOP;
      this.width = width ?? cfg.PLAYER_W;
      this.height = height ?? cfg.PLAYER_H;
      this.vx = 0;
      this.vy = 0;
      this.vg = 0.5;
      this.jumpStrength = -jumpStrength ?? -20;
      this.isJumping = false;
      this.speed = speed ?? 15;
      this.startTime = performance.now();
      this.color = color ?? "black";
      this.name = name ?? "CPU";
      this.isDead = false;
      this.isCpu = cpu ?? true;
      this.elapsedTime = 0;
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
      this.elpased(1);
      if(this.isCpu)return;
      // キー操作
      document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          this.vx = -this.speed;  // 左に移動
        } else if (event.key === 'ArrowRight') {
          this.vx = this.speed;   // 右に移動
        } else if (event.key === 'ArrowUp' && !this.isJumping) {
          this.vy = this.jumpStrength;
          this.isJumping = true;
        }
      });
  
      document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          this.vx = 0;  // キーを離した時に停止
        }
      });
      // タッチ操作
      const buttonHandlers = {
        'Jump': () => {
          if (!this.isJumping) {
            this.vy = this.jumpStrength;
            this.isJumping = true;
          }
        },
        'Left': () => this.vx = -this.speed,  // 左に移動
        'Right': () => this.vx = this.speed   // 右に移動
      };
  
      Object.keys(buttonHandlers).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        button.addEventListener('touchstart', buttonHandlers[buttonId]);
      });
  
      document.addEventListener('touchend', () => this.vx = 0);    
    }

    elpased(time){
      const currentTime = performance.now();
      const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
      if (elapsedTimeInSeconds < time) {
        this.vy = 0;
        this.vx = 0;
      } else {
        this.vy += this.vg;
      }
      this.x += this.vx;
      this.y += this.vy;
    }

    dead() {
      if (this.isDead) {
        this.resetPosition();
        this.rebone(2);
      }
    }
    
    resetPosition() {
      this.width = cfg.PLAYER_W;
      this.height = cfg.PLAYER_H;
      this.x = cfg.CANVAS_W - (100 * cfg.DEAD_LIST.length);
      this.y = 120;
    }
    
    rebone(time) {
      const elapsedTime = (performance.now() - this.startTime) / 1000;
      if (this.isDead && elapsedTime >= time) {
        this.isDead = false;
        this.startTime = performance.now();  // 時間リセット
        this.vx = 0;
        this.vy = 0;
      }
    }    
};