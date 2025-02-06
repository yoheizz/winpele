import { config as cfg } from "./config.js";
import * as uti  from "./utils.js";

export const autoPlayer = (box, player, cpu, mode,rank) => {
    if (cfg.BOXES.length === 0) return;
  
    // 候補となるボックスを取得（基本条件）
    let candidates = cfg.BOXES.filter(box => 
      box.x >= 200 && box.x <= 750 && //200 750
      box.y <= cfg.CANVAS_TOP+700 && box.width >= 30 && //700 30
      box.speed < cpu.speed * 1.5 &&  //1.5
      Math.abs(box.x - cpu.x) < 400 // 極端に遠すぎるボックスを除外
    );
  
    if (candidates.length === 0) candidates = cfg.BOXES; // 条件を満たすボックスがなければ全ボックスを候補に
  
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
      uti.getDistance(cpu, box) < uti.getDistance(cpu, nearest) ? box : nearest
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
      let distance = uti.getDistance(cpu, box);
      let playerDistance = uti.getDistance(player, box);
  
      // 遅いボックスを高評価
      score -= Math.abs(box.speed-0.5) * 4;//引く数字が優先速度　
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
    if (uti.getDistance(cpu, targetBox) > 300) {
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
    const speedFactor = rank;  // 移動速度を上げて強化 0.8がいいくらい
    cpu.vx += moveDirection * speedFactor;
    if (Math.abs(cpu.vx) > 0.25) cpu.vx *= 0.90; // 速度が出過ぎたら減速 0.9
  
    // **目標に近づいたらターゲット変更**
    if (Math.abs(cpu.x - targetBox.x) < 10 && Math.abs(cpu.y - targetBox.y) < 10) {
      targetBox = nearestBox;
    }
  
    // **落下防止処理**
    if (!cpu.isJumping && cpu.y > cfg.CANVAS_TOP+780) {
      targetBox = player;
      cpu.vy = cpu.jumpStrength;
      cpu.isJumping = true;
    }
  };
  