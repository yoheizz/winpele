import * as uti from "./utils.js";
import { ctx } from "./canvas.js";
import { Player } from "./player.js";
import { autoPlayer } from "./cpu.js";
import { Box } from "./box.js";
import * as gov from "./gameover.js";
import * as dead from "./deadlist.js";
import { drawMagma } from "./magma.js";

export const config = {
    CANVAS_W : 800,
    CANVAS_H : 800,
    CANVAS_TOP : 150,

    FPS : 1000/60,
    LOOP_ID : null,
    GAME_TIME : 0,
    isGameOver : false,
    DEADLIST_H : 150,
    DEAD_LIST : [],
    WINNER : '',
    REBONE_TIME : 5,
    
    ALL_PLAYERS : [],
    IAM_PLAYERS : 1,
    PLAYER_E_TIME : 1,
    PLAYER_W : 40,
    PLAYER_H : 40,
    P_GRAVITY : 0.5,
    P_JUMP : -20,
    P_SPEED : 15,
    P_START_y : 110,
    
    CPU_TYPE :['slowest','nearest','fastest','highest','all'],
    CPU_LEVEL :0.9,

    BOXES : [],
    BOX_COUNT : 0,
    BOX_LEVEL : 10,
    BOX_COLORS : ["brown","blue", "green", "purple", "orange", "gold"],
    
    MAGMA_H : 30,
    MAGMA_WAVE : 10,

    createPlayers : function(){
        this.ALL_PLAYERS =[
            new Player(1 * 100, this.P_START_y ,'YOU', false),
            new Player(2 * 100, this.P_START_y ,'',true),
            new Player(3 * 100, this.P_START_y ,'',true),
            new Player(4 * 100, this.P_START_y ,'',true),
            new Player(5 * 100, this.P_START_y ,'',true),
            new Player(6 * 100, this.P_START_y ,'',true),
        ]
    },

    createBox : function(){
        let B_COLOR
        if (uti.getRandom(0, 99) >= 80) {
            B_COLOR = this.BOX_COLORS[uti.getRandom(1, this.BOX_COLORS.length - 1)];
        }else{
            B_COLOR = this.BOX_COLORS[0];
        }
        if (uti.getRandom(0, this.BOX_LEVEL) === 0) {
          this.BOXES.push(new Box(B_COLOR));
        } else if (this.BOXES.length === 0) {
          this.BOXES.push(new Box(B_COLOR));
        }
    },
};
