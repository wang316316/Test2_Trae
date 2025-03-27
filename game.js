class LetterDrop {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.letters = [];
        this.score = 0;
        this.gameSpeed = 2;
        this.speedMultiplier = 1;
        this.lastSpawn = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e.key));
        document.getElementById('speedControl').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const percent = Math.round(((value - 0.1) / 4.9) * 100);
            document.getElementById('speedValue').textContent = `${percent}%`;
            this.speedMultiplier = value;
            localStorage.setItem('gameSpeed', value);
        });

        // 初始化滑块状态
        const savedSpeed = localStorage.getItem('gameSpeed') || 1;
        document.getElementById('speedControl').value = savedSpeed;
        document.getElementById('speedValue').textContent = `${Math.round(((savedSpeed - 0.1) / 4.9) * 100)}%`;
        this.speedMultiplier = savedSpeed;
    }

    resize() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.7;
    }

    spawnLetter() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const letter = chars[Math.floor(Math.random() * chars.length)];
        this.letters.push({
            x: Math.random() * (this.canvas.width - 30),
            y: 0,
            char: letter,
            speed: 1 + Math.random() * 2
        });
    }

    update() {
        const now = Date.now();
        if (now - this.lastSpawn > 1500) {
            this.spawnLetter();
            this.lastSpawn = now;
        }

        this.letters.forEach(letter => {
            letter.y += letter.speed * this.gameSpeed * this.speedMultiplier;
            if (letter.y > this.canvas.height + 30) {
                alert(`游戏结束！得分：${this.score}`);
                document.location.reload();
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '24px Arial';

        this.letters.forEach(letter => {
            this.ctx.fillText(letter.char, letter.x, letter.y);
        });

        document.getElementById('score').textContent = `得分: ${this.score}`;
    }

    handleKeyPress(key) {
        const index = this.letters.findIndex(l => l.char === key);
        if (index > -1) {
            this.letters.splice(index, 1);
            this.score += 10;
            this.gameSpeed = 2 + Math.floor(this.score / 100) * 0.5;
        }
    }

    start() {
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// 启动游戏
const game = new LetterDrop(document.getElementById('gameCanvas'));
game.start();