const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration - matching the image
const config = {
    horizonY: 0.5, // Horizon line at mid-height (50% from top) - vanishing point
    vanishingPointX: 0.5, // Vanishing point X (center)
    gridSpacing: 120, // Base spacing between grid lines
    speed: 1.5, // Movement speed
    gridDepth: 100, // Number of grid rows
    isPlaying: true
};

// Blocks with terms matching the image exactly - Medium Purple, Vibrant Teal, Light Blue
const blocks = [
    { term: 'ETL', color: '#87CEEB' }, // Light Blue
    { term: 'DATA', color: '#00CED1' }, // Vibrant Teal
    { term: 'DATA ENGINEER', color: '#9370DB' }, // Medium Purple
    { term: 'BIG', color: '#87CEEB' }, // Light Blue
    { term: 'SQL', color: '#00CED1' }, // Vibrant Teal
    { term: 'CLOUD', color: '#9370DB' }, // Medium Purple
    { term: 'MACHINE LEARNING', color: '#87CEEB' }, // Light Blue
    { term: 'MODEL TRAINING', color: '#00CED1' }, // Vibrant Teal
    { term: 'DATA QUALITY', color: '#9370DB' }, // Medium Purple
    { term: 'PYTHON', color: '#87CEEB' }, // Light Blue
    { term: 'DATA ENGINEERING', color: '#00CED1' }, // Vibrant Teal
    { term: 'DATA ANALYST', color: '#9370DB' }, // Medium Purple
    { term: 'DATA SCIENTIST', color: '#87CEEB' }, // Light Blue
    { term: 'BIG DATA', color: '#00CED1' }, // Vibrant Teal
    { term: 'MLOPS', color: '#9370DB' } // Medium Purple
];

// Grid state
let gridOffset = 0;

// Draw one-point perspective grid matching the image
function drawGrid() {
    const horizonY = canvas.height * config.horizonY;
    const vpX = canvas.width * config.vanishingPointX;
    const vpY = horizonY;
    
    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines first - very thin, subtle on white background
    for (let i = 0; i < config.gridDepth; i++) {
        const depth = i + gridOffset;
        // Grid starts larger at bottom (foreground) and converges upward
        const y = vpY + depth * config.gridSpacing;
        
        if (y < vpY - 50 || y > canvas.height + 200) continue;
        
        const distanceFromHorizon = y - vpY;
        // Scale increases as we go down (away from horizon)
        const scale = Math.max(0.01, Math.abs(distanceFromHorizon) / (canvas.height * 0.8));
        const width = canvas.width * scale;
        const cellSize = config.gridSpacing * scale;
        const numCells = Math.ceil(width / cellSize);
        
        // Draw horizontal grid line - very thin, subtle grey
        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 0.5;
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
        
        if (y < vpY - 50 || y > canvas.height + 200) continue;
        if (prevY < vpY - 50) continue;
        
        const distanceFromHorizon = y - vpY;
        const prevDistance = prevY - vpY;
        const scale = Math.max(0.01, Math.abs(distanceFromHorizon) / (canvas.height * 0.8));
        const prevScale = Math.max(0.01, Math.abs(prevDistance) / (canvas.height * 0.8));
        
        const cellSize = config.gridSpacing * scale;
        const prevCellSize = config.gridSpacing * prevScale;
        const width = canvas.width * scale;
        const numCells = Math.ceil(width / cellSize);
        
        for (let cell = -Math.floor(numCells / 2); cell < Math.floor(numCells / 2); cell++) {
            // Proper checkerboard pattern - alternating colored and white squares
            const rowIndex = Math.floor(i);
            const colIndex = Math.floor(cell + Math.floor(numCells / 2));
            const isColored = (rowIndex + colIndex) % 2 === 0;
            
            // Only draw colored blocks (white squares are just the background)
            if (!isColored) continue;
            
            // Calculate cell corners with perspective
            const topLeftX = vpX + cell * prevCellSize;
            const topRightX = vpX + (cell + 1) * prevCellSize;
            const bottomLeftX = vpX + cell * cellSize;
            const bottomRightX = vpX + (cell + 1) * cellSize;
            
            // Get block data (deterministic based on position)
            const blockIndex = Math.abs((i * 17 + cell * 11) % blocks.length);
            const block = blocks[blockIndex];
            
            // Draw filled block with color
            ctx.fillStyle = block.color;
            ctx.beginPath();
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(topRightX, prevY);
            ctx.lineTo(bottomRightX, y);
            ctx.lineTo(bottomLeftX, y);
            ctx.closePath();
            ctx.fill();
            
            // Draw white grid lines on top of colored block - more distinct borders
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
            
            // Draw term text on blocks - white, bold, centered
            if (scale > 0.06) {
                const centerX = (topLeftX + topRightX + bottomLeftX + bottomRightX) / 4;
                const centerY = (prevY + y) / 2;
                
                // Calculate available space
                const cellWidth = Math.abs(topRightX - topLeftX);
                const cellHeight = Math.abs(y - prevY);
                const minDimension = Math.min(cellWidth, cellHeight);
                
                // Calculate font size that fits - scales with perspective
                let fontSize = Math.max(8, Math.min(scale * 35, minDimension * 0.35));
                
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
                if (metrics.width > cellWidth * 0.85) {
                    needsSplit = true;
                    if (words.length > 1) {
                        fontSize = Math.max(8, fontSize * 0.8);
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
                    const lineHeight = fontSize * 1.25;
                    const totalHeight = lineHeight * 2;
                    
                    // Check if two lines fit
                    if (totalHeight <= cellHeight * 0.75) {
                        ctx.fillText(line1, centerX, centerY - lineHeight / 2);
                        ctx.fillText(line2, centerX, centerY + lineHeight / 2);
                    } else {
                        // Use single line with smaller font
                        fontSize = Math.max(8, cellHeight * 0.28);
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
        // Update grid offset for movement toward viewer (from top to bottom)
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
