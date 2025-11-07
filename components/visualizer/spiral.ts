import { Theme } from '../../types';

// Spiral and rotational visualizations

export function drawDoubleHelix(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const amplitude = height / 4;
  const frequency = 3;
  const sliceWidth = width / bufferLength;
  
  for (let i = 0; i < bufferLength; i++) {
    const x = i * sliceWidth;
    const dataValue = (dataArray[i] / 255) * sensitivity;
    const angle = (i / bufferLength) * frequency * 2 * Math.PI;
    
    const y1 = height / 2 + Math.sin(angle) * amplitude * dataValue;
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.arc(x, y1, 3 * dataValue, 0, 2 * Math.PI);
    ctx.fill();
    
    const y2 = height / 2 + Math.sin(angle + Math.PI) * amplitude * dataValue;
    ctx.fillStyle = theme.secondary;
    ctx.beginPath();
    ctx.arc(x, y2, 3 * dataValue, 0, 2 * Math.PI);
    ctx.fill();
    
    if (i % 5 === 0) {
      ctx.strokeStyle = theme.highlight + '40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();
    }
  }
}

export function drawSpiralGalaxy(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  
  const numArms = 3;
  for (let arm = 0; arm < numArms; arm++) {
    ctx.beginPath();
    const armOffset = (arm / numArms) * 2 * Math.PI;
    
    for (let i = 0; i < bufferLength; i++) {
      const t = i / bufferLength;
      const angle = t * 4 * Math.PI + armOffset;
      const radius = t * maxRadius;
      const offset = ((dataArray[i] / 255) * 40) * sensitivity;
      
      const x = centerX + (radius + offset) * Math.cos(angle);
      const y = centerY + (radius + offset) * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    const armColor = arm % 2 === 0 ? theme.primary : theme.secondary;
    ctx.strokeStyle = armColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

export function drawVortex(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  
  ctx.lineWidth = 2;
  
  for (let i = 0; i < bufferLength; i++) {
    const t = i / bufferLength;
    const spiralTurns = 5;
    const angle = t * spiralTurns * 2 * Math.PI;
    const radius = t * maxRadius;
    const offset = (dataArray[i] / 255) * 50 * sensitivity;
    
    const x = centerX + (radius + offset) * Math.cos(angle);
    const y = centerY + (radius + offset) * Math.sin(angle);
    const size = (dataArray[i] / 255) * 4 * sensitivity;
    
    ctx.fillStyle = i % 2 === 0 ? theme.primary : theme.secondary;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function drawKaleidoscope(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const segments = 6;
  
  for (let seg = 0; seg < segments; seg++) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((seg / segments) * 2 * Math.PI);
    
    ctx.beginPath();
    for (let i = 0; i < bufferLength; i++) {
      const radius = (i / bufferLength) * Math.min(width, height) / 2;
      const angle = (i / bufferLength) * Math.PI / 2;
      const offset = (dataArray[i] / 255) * 30 * sensitivity;
      
      const x = Math.cos(angle) * (radius + offset);
      const y = Math.sin(angle) * (radius + offset);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = seg % 2 === 0 ? theme.primary : theme.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }
}

