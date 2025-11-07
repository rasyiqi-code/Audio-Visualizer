import { Theme } from '../../types';

// Advanced and creative visualizations

export function drawNeonTunnel(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const numRings = 15;
  
  for (let i = 0; i < numRings; i++) {
    const dataIndex = Math.floor((i / numRings) * bufferLength);
    const scale = (i + 1) / numRings;
    const size = Math.min(width, height) * scale;
    const offset = (dataArray[dataIndex] / 255) * 50 * sensitivity;
    const actualSize = size + offset;
    
    const alpha = 0.3 - (scale * 0.2);
    ctx.strokeStyle = i % 2 === 0 
      ? theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0')
      : theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    
    ctx.lineWidth = 3 + scale * 5;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, actualSize * 0.8, actualSize * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawBinaryRain(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const columns = 20;
  const columnWidth = width / columns;
  
  for (let col = 0; col < columns; col++) {
    const dataIndex = Math.floor((col / columns) * bufferLength);
    const rainHeight = (dataArray[dataIndex] / 255) * height * sensitivity;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, rainHeight);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(1, theme.primary + '00');
    
    ctx.fillStyle = gradient;
    ctx.font = '12px monospace';
    
    const chars = Math.floor(rainHeight / 15);
    for (let i = 0; i < chars; i++) {
      const binary = Math.random() > 0.5 ? '1' : '0';
      const x = col * columnWidth + columnWidth / 2;
      const y = i * 15;
      
      ctx.fillStyle = theme.primary + Math.floor((1 - i / chars) * 255).toString(16).padStart(2, '0');
      ctx.fillText(binary, x, y);
    }
  }
}

export function drawPolygonMorph(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) / 3;
  const sides = 8;
  
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const dataIndex = Math.floor((i / sides) * bufferLength);
    const offset = (dataArray[dataIndex] / 255) * 100 * sensitivity;
    const radius = baseRadius + offset;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius);
  gradient.addColorStop(0, theme.primary + '60');
  gradient.addColorStop(1, theme.secondary + '00');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = theme.highlight;
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function drawSpectrumWaterfall(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barWidth = width / bufferLength;
  
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * height * sensitivity;
    const hue = (i / bufferLength) * 360;
    
    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(0.5, theme.secondary);
    gradient.addColorStop(1, theme.background);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    
    // Top glow
    ctx.fillStyle = theme.highlight + '80';
    ctx.fillRect(i * barWidth, height - barHeight, barWidth, 2);
  }
}

export function drawDoubleSided(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barWidth = (width / bufferLength) * 2.5;
  const centerY = height / 2;
  
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * (height / 2) * sensitivity;
    const x = i * barWidth;
    
    // Top bars
    const gradientTop = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY);
    gradientTop.addColorStop(0, theme.primary);
    gradientTop.addColorStop(1, theme.secondary);
    ctx.fillStyle = gradientTop;
    ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
    
    // Bottom bars (inverted colors)
    const gradientBottom = ctx.createLinearGradient(0, centerY, 0, centerY + barHeight);
    gradientBottom.addColorStop(0, theme.secondary);
    gradientBottom.addColorStop(1, theme.primary);
    ctx.fillStyle = gradientBottom;
    ctx.fillRect(x, centerY, barWidth - 1, barHeight);
  }
}

export function drawCrystalFormation(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const crystals = 12;
  
  for (let i = 0; i < crystals; i++) {
    const angle = (i / crystals) * Math.PI * 2;
    const dataIndex = Math.floor((i / crystals) * bufferLength);
    const length = (dataArray[dataIndex] / 255) * Math.min(width, height) / 3 * sensitivity;
    
    // Draw crystal shard
    ctx.beginPath();
    const x1 = centerX + Math.cos(angle - 0.15) * length * 0.3;
    const y1 = centerY + Math.sin(angle - 0.15) * length * 0.3;
    const x2 = centerX + Math.cos(angle) * length;
    const y2 = centerY + Math.sin(angle) * length;
    const x3 = centerX + Math.cos(angle + 0.15) * length * 0.3;
    const y3 = centerY + Math.sin(angle + 0.15) * length * 0.3;
    
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(centerX, centerY, x2, y2);
    gradient.addColorStop(0, theme.highlight + '80');
    gradient.addColorStop(0.5, theme.primary + '60');
    gradient.addColorStop(1, theme.secondary + '40');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = theme.highlight + '40';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export function drawSineWaves(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const numWaves = 5;
  
  for (let wave = 0; wave < numWaves; wave++) {
    ctx.beginPath();
    const yOffset = (height / (numWaves + 1)) * (wave + 1);
    const amplitude = 50 + (wave * 20);
    
    for (let x = 0; x <= width; x += 2) {
      const dataIndex = Math.floor((x / width) * bufferLength);
      const dataValue = (dataArray[dataIndex] / 255) * sensitivity;
      const frequency = 0.01 + wave * 0.005;
      const y = yOffset + Math.sin(x * frequency) * amplitude * dataValue;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = wave % 2 === 0 ? theme.primary : theme.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawRadarScan(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  
  // Draw radar circles
  for (let i = 0; i < 5; i++) {
    const radius = (maxRadius / 5) * (i + 1);
    ctx.strokeStyle = theme.primary + '40';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw data points
  for (let i = 0; i < bufferLength; i++) {
    const angle = (i / bufferLength) * Math.PI * 2;
    const distance = (dataArray[i] / 255) * maxRadius * sensitivity;
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    const size = (dataArray[i] / 255) * 4 * sensitivity;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, theme.secondary);
    gradient.addColorStop(1, theme.secondary + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawEnergyField(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate average energy
  let totalEnergy = 0;
  for (let i = 0; i < bufferLength; i++) {
    totalEnergy += dataArray[i];
  }
  const avgEnergy = (totalEnergy / bufferLength / 255) * sensitivity;
  
  // Draw energy field
  const numRings = 10;
  for (let i = 0; i < numRings; i++) {
    const radius = (i + 1) * (Math.min(width, height) / (numRings + 1)) * avgEnergy;
    const alpha = (1 - i / numRings) * 0.4;
    
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    gradient.addColorStop(0, theme.primary + '00');
    gradient.addColorStop(1, theme.secondary + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Center bright spot
  const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50 * avgEnergy);
  centerGradient.addColorStop(0, theme.highlight);
  centerGradient.addColorStop(1, theme.primary + '00');
  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 50 * avgEnergy, 0, Math.PI * 2);
  ctx.fill();
}

export function drawHexagonGrid(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const hexSize = 40;
  const cols = Math.ceil(width / (hexSize * 1.5)) + 1;
  const rows = Math.ceil(height / (hexSize * Math.sqrt(3))) + 1;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5;
      const y = row * hexSize * Math.sqrt(3) + (col % 2) * hexSize * Math.sqrt(3) / 2;
      
      const cellIndex = row * cols + col;
      const dataIndex = Math.floor((cellIndex / (cols * rows)) * bufferLength);
      const intensity = (dataArray[dataIndex] / 255) * sensitivity;
      
      // Draw hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + hexSize * Math.cos(angle);
        const hy = y + hexSize * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      
      const alpha = intensity * 0.6;
      ctx.fillStyle = theme.primary + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
      
      ctx.strokeStyle = theme.secondary + '40';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

export function drawLissajous(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;
  
  ctx.beginPath();
  for (let i = 0; i < bufferLength; i++) {
    const t = (i / bufferLength) * Math.PI * 2;
    const amplitude = (dataArray[i] / 255) * sensitivity;
    
    // Lissajous curve parameters
    const a = 3;
    const b = 4;
    const x = centerX + Math.sin(a * t) * maxRadius * amplitude;
    const y = centerY + Math.sin(b * t) * maxRadius * amplitude;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  const gradient = ctx.createLinearGradient(centerX - maxRadius, centerY, centerX + maxRadius, centerY);
  gradient.addColorStop(0, theme.primary);
  gradient.addColorStop(0.5, theme.secondary);
  gradient.addColorStop(1, theme.primary);
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = theme.primary;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function drawBarcode(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const barWidth = width / bufferLength;
  
  for (let i = 0; i < bufferLength; i++) {
    const intensity = (dataArray[i] / 255) * sensitivity;
    const x = i * barWidth;
    
    // Alternating colors for barcode effect
    const color = intensity > 0.3 
      ? (i % 2 === 0 ? theme.primary : theme.secondary)
      : theme.background;
    
    ctx.fillStyle = color;
    ctx.fillRect(x, 0, barWidth, height);
    
    // Add scanline effect
    if (intensity > 0.5) {
      ctx.fillStyle = theme.highlight + '40';
      ctx.fillRect(x, height / 2 - 2, barWidth, 4);
    }
  }
}

export function drawConstellations(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const stars = Math.min(bufferLength, 80);
  const positions: Array<{x: number, y: number}> = [];
  
  // Draw stars
  for (let i = 0; i < stars; i++) {
    const x = (i / stars) * width + (Math.random() - 0.5) * 50;
    const y = height * 0.2 + Math.random() * height * 0.6;
    const size = (dataArray[i] / 255) * 6 * sensitivity;
    
    positions.push({x, y});
    
    // Star glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(0.5, theme.secondary + '80');
    gradient.addColorStop(1, theme.secondary + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Star point
    ctx.fillStyle = theme.highlight;
    ctx.beginPath();
    ctx.arc(x, y, size / 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw connections
  ctx.strokeStyle = theme.primary + '20';
  ctx.lineWidth = 1;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = Math.hypot(positions[i].x - positions[j].x, positions[i].y - positions[j].y);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[j].x, positions[j].y);
        ctx.stroke();
      }
    }
  }
}

export function drawCircuitBoard(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const gridSize = 60;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize;
      const y = row * gridSize;
      const cellIndex = row * cols + col;
      const dataIndex = Math.floor((cellIndex / (cols * rows)) * bufferLength);
      const intensity = (dataArray[dataIndex] / 255) * sensitivity;
      
      if (intensity > 0.3) {
        // Draw circuit node
        ctx.fillStyle = theme.primary + Math.floor(intensity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x + gridSize / 2, y + gridSize / 2, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        ctx.strokeStyle = theme.secondary + Math.floor(intensity * 200).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        
        if (col < cols - 1 && Math.random() > 0.5) {
          ctx.beginPath();
          ctx.moveTo(x + gridSize / 2, y + gridSize / 2);
          ctx.lineTo(x + gridSize * 1.5, y + gridSize / 2);
          ctx.stroke();
        }
        
        if (row < rows - 1 && Math.random() > 0.5) {
          ctx.beginPath();
          ctx.moveTo(x + gridSize / 2, y + gridSize / 2);
          ctx.lineTo(x + gridSize / 2, y + gridSize * 1.5);
          ctx.stroke();
        }
      }
    }
  }
}

export function drawPulseBeam(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number, width: number, height: number, theme: Theme, sensitivity: number) {
  const numBeams = 8;
  const centerY = height / 2;
  
  for (let i = 0; i < numBeams; i++) {
    const dataIndex = Math.floor((i / numBeams) * bufferLength);
    const beamHeight = (dataArray[dataIndex] / 255) * (height / 2) * sensitivity;
    const beamWidth = width / numBeams;
    const x = i * beamWidth;
    
    // Draw beam with gradient
    const gradient = ctx.createLinearGradient(x, centerY - beamHeight, x, centerY + beamHeight);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(0.5, theme.highlight);
    gradient.addColorStop(1, theme.secondary);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, centerY - beamHeight, beamWidth - 4, beamHeight * 2);
    
    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = theme.primary;
    ctx.fillRect(x + 2, centerY - beamHeight, beamWidth - 4, beamHeight * 2);
    ctx.shadowBlur = 0;
  }
}

