import { Theme } from '../../types';

// Circular and radial visualizations

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

export function drawRadialWave(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  
  const numCircles = 8;
  for (let j = 0; j < numCircles; j++) {
    ctx.beginPath();
    const baseRadius = (maxRadius / numCircles) * (j + 1);
    
    for (let i = 0; i <= bufferLength; i++) {
      const angle = (i / bufferLength) * 2 * Math.PI;
      const offset = ((dataArray[i % bufferLength] / 255) * 30) * sensitivity;
      const radius = baseRadius + offset;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.strokeStyle = j % 2 === 0 ? theme.primary : theme.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawSoundPulse(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  const average = sum / bufferLength;
  const normalizedAvg = (average / 255) * sensitivity;
  
  const numRings = 5;
  for (let i = 0; i < numRings; i++) {
    const radius = ((i + 1) / numRings) * Math.min(width, height) / 2 * normalizedAvg;
    const alpha = 1 - (i / numRings);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = i % 2 === 0 
      ? theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0')
      : theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  
  const centerRadius = normalizedAvg * 50;
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius);
  gradient.addColorStop(0, theme.primary);
  gradient.addColorStop(1, theme.secondary + '00');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
  ctx.fill();
}

export function drawFrequencyRings(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  
  const bass = dataArray.slice(0, Math.floor(bufferLength / 3));
  const mid = dataArray.slice(Math.floor(bufferLength / 3), Math.floor(2 * bufferLength / 3));
  const treble = dataArray.slice(Math.floor(2 * bufferLength / 3));
  
  const getAverage = (arr: Uint8Array) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum / arr.length;
  };
  
  const bassAvg = (getAverage(bass) / 255) * sensitivity;
  const midAvg = (getAverage(mid) / 255) * sensitivity;
  const trebleAvg = (getAverage(treble) / 255) * sensitivity;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 0.8 * bassAvg, 0, 2 * Math.PI);
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 20;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 0.5 * midAvg, 0, 2 * Math.PI);
  ctx.strokeStyle = theme.secondary;
  ctx.lineWidth = 15;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 0.25 * trebleAvg, 0, 2 * Math.PI);
  ctx.strokeStyle = theme.highlight;
  ctx.lineWidth = 10;
  ctx.stroke();
}

export function drawWaveCircles(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const numCircles = 20;
  const spacing = Math.min(width, height) / (numCircles * 2);
  
  for (let i = 0; i < numCircles; i++) {
    const index = Math.floor((i / numCircles) * bufferLength);
    const radius = spacing * (i + 1) + (dataArray[index] / 255) * 20 * sensitivity;
    const alpha = 1 - (i / numCircles);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = i % 2 === 0 
      ? theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0')
      : theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawRipples(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const sources = 4;
  const ripplesPerSource = 8;
  
  for (let src = 0; src < sources; src++) {
    const srcX = (width / (sources + 1)) * (src + 1);
    const srcY = height / 2;
    
    for (let i = 0; i < ripplesPerSource; i++) {
      const dataIndex = (src * ripplesPerSource + i) % bufferLength;
      const radius = (i + 1) * 40 + (dataArray[dataIndex] / 255) * 30 * sensitivity;
      const alpha = 1 - (i / ripplesPerSource);
      
      ctx.beginPath();
      ctx.arc(srcX, srcY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

