import { config as cfg } from "./config.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";
import * as dead from "./deadlist.js"

export const gameOver = () => {
    ctx.fillStyle = 'hotpink'
    ctx.font = '80px Arial';
    ctx.fillText(`勝者: ${cfg.WINNER} `, cfg.CANVAS_W/4, cfg.CANVAS_H / 2);
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
        cfg.WINNER = "YOU";
    }
  };
