// Valentine's Day floating hearts effect
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

    let heartCount;
    switch(intensity) {
        case 'low': heartCount = 15; break;
        case 'medium': heartCount = 30; break;
        case 'high': heartCount = 50; break;
        default: heartCount = 30;
    }

    const hearts = [];
    for (let i = 0; i < heartCount; i++) {
        hearts.push(createHeart(container));
    }

    function animate() {
        hearts.forEach(heart => {
            let y = parseFloat(heart.dataset.y);
            let x = parseFloat(heart.dataset.x);
            const speed = parseFloat(heart.dataset.speed);
            const wobble = parseFloat(heart.dataset.wobble);
            let wobblePos = parseFloat(heart.dataset.wobblePos);
            let scale = parseFloat(heart.dataset.scale);
            let pulsePhase = parseFloat(heart.dataset.pulsePhase);

            // Float upward
            y -= speed;
            wobblePos += 0.03;
            x += Math.sin(wobblePos) * wobble;

            // Pulse effect
            pulsePhase += 0.05;
            const pulse = 1 + Math.sin(pulsePhase) * 0.1;

            if (y < -10) {
                y = 110;
                x = Math.random() * 100;
            }

            heart.dataset.y = y;
            heart.dataset.x = x;
            heart.dataset.wobblePos = wobblePos;
            heart.dataset.pulsePhase = pulsePhase;
            heart.style.top = y + '%';
            heart.style.left = x + '%';
            heart.style.transform = `scale(${scale * pulse})`;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createHeart(container) {
    const heart = document.createElement('div');
    const type = Math.random();

    const x = Math.random() * 100;
    const y = Math.random() * 120;
    const size = Math.random() * 20 + 15;
    const opacity = Math.random() * 0.5 + 0.3;
    const speed = Math.random() * 0.15 + 0.05;
    const wobble = Math.random() * 0.4;
    const scale = Math.random() * 0.5 + 0.7;

    heart.style.position = 'absolute';
    heart.style.left = x + '%';
    heart.style.top = y + '%';
    heart.style.fontSize = size + 'px';
    heart.style.opacity = opacity;

    // Various heart emojis
    if (type < 0.4) {
        heart.textContent = '❤️';
    } else if (type < 0.6) {
        heart.textContent = '💕';
    } else if (type < 0.75) {
        heart.textContent = '💖';
    } else if (type < 0.9) {
        heart.textContent = '💘'; // Heart with arrow
    } else {
        heart.textContent = '💝';
    }

    heart.style.textShadow = '0 0 15px rgba(255, 100, 150, 0.6)';

    heart.dataset.x = x;
    heart.dataset.y = y;
    heart.dataset.speed = speed;
    heart.dataset.wobble = wobble;
    heart.dataset.wobblePos = Math.random() * Math.PI * 2;
    heart.dataset.scale = scale;
    heart.dataset.pulsePhase = Math.random() * Math.PI * 2;

    container.appendChild(heart);
    return heart;
}
