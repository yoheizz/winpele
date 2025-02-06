import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";

cfg.allPlayers = [
  new Player(1,cfg.PLAYER_W,cfg.PLAYER_H,110,cfg.CANVAS_TOP+40,20,15,"hotpink",'YOU',false),
  new Player(2,cfg.PLAYER_W,cfg.PLAYER_H,220,cfg.CANVAS_TOP+40,0,20,'blue'),
  new Player(3,cfg.PLAYER_W,cfg.PLAYER_H,330,cfg.CANVAS_TOP+40,0,30,"yellow"),
  new Player(4,cfg.PLAYER_W,cfg.PLAYER_H,440,cfg.CANVAS_TOP+40,5,40,"green"),
  new Player(5,cfg.PLAYER_W,cfg.PLAYER_H,550,cfg.CANVAS_TOP+40,5,50,"orange"),
  new Player(6,100,100,660,cfg.CANVAS_TOP+40,0,100,"gray","ボス"),
];

// メイン処理
const loop = () => {
  if (cfg.isGameOver) {
    gov.gameOver();
    return;
  }
  ctx.clearRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);

  cfg.allPlayers.forEach(player =>{
    player.draw();
    player.update();
  })
  
  uti.createBox();

  cfg.BOXES.forEach(box =>{
        
    box.draw();
    box.update();

    cfg.allPlayers.forEach(player =>{
      uti.checkCollision(player, box);
    })
    
    for(let i=1; i>cfg.allPlayers.length; i++){
      uti.checkCollision(cfg.allPlayers[i], cfg.allPlayers[0])
    }

    autoPlayer(box,cfg.allPlayers[0],cfg.allPlayers[1],'slowest',0.7);
    autoPlayer(box,cfg.allPlayers[0],cfg.allPlayers[2],'nearest',0.8);
    autoPlayer(box,cfg.allPlayers[0],cfg.allPlayers[3],'fastest',0.9);
    autoPlayer(box,cfg.allPlayers[0],cfg.allPlayers[4],'highest',1);
    autoPlayer(box,cfg.allPlayers[0],cfg.allPlayers[5],'all',1.5);

  });

  cfg.allPlayers.forEach(player =>{
    gov.checkGameover(player);
  })

  requestAnimationFrame(loop);
};

window.onload = () => {
  requestAnimationFrame(loop);
};
