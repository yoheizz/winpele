// キャンバス関係
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_W = 800;
const CANVAS_H = 800;
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

// 定数変数関係
let isGameOver = false;
let boxcount = 0;
let winner = '';

// 関数関係
const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// 距離を計算する関数
const calculateDistance = (A, B) => {
  return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
};

// 当たり判定
const checkCollision = (player, box) => {
  if (
    player.x + player.width > box.x &&
    player.x < box.x + box.width &&
    player.y + player.height > box.y &&
    player.y < box.y + box.height &&
    player.vy >= 0
  ) {
    player.y = box.y - player.height;
    player.vy = 0;
    player.isJumping = false;
  };
};

// ボックスランダム生成最低１個
const createBox = () => {
  if (rand(0,12) === 0) {//15
    boxes.push(new Box());
  }else if(boxes.length===0){
    boxes.push(new Box());
  }
};

const checkGameover = (player) => {
  let allPlayers = [player1, player2, player3, player4, player5,player6]; // プレイヤー全員
  let cpuPlayers = allPlayers.filter(p => p !== player1); // 人間プレイヤー以外をCPUとして扱う
  let aliveCPUs = cpuPlayers.filter(cpu => cpu.y < CANVAS_H).length; // 落ちていないCPUの数をカウント
  
  // ゲームオーバーの判定
  if (player1.y >= CANVAS_H) {
    isGameOver = true;
    winner = 'CPU';
  }
  if (player.y >= CANVAS_H && player !== player1) {
    if (aliveCPUs === 0) {
      isGameOver = true;
      winner = '人間';
    }
  }

  // 残りのCPUの数を表示
  displayRemainingCPUs(aliveCPUs);
};

const displayRemainingCPUs = (aliveCPUs) => {
  ctx.fillStyle = 'black';
  ctx.font = '40px Arial';
  ctx.fillText(`残りのCPU: ${aliveCPUs}`, 10, 80);
};

const gameover = () => {
  ctx.fillStyle = 'olive';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = 'black';
  ctx.font = '80px Arial';
  ctx.fillText(`勝者: ${winner} `, 100, canvas.height / 2);
  document.getElementById("restart").style.display = "initial";
  document.getElementById("buttonG").style.display = "none";
};


// 軌跡を描くための関数
const drawTrajectory = (A, targetBox = null, color) => {
  let tempX = A.x;
  let tempY = A.y;
  let tempVx = A.vx;
  let tempVy = A.vy;
  let tempVg = A.vg;
  
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(tempX + A.width / 2, tempY + A.height / 2);

  for (let i = 0; i < 30; i++) {
    tempVy += tempVg;
    tempX += tempVx;
    tempY += tempVy;

    if (targetBox) {
      // targetBox がある場合は一度だけ線を引く
      ctx.lineTo(targetBox.x + A.width / 2, targetBox.y + A.height / 2);
      break;
    } else {
      // 通常の未来軌跡
      ctx.lineTo(tempX + A.width / 2, tempY + A.height / 2);
    }
  }
  ctx.stroke();
};

const autoPlayer = (box, player, cpu, mode) => {
  if (boxes.length === 0) return;

  // 候補となるボックスを取得（基本条件）
  let candidates = boxes.filter(box => 
    box.x >= 200 && box.x <= 750 && 
    box.y <= 700 && box.width >= 30 && 
    box.speed < cpu.speed * 1.5 && 
    Math.abs(box.x - cpu.x) < 400 // 極端に遠すぎるボックスを除外
  );

  if (candidates.length === 0) candidates = boxes; // 条件を満たすボックスがなければ全ボックスを候補に

  // 最遅のボックスを選択
  let slowestBox = candidates.reduce((slowest, box) => 
    box.speed < slowest.speed ? box : slowest
  , candidates[0]);

  // 最高速度のボックスを選択
  let fastestBox = candidates.reduce((fastest, box) => 
    box.speed > fastest.speed ? box : fastest
  , candidates[0]);

  // もっとも上のボックスを選択
  let highestBox = candidates.reduce((highest, box) => 
    box.y < highest.y ? box : highest
  , candidates[0]);

  // プレイヤーに最も近いボックスを選択
  let nearestBox = candidates.reduce((nearest, box) => 
    calculateDistance(cpu, box) < calculateDistance(cpu, nearest) ? box : nearest
  , candidates[0]);

  // プレイヤーとCPUの近接度やターゲット選択を強化する
  let targetBox;
  switch (mode) {
    case "slowest":
      targetBox = slowestBox;
      break;
    case "fastest":
      targetBox = fastestBox;
      break;
    case "highest":
      targetBox = highestBox;
      break;
    case "nearest":
      targetBox = nearestBox;
      break;
    case "all":
    default:
      // **スコアリングを強化**
      let scoredBoxes = candidates.map(box => {
        let score = 0;
        let distance = calculateDistance(cpu, box);
        let playerDistance = calculateDistance(player, box);
        
        // 遅いボックスを高評価
        score -= Math.abs(box.speed - 0.5) * 4;
        // 高いボックスを優先
        score -= box.y * 2;
        // 右側を優先
        score += box.x * 0.3;
        // プレイヤーに近いボックスを優先
        score -= playerDistance * 0.6;

        // CPUの進行方向をより最適化
        if (cpu.x < box.x) score += 1;
        if (cpu.y > box.y) score += 1;

        return { box, score };
      });

      // スコアが最も高いボックスを選択
      scoredBoxes.sort((a, b) => b.score - a.score);
      targetBox = scoredBoxes[0]?.box || player;
      break;
  }

  // **最適化: 第2候補の考慮**
  if (calculateDistance(cpu, targetBox) > 300) {
    targetBox = nearestBox;
  }

  // **ジャンプ処理を強化**
  if (!cpu.isJumping && targetBox.y < cpu.y) {
    let jumpStrength = Math.min(Math.abs(targetBox.y - cpu.y) * 0.6, cpu.jumpStrength);
    cpu.vy = jumpStrength;
    cpu.isJumping = true;
  }

  // **移動処理の最適化**
  let moveDirection = cpu.x < targetBox.x ? 1 : -1;
  const speedFactor = 0.8;  // 移動速度を上げて強化 0.8
  cpu.vx += moveDirection * speedFactor;
  if (Math.abs(cpu.vx) > 0.25) cpu.vx *= 0.90; // 速度が出過ぎたら減速 0.9

  // **目標に近づいたらターゲット変更**
  if (Math.abs(cpu.x - targetBox.x) < 10 && Math.abs(cpu.y - targetBox.y) < 10) {
    targetBox = nearestBox;
  }

  // **落下防止処理**
  if (!cpu.isJumping && cpu.y > CANVAS_H) {
    targetBox = player;
    cpu.vy = cpu.jumpStrength;
    cpu.isJumping = true;
  }
  // drawTrajectory(cpu, targetBox, "hotpink");
};

// 各クラス
class Player {
  constructor(width,height,x,y,jumpStrength,speed,color,name) {
    this.x = x ?? CANVAS_W / 2;
    this.y = y ?? 0;
    this.width = width ?? 40;
    this.height = height ?? 40;
    this.vx = 0;
    this.vy = 0;
    this.vg = 0.5;
    this.jumpStrength = -jumpStrength ?? -20;
    this.isJumping = false;
    this.speed = speed ?? 15;
    this.startTime = performance.now();
    this.color = color ?? "black";
    this.name = name ?? "";
  }

  draw() {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(this.name,this.x,this.y);  
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black"
    ctx.fillRect(this.x + 10, this.y + 5, this.width / 5, this.height / 5);
    ctx.fillRect(this.x + this.width - 15, this.y + 5, this.width / 5, this.height / 5);
    ctx.fillRect(this.x + 10, this.y + this.height - 15, this.width - 20, this.height / 5);
  }

  update1() {
    const currentTime = performance.now();
    const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
    // 遅延スタート処理
    if (elapsedTimeInSeconds < 1) {
      this.vy = 0;
      this.vx = 0;
    } else {
      this.vy += this.vg;
    }
    this.x += this.vx;
    this.y += this.vy;

    // キー操作
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.vx = -this.speed;  // 左に移動
      } else if (event.key === 'ArrowRight') {
        this.vx = this.speed;   // 右に移動
      } else if (event.key === 'ArrowUp' && !this.isJumping) {
        this.vy = this.jumpStrength;
        this.isJumping = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.vx = 0;  // キーを離した時に停止
      }
    });
    // タッチ操作
    const buttonHandlers = {
      'Jump': () => {
        if (!this.isJumping) {
          this.vy = this.jumpStrength;
          this.isJumping = true;
        }
      },
      'Left': () => this.vx = -this.speed,  // 左に移動
      'Right': () => this.vx = this.speed   // 右に移動
    };

    Object.keys(buttonHandlers).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      button.addEventListener('touchstart', buttonHandlers[buttonId]);
    });

    document.addEventListener('touchend', () => this.vx = 0);    
  }

  update2() {
    const currentTime = performance.now();
    const elapsedTimeInSeconds = (currentTime - this.startTime) / 1000;
    // 遅延スタート処理
    if (elapsedTimeInSeconds < 1) {
      this.vy = 0;
      this.vx = 0;
    } else {
      this.vy += this.vg;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
};

// Box クラスはそのまま
class Box {
  constructor() {
    this.x = CANVAS_W;
    this.y = rand(CANVAS_H / 2, CANVAS_H);
    this.width = rand(1, 300);
    this.height = rand(1, 100);
    this.speed = rand(5, 30);
    this.up = rand(0, 3);
    this.number = boxcount++;
  }

  draw() {
    ctx.fillStyle = "brown";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'brown';
    ctx.fillText(this.number, this.x, this.y);
  }

  update() {
    if (this.x + this.width < 0 || this.y + this.height < 0) {
      const index = boxes.indexOf(this);
      if (index !== -1) {
        boxes.splice(index, 1);
      }
    } else {
      this.x -= this.speed;
      this.y += Math.sin(this.speed) * this.up;
    }
  }
}

// 新規インスタンス
const player1 = new Player(40,40,110,0,20,15,"red",'you');//操作するやつ
const player2 = new Player(40,40,220,0,rand(20,23),20,'blue',);
const player3 = new Player(40,40,330,0,rand(20,23),30,"yellow",);
const player4 = new Player(40,40,440,0,rand(20,23),40,"green",);
const player5 = new Player(40,40,550,0,rand(20,23),50,"orange",);
const player6 = new Player(100,100,660,0,25,100,"gray","ボス");

const boxes = [];

// メイン処理
const loop = () => {
  if (isGameOver) {
    gameover();
    return;
  }
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
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
  createBox();
  boxes.forEach(box => {
    checkCollision(player1, box);
    checkCollision(player2, box);
    checkCollision(player3, box);
    checkCollision(player4, box);
    checkCollision(player5, box);
    checkCollision(player6, box);
    checkCollision(player1,player2);
    checkCollision(player1,player3);
    checkCollision(player1,player4);
    checkCollision(player1,player5);
    checkCollision(player1,player6);
    checkCollision(player2,player1);
    checkCollision(player3,player1);
    checkCollision(player4,player1);
    checkCollision(player5,player1);
    checkCollision(player6,player1);
    box.draw();
    box.update();
    autoPlayer(box,player1,player2,'slowest');
    autoPlayer(box,player1,player3,'highest');
    autoPlayer(box,player1,player4,'fastest');
    autoPlayer(box,player1,player5,'nearest');
    autoPlayer(box,player1,player6,'all');
  });
    checkGameover(player1);
    checkGameover(player2);
    checkGameover(player3);
    checkGameover(player4);
    checkGameover(player5);
    checkGameover(player6);
    requestAnimationFrame(loop);
};

// 関数呼び出し
window.onload = () => {
  requestAnimationFrame(loop);
};
