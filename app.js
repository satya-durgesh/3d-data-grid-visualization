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
    gridSize: 20,
    cellSize: 100,
    speed: 2,
    perspective: 1000,
    isPlaying: true,
    colors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80'
    ]
};

// Data-related terms
const dataTerms = [
    'DATA', 'JSON', 'API', 'SQL', 'NoSQL', 'MongoDB', 'Redis',
    'GraphQL', 'REST', 'ETL', 'ELT', 'Pipeline', 'Stream',
    'Batch', 'Real-time', 'Analytics', 'ML', 'AI', 'Tensor',
    'Vector', 'Matrix', 'Dataset', 'Schema', 'Index', 'Query',
    'Cache', 'Queue', 'Kafka', 'Spark', 'Hadoop', 'Hive',
    'Presto', 'Druid', 'ClickHouse', 'BigQuery', 'Snowflake',
    'Warehouse', 'Lake', 'Delta', 'Parquet', 'Avro', 'ORC'
];

// Grid cells
class GridCell {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.term = dataTerms[Math.floor(Math.random() * dataTerms.length)];
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    }

    getScreenPos() {
        const scale = config.perspective / (config.perspective + this.z);
        return {
            x: canvas.width / 2 + (this.x * config.cellSize * scale),
            y: canvas.height / 2 + (this.y * config.cellSize * scale),
            size: config.cellSize * scale,
            z: this.z
        };
    }

    draw() {
        const pos = this.getScreenPos();
        
        if (pos.size < 5 || pos.z < -config.perspective) return;

        // Checkerboard pattern
        const isEven = (Math.floor(this.x / config.gridSize) + Math.floor(this.y / config.gridSize)) % 2 === 0;
        const baseColor = isEven ? this.color : this.adjustBrightness(this.color, -30);
        
        // Draw cell with gradient
        const gradient = ctx.createLinearGradient(pos.x, pos.y, pos.x + pos.size, pos.y + pos.size);
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, this.adjustBrightness(baseColor, -20));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(pos.x, pos.y, pos.size, pos.size);
        
        // Draw border
        ctx.strokeStyle = this.adjustBrightness(baseColor, 20);
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x, pos.y, pos.size, pos.size);
        
        // Draw term text
        if (pos.size > 30) {
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${Math.max(8, pos.size / 8)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 5;
            ctx.fillText(
                this.term,
                pos.x + pos.size / 2,
                pos.y + pos.size / 2
            );
            ctx.shadowBlur = 0;
        }
    }

    adjustBrightness(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + percent));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
        return `rgb(${r},${g},${b})`;
    }
}

// Initialize grid
let cells = [];
function initGrid() {
    cells = [];
    for (let x = -config.gridSize; x <= config.gridSize; x++) {
        for (let y = -config.gridSize; y <= config.gridSize; y++) {
            const z = Math.random() * 2000 - 1000;
            cells.push(new GridCell(x, y, z));
        }
    }
}

initGrid();

// Animation loop
function animate() {
    if (config.isPlaying) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Sort cells by z for proper rendering
        cells.sort((a, b) => b.z - a.z);
        
        // Update and draw cells
        cells.forEach(cell => {
            cell.z -= config.speed;
            
            // Reset cell when it goes behind camera
            if (cell.z < -config.perspective) {
                cell.z = config.perspective;
                cell.term = dataTerms[Math.floor(Math.random() * dataTerms.length)];
                cell.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            }
            
            cell.draw();
        });
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
    initGrid();
    config.isPlaying = true;
    document.getElementById('playPause').textContent = 'Pause';
});

