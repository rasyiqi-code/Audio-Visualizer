import { Theme } from '../../types';

// Basic visualizations - Bars, Waveform, Mirror, etc.

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

export function drawMirrorBars(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barWidth = (width / bufferLength) * 2.5;
  let x = 0;
  const gradient = ctx.createLinearGradient(0, height / 2, 0, 0);
  gradient.addColorStop(0, theme.secondary);
  gradient.addColorStop(1, theme.primary);
  ctx.fillStyle = gradient;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = ((dataArray[i] / 255) * (height / 2)) * sensitivity;
    ctx.fillRect(x, height / 2 - barHeight, barWidth, barHeight);
    ctx.fillRect(x, height / 2, barWidth, barHeight);
    x += barWidth + 1;
  }
}

export function drawEqualizer(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barCount = 64;
  const barWidth = width / barCount;
  const step = Math.floor(bufferLength / barCount);
  
  for (let i = 0; i < barCount; i++) {
    const dataIndex = i * step;
    const barHeight = (dataArray[dataIndex] / 255) * height * sensitivity;
    const x = i * barWidth;
    
    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
    gradient.addColorStop(0, theme.secondary);
    gradient.addColorStop(0.5, theme.primary);
    gradient.addColorStop(1, theme.highlight);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
    
    const peakY = height - barHeight - 3;
    ctx.fillStyle = theme.highlight;
    ctx.fillRect(x, peakY, barWidth - 2, 2);
  }
}

export function drawOscilloscope(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  ctx.strokeStyle = theme.highlight + '20';
  ctx.lineWidth = 1;
  
  for (let i = 0; i <= 10; i++) {
    const y = (height / 10) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  for (let i = 0; i <= 10; i++) {
    const x = (width / 10) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  ctx.shadowBlur = 15;
  ctx.shadowColor = theme.primary;
  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.primary;
  ctx.beginPath();
  
  const sliceWidth = (width * 1.0) / bufferLength;
  let x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    const amplitude = (dataArray[i] - 128) * sensitivity;
    const y = height / 2 + amplitude;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function drawWaveformBars(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barCount = Math.min(bufferLength, 128);
  const barWidth = (width / barCount) * 0.8;
  const centerY = height / 2;
  
  for (let i = 0; i < barCount; i++) {
    const x = (i / barCount) * width;
    const amplitude = (dataArray[i] - 128) * sensitivity;
    const barHeight = Math.abs(amplitude);
    
    const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(0.5, theme.highlight);
    gradient.addColorStop(1, theme.secondary);
    
    ctx.fillStyle = gradient;
    
    if (amplitude > 0) {
      ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);
    } else {
      ctx.fillRect(x, centerY, barWidth, barHeight);
    }
  }
}

export function drawSpectralBands(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const bands = 16;
  const bandHeight = height / bands;
  const samplesPerBand = Math.floor(bufferLength / bands);
  
  for (let i = 0; i < bands; i++) {
    let sum = 0;
    for (let j = 0; j < samplesPerBand; j++) {
      const index = i * samplesPerBand + j;
      if (index < bufferLength) sum += dataArray[index];
    }
    const average = sum / samplesPerBand;
    const bandWidth = (average / 255) * width * sensitivity;
    
    const y = i * bandHeight;
    const gradient = ctx.createLinearGradient(0, 0, bandWidth, 0);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(1, theme.secondary);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, bandWidth, bandHeight - 2);
  }
}

export function drawPyramid(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const rows = 12;
  const barsPerRow = Math.floor(bufferLength / rows);
  
  for (let row = 0; row < rows; row++) {
    const rowY = height - (row + 1) * (height / rows);
    const rowWidth = width * ((row + 1) / rows);
    const startX = (width - rowWidth) / 2;
    const barWidth = rowWidth / barsPerRow;
    
    for (let bar = 0; bar < barsPerRow; bar++) {
      const dataIndex = row * barsPerRow + bar;
      if (dataIndex >= bufferLength) break;
      
      const barHeight = (dataArray[dataIndex] / 255) * (height / rows) * sensitivity;
      const x = startX + bar * barWidth;
      
      const gradient = ctx.createLinearGradient(0, rowY, 0, rowY - barHeight);
      gradient.addColorStop(0, theme.secondary);
      gradient.addColorStop(1, theme.primary);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, rowY - barHeight, barWidth - 2, barHeight);
    }
  }
}

