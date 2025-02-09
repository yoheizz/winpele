import { ctx } from "./canvas.js";
import { config as cfg } from "./config.js";
import * as uti from "./utils.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

cfg.createPlayers();

const loop = () => {
  if (cfg.isGameOver) {
    gov.gameOver();
    return;
  }
  ctx.clearRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);

  cfg.ALL_PLAYERS.forEach(player => {
    player.draw();
    player.update();
    gov.checkGameover(player);
  });

  cfg.createBox();
  cfg.BOXES.forEach(box => {
    box.draw();
    box.update();
    cfg.ALL_PLAYERS.forEach(player => {
      uti.checkCollision(player, box);
    });

    autoPlayer(box, cfg.ALL_PLAYERS[0], cfg.ALL_PLAYERS[1], 'slowest', 0.5);
    autoPlayer(box, cfg.ALL_PLAYERS[0], cfg.ALL_PLAYERS[2], 'nearest', 0.6);
    autoPlayer(box, cfg.ALL_PLAYERS[0], cfg.ALL_PLAYERS[3], 'fastest', 0.7);
    autoPlayer(box, cfg.ALL_PLAYERS[0], cfg.ALL_PLAYERS[4], 'highest', 0.9);
    autoPlayer(box, cfg.ALL_PLAYERS[0], cfg.ALL_PLAYERS[5], 'all', 1.5);
  });

  dead.drawDeadArea();
  dead.displayAliveCPUs(dead.getAliveCPUs());
  
  uti.checkLock();
  drawMagma();
  cfg.LOOP_ID = requestAnimationFrame(loop);
};

window.onload = () => {
  document.getElementById("restart").addEventListener("click", restartGame);
  uti.checkDisplay();
  requestAnimationFrame(loop);
};

const restartGame = () => {
  if (cfg.LOOP_ID) {
    cancelAnimationFrame(cfg.LOOP_ID);
    cfg.LOOP_ID = null;
  }
  cfg.BOXES.forEach(box => { box.restart(); });
  cfg.ALL_PLAYERS.forEach(player => { player.restart(); });
  cfg.DEAD_LIST = [];
  cfg.isGameOver = false;
  cfg.BOX_COUNT = 0;
  uti.checkDisplay();
  document.getElementById("restart").style.display = "none";
  cfg.LOOP_ID = requestAnimationFrame(loop);
};

