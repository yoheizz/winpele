import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export class Box {
    constructor(color) {
      this.x = cfg.CANVAS_W;
      this.y = uti.getRandom(cfg.CANVAS_TOP*1.5, cfg.CANVAS_H);
      this.width = uti.getRandom(1, 300);
      this.height = uti.getRandom(1, 100);
      this.speed = uti.getRandom(5, 40);
      this.up = uti.getRandom(0, 5);
      this.number = cfg.BOX_COUNT++;
      this.color = color;
    }
  
    draw() {
      this.checkMode();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      }
  
    update() {
      this.splice();
      this.move();
    }
    
    splice() {
      if (this.x + this.width < 0 || this.y + this.height < 0) {
        cfg.BOXES = cfg.BOXES.filter(box => box !== this);
      }
    }    

    move(){
      this.x -= this.speed;
      this.y += Math.sin(this.speed) * this.up;
    }

    checkMode() {
      switch (this.color) {
        case cfg.BOX_COLORS[1]:
          this.width = 300;
          this.height = 300;
          break;
        case cfg.BOX_COLORS[2]:
          this.width = 500;
          this.height =30;
          break;
        case cfg.BOX_COLORS[3]:
          this.width = 30;
          this.height = 500;
          break;
        case cfg.BOX_COLORS[4]:
          this.speed = 30;
          break;
        case cfg.BOX_COLORS[5]:
          this.speed = 8;
          this.up = 0;
          break;
        case cfg.BOX_COLORS[0]:
          break;
      }
    }
    restart(){
      cfg.BOXES=[];
    }
};
  