import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov  from "./gameover.js";

const player1 = new Player(1,cfg.PLAYER_W,cfg.PLAYER_H,110,cfg.CANVAS_TOP+40,20,15,"hotpink",'YOU',false);//操作するやつ
const player2 = new Player(2,cfg.PLAYER_W,cfg.PLAYER_H,220,cfg.CANVAS_TOP+40,0,20,'blue');//slowest
const player3 = new Player(3,cfg.PLAYER_W,cfg.PLAYER_H,330,cfg.CANVAS_TOP+40,0,30,"yellow");//nearest
const player4 = new Player(4,cfg.PLAYER_W,cfg.PLAYER_H,440,cfg.CANVAS_TOP+40,5,40,"green");//fastest
const player5 = new Player(5,cfg.PLAYER_W,cfg.PLAYER_H,550,cfg.CANVAS_TOP+40,5,50,"orange");//highest
const player6 = new Player(6,100,100,660,cfg.CANVAS_TOP+40,0,100,"gray","ボス");//all

// メイン処理
const loop = () => {
  if (cfg.isGameOver) {
    gov.gameOver();
    return;
  }
  ctx.clearRect(0, 0, cfg.CANVAS_W, cfg.CANVAS_H);
  player1.draw();
  player2.draw();
  player3.draw();
  player4.draw();
  player5.draw();
  player6.draw();
  player1.update1();
  player2.update2();
  player3.update2();
  player4.update2();
  player5.update2();
  player6.update2();
  
  uti.createBox();

  cfg.BOXES.forEach(box => {
    uti.checkCollision(player1, box);
    uti.checkCollision(player2, box);
    uti.checkCollision(player3, box);
    uti.checkCollision(player4, box);
    uti.checkCollision(player5, box);
    uti.checkCollision(player6, box);

    uti.checkCollision(player2, player1);
    uti.checkCollision(player3, player1);
    uti.checkCollision(player4, player1);
    uti.checkCollision(player5, player1);
    uti.checkCollision(player6, player1);
    
    box.draw();
    box.update();
    autoPlayer(box,player1,player2,'slowest',0.7);
    autoPlayer(box,player1,player3,'nearest',0.8);
    autoPlayer(box,player1,player4,'fastest',0.9);
    autoPlayer(box,player1,player5,'highest',1);
    autoPlayer(box,player1,player6,'all',1.5);
  });
  gov.checkGameover(player1);
  gov.checkGameover(player2);
  gov.checkGameover(player3);
  gov.checkGameover(player4);
  gov.checkGameover(player5);
  gov.checkGameover(player6);
  requestAnimationFrame(loop);
};

// 関数呼び出し
window.onload = () => {
  requestAnimationFrame(loop);
};
