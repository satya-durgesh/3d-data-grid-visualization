const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration - matching exact specifications
const config = {
    gridAreaPercent: 0.55, // Grid occupies bottom 55% of canvas
    vanishingPointX: 0.5, // Vanishing point X (center)
    vanishingPointY: 0.0, // Vanishing point Y (top center)
    gridSpacing: 100, // Base spacing between grid lines
    speed: 1.5, // Movement speed
    gridDepth: 150, // Number of grid rows
    isPlaying: true
};

// Color palette - 4 colors: Teal, Purple, Blue, Green
const colors = [
    '#00CED1', // Vibrant Teal
    '#9370DB', // Medium Purple
    '#4169E1', // Royal Blue
    '#32CD32'  // Lime Green
];

// Data terms for tiles
const terms = [
    'DATA ENGINEERING',
    'MACHINE LEARNING',
    'PYTHON',
    'SQL',
    'DATA SCIENTIST',
    'BIG DATA',
    'ETL',
    'CLOUD',
    'FEATURE ENGINEERING',
    'MODEL TRAINING',
    'DATA QUALITY',
    'DATA ANALYST',
    'DATA PIPELINES',
    'MLOPS',
    'DATA WAREHOUSE'
];

// Grid state
let gridOffset = 0;

// Draw one-point perspective grid - matching exact specifications
function drawGrid() {
    const vpX = canvas.width * config.vanishingPointX;
    const vpY = canvas.height * config.vanishingPointY; // Top center
    
    // Calculate grid area - bottom 55% of canvas
    const gridStartY = canvas.height * (1 - config.gridAreaPercent); // Top of grid area
    const gridEndY = canvas.height; // Bottom of canvas
    const gridHeight = gridEndY - gridStartY;
    
    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background fade - bottom (strong) to top (white)
    const gradient = ctx.createLinearGradient(0, gridStartY, 0, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)'); // Top - transparent white
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)'); // Bottom - solid white
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, gridStartY);
    
    // Draw grid lines - light black/grey with opacity
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'; // #00000025 equivalent
    ctx.lineWidth = 0.5;
    
    // Draw horizontal grid lines converging to vanishing point
    for (let i = 0; i < config.gridDepth; i++) {
        const depth = i + gridOffset;
        // Calculate Y position - starts from bottom, converges to top
        const distanceFromBottom = depth * config.gridSpacing;
        const y = gridEndY - distanceFromBottom;
        
        // Only draw lines in grid area
        if (y < gridStartY - 100 || y > gridEndY + 100) continue;
        
        // Calculate scale based on distance from vanishing point
        const distanceFromVP = Math.abs(y - vpY);
        const maxDistance = gridHeight;
        const scale = Math.max(0.01, distanceFromVP / maxDistance);
        
        // Calculate width at this Y position
        const width = canvas.width * scale;
        const halfWidth = width / 2;
        
        // Draw horizontal line - full width at this perspective
        ctx.beginPath();
        ctx.moveTo(vpX - halfWidth, y);
        ctx.lineTo(vpX + halfWidth, y);
        ctx.stroke();
        
        // Draw vertical grid lines converging to vanishing point
        const cellSize = config.gridSpacing * scale;
        const numCells = Math.ceil(width / cellSize);
        
        for (let cell = -Math.floor(numCells / 2); cell <= Math.floor(numCells / 2); cell++) {
            const x = vpX + cell * cellSize;
            
            // Only draw if line would be visible
            if (x < -100 || x > canvas.width + 100) continue;
            
            ctx.beginPath();
            ctx.moveTo(x, Math.max(gridStartY, y));
            ctx.lineTo(vpX, vpY);
            ctx.stroke();
        }
    }
    
    // Draw tiles with strict checkerboard pattern
    for (let i = 1; i < config.gridDepth; i++) {
        const depth = i + gridOffset;
        const distanceFromBottom = depth * config.gridSpacing;
        const y = gridEndY - distanceFromBottom;
        const prevDistance = (depth - 1) * config.gridSpacing;
        const prevY = gridEndY - prevDistance;
        
        // Only draw tiles in grid area
        if (y < gridStartY - 100 || y > gridEndY + 100) continue;
        if (prevY < gridStartY - 100) continue;
        
        // Calculate scale for perspective
        const distanceFromVP = Math.abs(y - vpY);
        const prevDistanceFromVP = Math.abs(prevY - vpY);
        const maxDistance = gridHeight;
        const scale = Math.max(0.01, distanceFromVP / maxDistance);
        const prevScale = Math.max(0.01, prevDistanceFromVP / maxDistance);
        
        const cellSize = config.gridSpacing * scale;
        const prevCellSize = config.gridSpacing * prevScale;
        const width = canvas.width * scale;
        const numCells = Math.ceil(width / cellSize);
        
        for (let cell = -Math.floor(numCells / 2); cell < Math.floor(numCells / 2); cell++) {
            // Strict checkerboard pattern - alternating colored and white
            const rowIndex = Math.floor(i);
            const colIndex = Math.floor(cell + Math.floor(numCells / 2));
            const isColored = (rowIndex + colIndex) % 2 === 0;
            
            // Only draw colored tiles (white tiles are just background)
            if (!isColored) continue;
            
            // Calculate tile corners with perspective
            const topLeftX = vpX + cell * prevCellSize;
            const topRightX = vpX + (cell + 1) * prevCellSize;
            const bottomLeftX = vpX + cell * cellSize;
            const bottomRightX = vpX + (cell + 1) * cellSize;
            
            // Skip if tile is completely outside viewport
            const minX = Math.min(topLeftX, bottomLeftX, topRightX, bottomRightX);
            const maxX = Math.max(topLeftX, bottomLeftX, topRightX, bottomRightX);
            if (maxX < 0 || minX > canvas.width) continue;
            if (y < gridStartY || prevY > gridEndY) continue;
            
            // Get color and term (deterministic based on position)
            const colorIndex = Math.abs((i * 7 + cell * 11) % colors.length);
            const termIndex = Math.abs((i * 13 + cell * 17) % terms.length);
            const tileColor = colors[colorIndex];
            const term = terms[termIndex];
            
            // Draw colored tile
            ctx.fillStyle = tileColor;
            ctx.beginPath();
            ctx.moveTo(topLeftX, prevY);
            ctx.lineTo(topRightX, prevY);
            ctx.lineTo(bottomRightX, y);
            ctx.lineTo(bottomLeftX, y);
            ctx.closePath();
            ctx.fill();
            
            // Draw grid lines on tile - light black/grey
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Slightly darker for colored tiles
            ctx.lineWidth = 0.5;
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
            
            // Draw text - always facing viewer (not rotated)
            if (scale > 0.04 && y > gridStartY && y < gridEndY) {
                const centerX = (topLeftX + topRightX + bottomLeftX + bottomRightX) / 4;
                const centerY = (prevY + y) / 2;
                
                // Calculate available space
                const tileWidth = Math.abs(topRightX - topLeftX);
                const tileHeight = Math.abs(y - prevY);
                const minDimension = Math.min(tileWidth, tileHeight);
                
                // Calculate font size - scales with perspective
                let fontSize = Math.max(8, Math.min(scale * 50, minDimension * 0.4));
                
                // Determine text color based on tile color brightness
                const rgb = hexToRgb(tileColor);
                const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
                const textColor = brightness > 128 ? '#000000' : '#FFFFFF';
                
                ctx.fillStyle = textColor;
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Measure text to ensure it fits
                const words = term.split(' ');
                let needsSplit = false;
                
                ctx.save();
                ctx.font = `bold ${fontSize}px Arial`;
                const metrics = ctx.measureText(term);
                if (metrics.width > tileWidth * 0.85) {
                    needsSplit = true;
                    if (words.length > 1) {
                        fontSize = Math.max(8, fontSize * 0.8);
                    }
                }
                ctx.restore();
                
                // Render text - always facing viewer (no rotation)
                if (needsSplit && words.length > 1) {
                    // Split into two lines
                    const midPoint = Math.ceil(words.length / 2);
                    const line1 = words.slice(0, midPoint).join(' ');
                    const line2 = words.slice(midPoint).join(' ');
                    
                    ctx.font = `bold ${fontSize}px Arial`;
                    const lineHeight = fontSize * 1.25;
                    const totalHeight = lineHeight * 2;
                    
                    if (totalHeight <= tileHeight * 0.75) {
                        ctx.fillText(line1, centerX, centerY - lineHeight / 2);
                        ctx.fillText(line2, centerX, centerY + lineHeight / 2);
                    } else {
                        fontSize = Math.max(8, tileHeight * 0.3);
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillText(term, centerX, centerY);
                    }
                } else {
                    ctx.font = `bold ${fontSize}px Arial`;
                    ctx.fillText(term, centerX, centerY);
                }
            }
        }
    }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Animation loop
function animate() {
    if (config.isPlaying) {
        // Update grid offset for movement toward viewer (from top to bottom)
        gridOffset += config.speed * 0.01;
        
        // Seamless cycle
        if (gridOffset >= 1) {
            gridOffset = 0;
        }
        
        // Draw the grid
        drawGrid();
    } else {
        // When paused, still draw the grid
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
