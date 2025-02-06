import { config as cfg } from "./config.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";

export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

export const getDistance = (A, B) => {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
  };

// 軌跡を描くための関数
export const drawTrajectory = (A, targetBox = null, color) => {
    let tempX = A.x;
    let tempY = A.y;
    let tempVx = A.vx;
    let tempVy = A.vy;
    let tempVg = A.vg;
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(tempX + A.width / 2, tempY + A.height / 2);
  
    for (let i = 0; i < 30; i++) {
      tempVy += tempVg;
      tempX += tempVx;
      tempY += tempVy;
  
      if (targetBox) {
        // targetBox がある場合は一度だけ線を引く
        ctx.lineTo(targetBox.x + A.width / 2, targetBox.y + A.height / 2);
        break;
      } else {
        // 通常の未来軌跡
        ctx.lineTo(tempX + A.width / 2, tempY + A.height / 2);
      }
    }
    ctx.stroke();
  };
  
  // 当たり判定
export const checkCollision = (player, box) => {
    if(player.isDead||box.isDead)return;
    if (
      player.x + player.width > box.x &&
      player.x < box.x + box.width &&
      player.y + player.height > box.y &&
      player.y < box.y + box.height &&
      player.vy >= 0
    ) {
      player.y = box.y - player.height;
      player.vy = 0;
      player.isJumping = false;
    };
  };

  // ボックスランダム生成最低１個
export const createBox = () => {
    if (getRandom(0,12) === 0) {//15
      cfg.BOXES.push(new Box());
    }else if(cfg.BOXES.length===0){
      cfg.BOXES.push(new Box());
    }
  };
  