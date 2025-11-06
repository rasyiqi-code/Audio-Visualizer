
import { Theme } from '../../types';

// This file contains the drawing logic for each visualization type.

export function drawBars(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barWidth = (width / bufferLength) * 2.5;
  let x = 0;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.primary);
  gradient.addColorStop(0.5, theme.secondary);
  gradient.addColorStop(1, theme.background);
  ctx.fillStyle = gradient;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = ((dataArray[i] / 255) * height) * sensitivity;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

export function drawWaveform(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.primary;
  ctx.beginPath();
  const sliceWidth = (width * 1.0) / bufferLength;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    // dataArray values are 0-255, 128 is silence.
    const amplitude = (dataArray[i] - 128) * sensitivity;
    const y = height / 2 + amplitude;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx.lineTo(width, height / 2);
  ctx.stroke();
}

export function drawCircle(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 4;
  ctx.lineWidth = 2;
  
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = ((dataArray[i] / 255) * (radius * 0.8)) * sensitivity;
    const angle = (i / bufferLength) * 2 * Math.PI;

    const x1 = centerX + radius * Math.cos(angle);
    const y1 = centerY + radius * Math.sin(angle);
    const x2 = centerX + (radius + barHeight) * Math.cos(angle);
    const y2 = centerY + (radius + barHeight) * Math.sin(angle);
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, theme.secondary);
    gradient.addColorStop(1, theme.primary);
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
