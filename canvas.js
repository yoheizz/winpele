import { config as cfg } from "./config.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.width = cfg.CANVAS_W;
canvas.height = cfg.CANVAS_H;