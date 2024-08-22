const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 64; // Her bir hücrenin boyutu 64x64 piksel
const canvasSize = 20; // Ekrandaki hücre sayısı
const canvasWidth = box * canvasSize; // 20 * 64 = 1280 piksel
const canvasHeight = box * canvasSize; // 20 * 64 = 1280 piksel

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let score = 0;
const snake = [];
let food;
let d;
let game;
let gameOver = false;

// Resimleri yükle
const headImage = new Image();
headImage.src = 'head.png'; // Yılanın kafası resmi

const foodImage = new Image();
foodImage.src = 'apple.png'; // Yem resmi

document.addEventListener('keydown', direction);
canvas.addEventListener('mousemove', updateDirectionOnMouseMove);
canvas.addEventListener('click', updateDirectionOnMouseClick);

function direction(event) {
    if (event.key === 'ArrowLeft' && d !== 'RIGHT') {
        d = 'LEFT';
    } else if (event.key === 'ArrowUp' && d !== 'DOWN') {
        d = 'UP';
    } else if (event.key === 'ArrowRight' && d !== 'LEFT') {
        d = 'RIGHT';
    } else if (event.key === 'ArrowDown' && d !== 'UP') {
        d = 'DOWN';
    } else if (event.key === 'w' && d !== 'DOWN') {
        d = 'UP';
    } else if (event.key === 'a' && d !== 'RIGHT') {
        d = 'LEFT';
    } else if (event.key === 's' && d !== 'UP') {
        d = 'DOWN';
    } else if (event.key === 'd' && d !== 'LEFT') {
        d = 'RIGHT';
    }
}

function updateDirectionOnMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const snakeHead = snake[0];
    
    if (Math.abs(mouseX - snakeHead.x) > Math.abs(mouseY - snakeHead.y)) {
        d = mouseX < snakeHead.x ? 'LEFT' : 'RIGHT';
    } else {
        d = mouseY < snakeHead.y ? 'UP' : 'DOWN';
    }
}

function updateDirectionOnMouseClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const snakeHead = snake[0];
    
    if (Math.abs(mouseX - snakeHead.x) > Math.abs(mouseY - snakeHead.y)) {
        d = mouseX < snakeHead.x ? 'LEFT' : 'RIGHT';
    } else {
        d = mouseY < snakeHead.y ? 'UP' : 'DOWN';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Oyun Bitti!', canvas.width / 2, canvas.height / 2 - 60);
        ctx.font = '30px Arial';
        ctx.fillText('Tekrar Oyna?', canvas.width / 2, canvas.height / 2);
        return; // Oyun bittiğinde başka hiçbir şey çizme
    }

    // Yılanın her parçasını çiz
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const nextSegment = snake[i + 1] || { x: segment.x, y: segment.y }; // Son segment için bir sonraki segment yok

        if (i === 0) {
            // Kafayı resmi ile çiz
            ctx.drawImage(headImage, segment.x, segment.y, box, box);
        } else {
            ctx.fillStyle = 'green'; // Yılanın arka segmentleri için yeşil renk
            drawSegment(ctx, segment, nextSegment);
        }
    }

    // Yemi resmi ile çiz
    ctx.drawImage(foodImage, food.x, food.y, box, box);

    // Yılanın yeni başını hesapla
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Yem ile çarpışma kontrolü
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        snake.pop();
    }

    const newHead = {
        x: snakeX,
        y: snakeY
    };

    // Çarpışma kontrolü
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver = true;
        clearInterval(game);
        setTimeout(function() {
            if (confirm('Oyun bitti! Tekrar oynamak ister misin?')) {
                resetGame();
            }
        }, 100); // Confirm penceresi için kısa bir gecikme
    }

    snake.unshift(newHead);

    // Skoru yaz
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial'; // Daha büyük bir font boyutu
    ctx.fillText('Puan: ' + score, 10, 40); // Konumu ayarladık
}

function drawSegment(ctx, segment, nextSegment) {
    // Segmentler arasındaki bağlantıyı çizerken, her iki segment arasındaki kıvrımı göstermek için daha fazla detay ekleyebiliriz.
    // Burada sadece basit bir dolgu kullanıyoruz:
    ctx.fillRect(segment.x, segment.y, box, box);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    score = 0;
    snake.length = 0;
    snake[0] = { x: 9 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
    d = null;
    gameOver = false;
    game = setInterval(draw, 200);
}

// İlk oyunun başlatılması
resetGame();

