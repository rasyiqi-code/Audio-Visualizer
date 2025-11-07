import { Theme } from '../../types';

// Particle-based visualizations

export function drawParticleField(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const particleCount = Math.min(bufferLength, 100);
  const cols = 10;
  const rows = Math.ceil(particleCount / cols);
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  
  for (let i = 0; i < particleCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;
    
    const size = ((dataArray[i] / 255) * 30) * sensitivity;
    const alpha = (dataArray[i] / 255) * 0.8;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, theme.secondary + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function drawStarfield(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const particleCount = Math.min(bufferLength, 150);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * 2 * Math.PI;
    const distance = ((dataArray[i] / 255) * Math.min(width, height) / 2) * sensitivity;
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const size = (dataArray[i] / 255) * 4 * sensitivity;
    
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = theme.secondary + '40';
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function drawFireworks(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const numBursts = 5;
  const particlesPerBurst = Math.floor(bufferLength / numBursts);
  
  for (let burst = 0; burst < numBursts; burst++) {
    const burstX = (width / (numBursts + 1)) * (burst + 1);
    const burstY = height / 3;
    
    for (let i = 0; i < particlesPerBurst; i++) {
      const dataIndex = burst * particlesPerBurst + i;
      if (dataIndex >= bufferLength) break;
      
      const angle = (i / particlesPerBurst) * 2 * Math.PI;
      const distance = (dataArray[dataIndex] / 255) * 150 * sensitivity;
      
      const x = burstX + Math.cos(angle) * distance;
      const y = burstY + Math.sin(angle) * distance;
      const size = (dataArray[dataIndex] / 255) * 3 * sensitivity;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, theme.primary);
      gradient.addColorStop(1, theme.secondary + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

export function drawBubbles(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const bubbleCount = Math.min(bufferLength, 80);
  const cols = 8;
  const rows = Math.ceil(bubbleCount / cols);
  
  for (let i = 0; i < bubbleCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const x = (col + 0.5) * (width / cols);
    const y = (row + 0.5) * (height / rows);
    const radius = ((dataArray[i] / 255) * 40) * sensitivity;
    
    const gradient = ctx.createRadialGradient(
      x - radius / 3, y - radius / 3, 0,
      x, y, radius
    );
    gradient.addColorStop(0, theme.highlight + '60');
    gradient.addColorStop(0.5, theme.primary + '40');
    gradient.addColorStop(1, theme.secondary + '20');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = theme.primary + '80';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export function drawPulseGrid(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const cols = 16;
  const rows = 9;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const totalCells = cols * rows;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellIndex = row * cols + col;
      const dataIndex = Math.floor((cellIndex / totalCells) * bufferLength);
      
      const x = col * cellWidth;
      const y = row * cellHeight;
      const intensity = (dataArray[dataIndex] / 255) * sensitivity;
      
      const gradient = ctx.createRadialGradient(
        x + cellWidth / 2, y + cellHeight / 2, 0,
        x + cellWidth / 2, y + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2
      );
      
      gradient.addColorStop(0, theme.primary + Math.floor(intensity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, theme.secondary + '00');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, cellWidth, cellHeight);
    }
  }
}

