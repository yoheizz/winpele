import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import * as dead from "./deadlist.js"

export const gameOver = () => {
    ctx.fillStyle = 'olive';
    ctx.fillRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);
    ctx.fillStyle = 'black';
    ctx.font = '80px Arial';
    ctx.fillText(`勝者: ${cfg.WINNER} `, 100, cfg.CANVAS_H / 2);
    document.getElementById("restart").style.display = "initial";
    document.getElementById("buttonG").style.display = "none";
  };
   
  export const checkGameover = (player) => {

    dead.setDeadlist(player);

    if (!player.isCpu && player.y >= cfg.CANVAS_H) {
        cfg.isGameOver = true;
        cfg.WINNER = "CPU";
    } else if (player.isCpu && dead.getAliveCPUs() === 0) {
        cfg.isGameOver = true;
        cfg.WINNER = "人間";
    }
  };
