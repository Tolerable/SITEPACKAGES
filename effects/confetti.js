// Confetti celebration effect
function initBackgroundEffect(intensity) {
    const container = document.getElementById('background-effect');
    container.innerHTML = '';

    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-9';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';

    // Colors
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088'];

    // Determine count based on intensity
    let confettiCount;
    switch(intensity) {
        case 'low':
            confettiCount = 50;
            break;
        case 'medium':
            confettiCount = 100;
            break;
        case 'high':
            confettiCount = 200;
            break;
        default:
            confettiCount = 100;
    }

    // Create confetti pieces
    const confetti = [];
    for (let i = 0; i < confettiCount; i++) {
        confetti.push(createConfetti(container, colors));
    }

    // Animation loop
    function animate() {
        confetti.forEach(piece => {
            let y = parseFloat(piece.dataset.y);
            let x = parseFloat(piece.dataset.x);
            let rotation = parseFloat(piece.dataset.rotation);
            const speed = parseFloat(piece.dataset.speed);
            const rotationSpeed = parseFloat(piece.dataset.rotationSpeed);
            const wobble = parseFloat(piece.dataset.wobble);
            let wobblePos = parseFloat(piece.dataset.wobblePos);

            y += speed;
            wobblePos += 0.05;
            x += Math.sin(wobblePos) * wobble;
            rotation += rotationSpeed;

            // Reset if past bottom
            if (y > 105) {
                y = -10;
                x = Math.random() * 100;
            }

            piece.dataset.y = y;
            piece.dataset.x = x;
            piece.dataset.rotation = rotation;
            piece.dataset.wobblePos = wobblePos;
            piece.style.top = y + '%';
            piece.style.left = x + '%';
            piece.style.transform = `rotate(${rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createConfetti(container, colors) {
    const piece = document.createElement('div');

    const x = Math.random() * 100;
    const y = Math.random() * 100 - 100;
    const width = Math.random() * 8 + 4;
    const height = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = Math.random() * 0.3 + 0.2;
    const rotationSpeed = (Math.random() - 0.5) * 5;
    const wobble = Math.random() * 0.3;

    piece.style.position = 'absolute';
    piece.style.left = x + '%';
    piece.style.top = y + '%';
    piece.style.width = width + 'px';
    piece.style.height = height + 'px';
    piece.style.backgroundColor = color;
    piece.style.borderRadius = '2px';
    piece.style.opacity = Math.random() * 0.4 + 0.6;

    piece.dataset.x = x;
    piece.dataset.y = y;
    piece.dataset.speed = speed;
    piece.dataset.rotation = Math.random() * 360;
    piece.dataset.rotationSpeed = rotationSpeed;
    piece.dataset.wobble = wobble;
    piece.dataset.wobblePos = Math.random() * Math.PI * 2;

    container.appendChild(piece);
    return piece;
}
