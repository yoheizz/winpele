import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";
import { ctx } from "./canvas.js";

export const drawDeadArea=()=>{
    ctx.fillStyle = 'rgba(128, 128, 128, 0.08)'
    ctx.fillRect(0,0,cfg.CANVAS_W,cfg.DEADLIST_H);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(`DEAD_LIST`, 500, 40);
};

export const getAliveCPUs=()=> cfg.allPlayers.length - cfg.IAM_PLAYERS - cfg.DEAD_LIST.length;

export const setDeadlist=(player)=>{
    if (player.isCpu && player.y >= cfg.CANVAS_H){
        cfg.DEAD_LIST.push(player);
        player.isDead =true;
        player.dead();
        player.rebone(2);//2秒後復活
    };
};
export const displayAliveCPUs = (aliveCPUs) => {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(`残りのCPU: ${aliveCPUs}`, 40, 40);
};
