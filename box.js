import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export class Box {
    constructor(mode) {
      this.x = cfg.CANVAS_W;
      this.y = uti.getRandom(cfg.CANVAS_H / 2, cfg.CANVAS_H);
      this.width = uti.getRandom(1, 300);
      this.height = uti.getRandom(1, 100);
      this.speed = uti.getRandom(5, 30);
      this.up = uti.getRandom(0, 3);
      this.number = cfg.BOX_COUNT++;
      this.mode = mode ?? 0;
    }
  
    draw() {
      if(this.mode===0){
      ctx.fillStyle = "brown";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = '30px Arial';
      ctx.fillStyle = 'brown';
      ctx.fillText(this.number, this.x, this.y);
      }else{
      this.speed = 100;
      ctx.fillStyle = "gold";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = '30px Arial';
      ctx.fillStyle = 'gold';
      ctx.fillText(this.number, this.x, this.y);
      }
    }
  
    update() {
      if (this.x + this.width < 0 || this.y + this.height < 0) {
        const index = cfg.BOXES.indexOf(this);
        if (index !== -1) {
          cfg.BOXES.splice(index, 1);
        }
      } else {
        this.x -= this.speed;
        this.y += Math.sin(this.speed) * this.up;
      }
    }
    restart(){
      cfg.BOXES=[];
    }
};
  