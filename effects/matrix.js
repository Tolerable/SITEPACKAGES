// Matrix code rain effect
function initBackgroundEffect(intensity) {
    const container = document.getElementById('background-effect');
    container.innerHTML = '';

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-9';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Resize canvas to fill window
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');

    // Determine settings based on intensity
    let fontSize, speed, color;
    switch(intensity) {
        case 'low':
            fontSize = 16;
            speed = 50;
            color = '#0f0';
            break;
        case 'medium':
            fontSize = 14;
            speed = 35;
            color = '#0f0';
            break;
        case 'high':
            fontSize = 12;
            speed = 25;
            color = '#0f0';
            break;
        default:
            fontSize = 14;
            speed = 35;
            color = '#0f0';
    }

    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charArray[Math.floor(Math.random() * charArray.length)];

            // Draw character
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            // Reset drop to top with random delay
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    // Animation loop
    setInterval(draw, speed);
}
