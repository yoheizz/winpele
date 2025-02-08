import { config as cfg } from "./config.js";
import * as uti from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

cfg.ALL_PLAYERS =[
    new Player(cfg.PLAYER_W, cfg.PLAYER_H, 1 * 100, cfg.CANVAS_TOP - cfg.PLAYER_H, 20, 15, "hotpink", 'YOU', false),
    new Player(cfg.PLAYER_W, cfg.PLAYER_H, 2 * 100, cfg.CANVAS_TOP - cfg.PLAYER_H, 20, 15, uti.getColor(), "A", true),
    new Player(cfg.PLAYER_W, cfg.PLAYER_H, 3 * 100, cfg.CANVAS_TOP - cfg.PLAYER_H, 20, 15, uti.getColor(), "B", true),
    new Player(cfg.PLAYER_W, cfg.PLAYER_H, 4 * 100, cfg.CANVAS_TOP - cfg.PLAYER_H, 20, 15, uti.getColor(), "C", true),
    new Player(cfg.PLAYER_W, cfg.PLAYER_H, 5 * 100, cfg.CANVAS_TOP - cfg.PLAYER_H, 20, 15, uti.getColor(), "D", true),
    new Player(cfg.PLAYER_W, cfg.PLAYER_H, 6 * 100, cfg.CANVAS_TOP - cfg.PLAYER_H, 20, 15, uti.getColor(), "E", true),
];

const loop = () => {
  if (cfg.isGameOver) {
    gov.gameOver();
    return;
  }

  ctx.clearRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);

  cfg.ALL_PLAYERS.forEach(player => {
    player.draw();
    player.update();
  });

  cfg.ALL_PLAYERS.forEach(player => {
    gov.checkGameover(player);
  });

  uti.createBox();

  cfg.BOXES.forEach(box => {
    box.draw();
    box.update();

    cfg.ALL_PLAYERS.forEach(player => {
      uti.checkCollision(player, box);
    });

    for (let i = 1; i > cfg.ALL_PLAYERS.length; i++) {
      uti.checkCollision(cfg.ALL_PLAYERS[i], cfg.ALL_PLAYERS[0]);
    }

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
  requestAnimationFrame(loop);
};

window.onload = () => {
  document.getElementById("restart").addEventListener("click", restartGame);
  uti.checkDisplay();
  requestAnimationFrame(loop);
};

const restartGame = () => {
  cfg.BOXES.forEach(box => { box.restart(); });
  cfg.ALL_PLAYERS.forEach(player => { player.restart(); });
  cfg.DEAD_LIST = [];
  cfg.isGameOver = false;
  cfg.BOX_COUNT = 0;
  uti.checkDisplay();
  document.getElementById("restart").style.display = "none";
  requestAnimationFrame(loop);
};