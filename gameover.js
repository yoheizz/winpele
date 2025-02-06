import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";

export const gameOver = () => {
    ctx.fillStyle = 'olive';
    ctx.fillRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);
    ctx.fillStyle = 'black';
    ctx.font = '80px Arial';
    ctx.fillText(`勝者: ${cfg.WINNER} `, 100, cfg.CANVAS_H / 2);
    document.getElementById("restart").style.display = "initial";
    document.getElementById("buttonG").style.display = "none";
  };
  
  export const drawDeadArea=()=>{
    ctx.fillStyle = 'rgba(128, 128, 128, 0.08)'
    ctx.fillRect(0,0,cfg.CANVAS_W,cfg.CANVAS_TOP);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(`DEAD_LIST`, cfg.CANVAS_W - 350, 40);
  };
  
  export const checkGameover = (player) => {
    const aliveCPUs = cfg.CPU_PLAYERS - cfg.DEAD_LIST.length;
    if (player.isCpu && player.y >= cfg.CANVAS_H){
      cfg.DEAD_LIST.push({...player});
      player.width = cfg.PLAYER_W;
      player.height = cfg.PLAYER_H;
      player.x = cfg.CANVAS_W - (100 * cfg.DEAD_LIST.length);
      player.y = 120;
      player.isDead =true;
    }
  
    if (player.y >= cfg.CANVAS_H) {
        cfg.isGameOver = true;
        cfg.WINNER = "CPU";
    } else if (player.isCpu && aliveCPUs === 0) {
        cfg.isGameOver = true;
        cfg.WINNER = "人間";
    }
    drawDeadArea();
    displayRemainingCPUs(aliveCPUs);
  };
  
export const displayRemainingCPUs = (aliveCPUs) => {
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText(`残りのCPU: ${aliveCPUs}`, 40, 40);
};
