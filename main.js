import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";
import * as dead from "./deadlist.js"

cfg.ALL_PLAYERS = [
  new Player(cfg.PLAYER_W,cfg.PLAYER_H,1*100,cfg.CANVAS_TOP+40,20,15,"hotpink",'YOU',false),
  new Player(cfg.PLAYER_W,cfg.PLAYER_H,2*100,cfg.CANVAS_TOP+40,10,20,'blue'),
  new Player(cfg.PLAYER_W,cfg.PLAYER_H,3*100,cfg.CANVAS_TOP+40,10,30,"yellow"),
  new Player(cfg.PLAYER_W,cfg.PLAYER_H,4*100,cfg.CANVAS_TOP+40,15,40,"green"),
  new Player(cfg.PLAYER_W,cfg.PLAYER_H,5*100,cfg.CANVAS_TOP+40,15,50,"orange"),
  new Player(100,100,6*100,cfg.CANVAS_TOP+40,0,100,"gray","ボス"),
];

// メイン処理
const loop = () => {
  if (cfg.isGameOver) {
    gov.gameOver();
    return;
  }
  ctx.clearRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);

  cfg.ALL_PLAYERS.forEach(player =>{
    player.draw();
    player.update();
  })
  
  uti.createBox();

  cfg.BOXES.forEach(box =>{
        
    box.draw();
    box.update();

    cfg.ALL_PLAYERS.forEach(player =>{
      uti.checkCollision(player, box);
    })
    
    for(let i=1; i>cfg.ALL_PLAYERS.length; i++){
      uti.checkCollision(cfg.ALL_PLAYERS[i], cfg.ALL_PLAYERS[0])
    }

    autoPlayer(box,cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[1],'slowest',0.7);
    autoPlayer(box,cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[2],'nearest',0.8);
    autoPlayer(box,cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[3],'fastest',0.9);
    autoPlayer(box,cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[4],'highest',1);
    autoPlayer(box,cfg.ALL_PLAYERS[0],cfg.ALL_PLAYERS[5],'all',1.5);

  });

  cfg.ALL_PLAYERS.forEach(player =>{
    gov.checkGameover(player);
  })

  dead.drawDeadArea();
  dead.displayAliveCPUs(dead.getAliveCPUs());

  requestAnimationFrame(loop);
};

window.onload = () => {
  requestAnimationFrame(loop);
};
