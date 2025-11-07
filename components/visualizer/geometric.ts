import { Theme } from '../../types';

// Geometric shapes and patterns

export function drawDiamond(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const numLayers = Math.min(bufferLength, 50);
  
  for (let i = 0; i < numLayers; i++) {
    const size = ((i + 1) / numLayers) * Math.min(width, height) / 2;
    const offset = (dataArray[i] / 255) * 30 * sensitivity;
    const actualSize = size + offset;
    
    const alpha = 1 - (i / numLayers);
    ctx.strokeStyle = i % 2 === 0 
      ? theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0')
      : theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - actualSize);
    ctx.lineTo(centerX + actualSize, centerY);
    ctx.lineTo(centerX, centerY + actualSize);
    ctx.lineTo(centerX - actualSize, centerY);
    ctx.closePath();
    ctx.stroke();
  }
}

export function drawFlower(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const petals = 12;
  
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * 2 * Math.PI;
    const dataIndex = Math.floor((i / petals) * bufferLength);
    const petalLength = (dataArray[dataIndex] / 255) * Math.min(width, height) / 3 * sensitivity;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    
    const x1 = centerX + Math.cos(angle - 0.2) * petalLength;
    const y1 = centerY + Math.sin(angle - 0.2) * petalLength;
    const x2 = centerX + Math.cos(angle) * petalLength * 1.3;
    const y2 = centerY + Math.sin(angle) * petalLength * 1.3;
    const x3 = centerX + Math.cos(angle + 0.2) * petalLength;
    const y3 = centerY + Math.sin(angle + 0.2) * petalLength;
    
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.quadraticCurveTo(x3, y3, centerX, centerY);
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, petalLength);
    gradient.addColorStop(0, theme.highlight);
    gradient.addColorStop(0.5, theme.primary);
    gradient.addColorStop(1, theme.secondary);
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = theme.highlight;
  ctx.fill();
}

export function drawLightning(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const numStrikes = 10;
  const pointsPerStrike = Math.floor(bufferLength / numStrikes);
  
  ctx.shadowBlur = 20;
  ctx.shadowColor = theme.primary;
  ctx.lineWidth = 3;
  
  for (let strike = 0; strike < numStrikes; strike++) {
    const startX = (width / numStrikes) * strike + (width / numStrikes) / 2;
    const startY = 0;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    let currentX = startX;
    let currentY = startY;
    
    for (let i = 0; i < pointsPerStrike && i < 15; i++) {
      const dataIndex = strike * pointsPerStrike + i;
      if (dataIndex >= bufferLength) break;
      
      const xOffset = ((Math.random() - 0.5) * 40) * (dataArray[dataIndex] / 255) * sensitivity;
      const yStep = height / 15;
      
      currentX += xOffset;
      currentY += yStep;
      
      ctx.lineTo(currentX, currentY);
    }
    
    ctx.strokeStyle = strike % 2 === 0 ? theme.primary : theme.secondary;
    ctx.stroke();
  }
  
  ctx.shadowBlur = 0;
}

