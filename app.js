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
    horizonY: 0.3, // Horizon line position (30% from top) - starting point
    vanishingPointX: 0.5, // Vanishing point X (center)
    gridSpacing: 80, // Base spacing between grid lines
    speed: 0.5, // Movement speed (slower)
    gridDepth: 60, // Number of grid rows (enough for seamless cycle)
    isPlaying: true,
    blockDensity: 0.5 // Checkerboard pattern - 50% of alternating cells
};

// Blocks with terms and mixed colors
const blocks = [
    { term: 'DATA ENGINEERING', color: '#9370DB' }, // Purple
    { term: 'DATA ANALYST', color: '#00CED1' }, // Teal/Cyan
    { term: 'DATA SCIENTIST', color: '#4169E1' }, // Blue
    { term: 'MACHINE LEARNING', color: '#9370DB' }, // Purple
    { term: 'BIG DATA', color: '#00CED1' }, // Teal/Cyan
    { term: 'FEATURE ENGINEERING', color: '#4169E1' }, // Blue
    { term: 'MLOPS', color: '#9370DB' }, // Purple
    { term: 'CLOUD DATA', color: '#00CED1' }, // Teal/Cyan
    { term: 'ETL', color: '#4169E1' }, // Blue
    { term: 'ELT', color: '#9370DB' }, // Purple
    { term: 'DATA QUALITY', color: '#00CED1' }, // Teal/Cyan
    { term: 'MODEL TRAINING', color: '#4169E1' }, // Blue
    { term: 'DATA PIPELINES', color: '#9370DB' }, // Purple
    { term: 'PYTHON', color: '#00CED1' }, // Teal/Cyan
    { term: 'SQL', color: '#4169E1' } // Blue
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
        
        if (y < vpY - 30 || y > canvas.height + 100) continue;
        
        const distanceFromHorizon = y - vpY;
        const scale = Math.max(0.02, Math.abs(distanceFromHorizon) / (canvas.height * 0.6));
        const width = canvas.width * scale;
        const cellSize = config.gridSpacing * scale;
        const numCells = Math.ceil(width / cellSize);
        
        // Draw horizontal grid line (white/grey for visibility)
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(vpX - width / 2, y);
        ctx.lineTo(vpX + width / 2, y);
        ctx.stroke();
        
        // Draw vertical grid lines converging to vanishing point
        for (let cell = -Math.floor(numCells / 2); cell <= Math.floor(numCells / 2); cell++) {
            const x = vpX + cell * cellSize;
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
        
        if (y < vpY - 30 || y > canvas.height + 100) continue;
        if (prevY < vpY - 30) continue;
        
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
            
            // Draw filled block (solid color, no gradient)
            ctx.fillStyle = block.color;
            ctx.beginPath();
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(topRightX, prevY);
            ctx.lineTo(bottomRightX, y);
            ctx.lineTo(bottomLeftX, y);
            ctx.closePath();
            ctx.fill();
            
            // Draw white grid lines on top of block
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(topRightX, prevY);
            ctx.moveTo(topRightX, prevY);
            ctx.lineTo(bottomRightX, y);
            ctx.moveTo(bottomLeftX, y);
            ctx.lineTo(bottomRightX, y);
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(bottomLeftX, y);
            ctx.stroke();
            
            // Draw term text on blocks (only if large enough)
            if (scale > 0.08) {
                const centerX = (topLeftX + topRightX + bottomLeftX + bottomRightX) / 4;
                const centerY = (prevY + y) / 2;
                
                // Calculate available space
                const cellWidth = Math.abs(topRightX - topLeftX);
                const cellHeight = Math.abs(y - prevY);
                const minDimension = Math.min(cellWidth, cellHeight);
                
                // Calculate font size that fits
                let fontSize = Math.max(6, Math.min(scale * 22, minDimension * 0.3));
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Measure text to ensure it fits
                const words = block.term.split(' ');
                let needsSplit = false;
                
                // Check if text fits on one line
                ctx.save();
                ctx.font = `bold ${fontSize}px Arial`;
                const metrics = ctx.measureText(block.term);
                if (metrics.width > cellWidth * 0.9) {
                    needsSplit = true;
                    // Try smaller font or split
                    if (words.length > 1) {
                        fontSize = Math.max(6, fontSize * 0.7);
                    }
                }
                ctx.restore();
                
                // Render text
                if (needsSplit && words.length > 1) {
                    // Split into two lines
                    const midPoint = Math.ceil(words.length / 2);
                    const line1 = words.slice(0, midPoint).join(' ');
                    const line2 = words.slice(midPoint).join(' ');
                    
                    ctx.font = `bold ${fontSize}px Arial`;
                    const lineHeight = fontSize * 1.2;
                    const totalHeight = lineHeight * 2;
                    
                    // Check if two lines fit
                    if (totalHeight <= cellHeight * 0.8) {
                        ctx.fillText(line1, centerX, centerY - lineHeight / 2);
                        ctx.fillText(line2, centerX, centerY + lineHeight / 2);
                    } else {
                        // Use single line with smaller font
                        fontSize = Math.max(6, cellHeight * 0.25);
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillText(block.term, centerX, centerY);
                    }
                } else {
                    // Single line
                    ctx.font = `bold ${fontSize}px Arial`;
                    ctx.fillText(block.term, centerX, centerY);
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

