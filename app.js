const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration
const config = {
    horizonY: 0.5, // Horizon line at mid-height (50% from top) - matches image
    vanishingPointX: 0.5, // Vanishing point X (center)
    gridSpacing: 90, // Base spacing between grid lines
    speed: 1.5, // Movement speed
    gridDepth: 100, // Number of grid rows (enough for seamless cycle)
    isPlaying: true,
    blockDensity: 0.5 // Checkerboard pattern - 50% of alternating cells
};

// Blocks with terms and colors matching the image exactly
// Medium Purple, Vibrant Teal, Light Blue
const blocks = [
    { term: 'DATA ENGINEERING', color: '#9B59B6' }, // Medium Purple
    { term: 'DATA', color: '#1ABC9C' }, // Vibrant Teal
    { term: 'DATA SCIENTIST', color: '#5DADE2' }, // Light Blue
    { term: 'MACHINE LEARNING', color: '#9B59B6' }, // Medium Purple
    { term: 'BIG DATA', color: '#1ABC9C' }, // Vibrant Teal
    { term: 'FEATURE ENGINEERING', color: '#5DADE2' }, // Light Blue
    { term: 'MLOPS', color: '#9B59B6' }, // Medium Purple
    { term: 'CLOUD', color: '#1ABC9C' }, // Vibrant Teal
    { term: 'ETL', color: '#5DADE2' }, // Light Blue
    { term: 'ELT', color: '#9B59B6' }, // Medium Purple
    { term: 'DATA QUALITY', color: '#1ABC9C' }, // Vibrant Teal
    { term: 'MODEL TRAINING', color: '#5DADE2' }, // Light Blue
    { term: 'DATA PIPELINES', color: '#9B59B6' }, // Medium Purple
    { term: 'PYTHON', color: '#1ABC9C' }, // Vibrant Teal
    { term: 'SQL', color: '#5DADE2' }, // Light Blue
    { term: 'BIG', color: '#9B59B6' }, // Medium Purple
    { term: 'DATA ANALYST', color: '#1ABC9C' } // Vibrant Teal
];

// Grid state
let gridOffset = 0;

// Draw one-point perspective grid
function drawGrid() {
    const horizonY = canvas.height * config.horizonY;
    const vpX = canvas.width * config.vanishingPointX;
    const vpY = horizonY;
    
    // Draw grid lines first (white lines on white background - subtle)
    for (let i = 0; i < config.gridDepth; i++) {
        const depth = i + gridOffset;
        const y = vpY + depth * config.gridSpacing;
        
        if (y < vpY - 50 || y > canvas.height + 150) continue;
        
        const distanceFromHorizon = y - vpY;
        const scale = Math.max(0.02, Math.abs(distanceFromHorizon) / (canvas.height * 0.6));
        const width = canvas.width * scale;
        const cellSize = config.gridSpacing * scale;
        const numCells = Math.ceil(width / cellSize);
        
        // Draw horizontal grid line (very subtle grey lines on white background)
        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(vpX - width / 2, y);
        ctx.lineTo(vpX + width / 2, y);
        ctx.stroke();
        
        // Draw vertical grid lines converging to vanishing point
        for (let cell = -Math.floor(numCells / 2); cell <= Math.floor(numCells / 2); cell++) {
            const x = vpX + cell * cellSize;
            ctx.strokeStyle = '#E8E8E8';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(vpX, vpY);
            ctx.stroke();
        }
    }
    
    // Draw filled blocks with checkerboard pattern
    for (let i = 1; i < config.gridDepth; i++) {
        const depth = i + gridOffset;
        const y = vpY + depth * config.gridSpacing;
        const prevY = vpY + (depth - 1) * config.gridSpacing;
        
        if (y < vpY - 50 || y > canvas.height + 150) continue;
        if (prevY < vpY - 50) continue;
        
        const distanceFromHorizon = y - vpY;
        const prevDistance = prevY - vpY;
        const scale = Math.max(0.02, Math.abs(distanceFromHorizon) / (canvas.height * 0.6));
        const prevScale = Math.max(0.02, Math.abs(prevDistance) / (canvas.height * 0.6));
        
        const cellSize = config.gridSpacing * scale;
        const prevCellSize = config.gridSpacing * prevScale;
        const width = canvas.width * scale;
        const numCells = Math.ceil(width / cellSize);
        
        for (let cell = -Math.floor(numCells / 2); cell < Math.floor(numCells / 2); cell++) {
            // Checkerboard pattern - alternating cells
            const isEven = (i + cell) % 2 === 0;
            
            // Only fill checkerboard pattern cells (every other cell)
            if (!isEven) continue;
            
            // Calculate cell corners with perspective
            const topLeftX = vpX + cell * prevCellSize;
            const topRightX = vpX + (cell + 1) * prevCellSize;
            const bottomLeftX = vpX + cell * cellSize;
            const bottomRightX = vpX + (cell + 1) * cellSize;
            
            // Get block data (deterministic based on position)
            const blockIndex = Math.abs((i * 13 + cell * 7) % blocks.length);
            const block = blocks[blockIndex];
            
            // Some squares towards the back should appear white/light grey
            // Based on distance from horizon (further back = more likely to be white)
            const distanceRatio = Math.abs(distanceFromHorizon) / (canvas.height * 0.8);
            // Deterministic white squares based on position (no flickering)
            const whiteSeed = (i * 17 + cell * 11) % 100;
            const shouldBeWhite = distanceRatio > 0.6 && whiteSeed < 30; // 30% of distant cells
            
            // Draw filled block
            if (shouldBeWhite) {
                // White/light grey squares for distant cells
                ctx.fillStyle = scale < 0.1 ? '#F5F5F5' : '#FFFFFF';
            } else {
                // Colored blocks
                ctx.fillStyle = block.color;
            }
            
            ctx.beginPath();
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(topRightX, prevY);
            ctx.lineTo(bottomRightX, y);
            ctx.lineTo(bottomLeftX, y);
            ctx.closePath();
            ctx.fill();
            
            // Skip text for white squares
            if (shouldBeWhite) continue;
            
            // Draw white grid lines on top of colored blocks (distinct borders)
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(topRightX, prevY);
            ctx.lineTo(bottomRightX, y);
            ctx.lineTo(bottomLeftX, y);
            ctx.closePath();
            ctx.stroke();
            
            // Draw term text on blocks (show text on visible blocks)
            if (scale > 0.05) {
                const centerX = (topLeftX + topRightX + bottomLeftX + bottomRightX) / 4;
                const centerY = (prevY + y) / 2;
                
                // Calculate available space
                const cellWidth = Math.abs(topRightX - topLeftX);
                const cellHeight = Math.abs(y - prevY);
                const minDimension = Math.min(cellWidth, cellHeight);
                
                // Calculate font size that fits (scaled with perspective)
                let fontSize = Math.max(6, Math.min(scale * 30, minDimension * 0.4));
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Measure text to ensure it fits
                const words = block.term.split(' ');
                let needsSplit = false;
                
                // Check if text fits on one line
                ctx.save();
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                const metrics = ctx.measureText(block.term);
                if (metrics.width > cellWidth * 0.85) {
                    needsSplit = true;
                    // Try smaller font or split
                    if (words.length > 1) {
                        fontSize = Math.max(8, fontSize * 0.75);
                    }
                }
                ctx.restore();
                
                // Render text with better visibility
                if (needsSplit && words.length > 1) {
                    // Split into two lines
                    const midPoint = Math.ceil(words.length / 2);
                    const line1 = words.slice(0, midPoint).join(' ');
                    const line2 = words.slice(midPoint).join(' ');
                    
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    const lineHeight = fontSize * 1.3;
                    const totalHeight = lineHeight * 2;
                    
                    // Check if two lines fit
                    if (totalHeight <= cellHeight * 0.75) {
                        ctx.fillText(line1, centerX, centerY - lineHeight / 2);
                        ctx.fillText(line2, centerX, centerY + lineHeight / 2);
                    } else {
                        // Use single line with smaller font
                        fontSize = Math.max(8, cellHeight * 0.28);
                        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                        ctx.fillText(block.term, centerX, centerY);
                    }
                } else {
                    // Single line - ensure text is visible
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    // Add text shadow for better readability
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    ctx.shadowBlur = 2;
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.fillText(block.term, centerX, centerY);
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
            }
        }
    }
}

// Animation loop
function animate() {
    if (config.isPlaying) {
        // Clear canvas with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update grid offset for movement away from viewer (toward top)
        // Increasing offset makes cells move up (away from viewer toward top)
        gridOffset += config.speed * 0.01;
        
        // Seamless cycle - when one cycle completes, reset smoothly
        if (gridOffset >= 1) {
            gridOffset = 0;
        }
        
        // Draw the grid
        drawGrid();
    }
    
    requestAnimationFrame(animate);
}

animate();

// Controls
document.getElementById('playPause').addEventListener('click', () => {
    config.isPlaying = !config.isPlaying;
    document.getElementById('playPause').textContent = config.isPlaying ? 'Pause' : 'Play';
});

document.getElementById('reset').addEventListener('click', () => {
    gridOffset = 0;
    config.isPlaying = true;
    document.getElementById('playPause').textContent = 'Pause';
});

