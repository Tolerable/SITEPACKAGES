// Fireflies effect
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

    // Determine count based on intensity
    let fireflyCount;
    switch(intensity) {
        case 'low':
            fireflyCount = 15;
            break;
        case 'medium':
            fireflyCount = 30;
            break;
        case 'high':
            fireflyCount = 60;
            break;
        default:
            fireflyCount = 30;
    }

    // Create fireflies
    const fireflies = [];
    for (let i = 0; i < fireflyCount; i++) {
        fireflies.push(createFirefly(container));
    }

    // Animation loop
    function animate() {
        fireflies.forEach(firefly => {
            let x = parseFloat(firefly.dataset.x);
            let y = parseFloat(firefly.dataset.y);
            let vx = parseFloat(firefly.dataset.vx);
            let vy = parseFloat(firefly.dataset.vy);
            let glowPhase = parseFloat(firefly.dataset.glowPhase);

            // Random direction changes
            if (Math.random() < 0.02) {
                vx += (Math.random() - 0.5) * 0.1;
                vy += (Math.random() - 0.5) * 0.1;
            }

            // Limit velocity
            const maxSpeed = 0.1;
            vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
            vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));

            x += vx;
            y += vy;

            // Bounce off edges
            if (x < 0 || x > 100) vx *= -1;
            if (y < 0 || y > 100) vy *= -1;

            // Keep in bounds
            x = Math.max(0, Math.min(100, x));
            y = Math.max(0, Math.min(100, y));

            // Glow animation
            glowPhase += 0.03;
            const glow = (Math.sin(glowPhase) + 1) / 2;
            firefly.style.opacity = 0.2 + glow * 0.8;
            firefly.style.boxShadow = `0 0 ${5 + glow * 15}px ${2 + glow * 8}px rgba(255, 255, 100, ${0.3 + glow * 0.5})`;

            firefly.dataset.x = x;
            firefly.dataset.y = y;
            firefly.dataset.vx = vx;
            firefly.dataset.vy = vy;
            firefly.dataset.glowPhase = glowPhase;
            firefly.style.left = x + '%';
            firefly.style.top = y + '%';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createFirefly(container) {
    const firefly = document.createElement('div');

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3 + 2;

    firefly.style.position = 'absolute';
    firefly.style.left = x + '%';
    firefly.style.top = y + '%';
    firefly.style.width = size + 'px';
    firefly.style.height = size + 'px';
    firefly.style.backgroundColor = '#ffff66';
    firefly.style.borderRadius = '50%';
    firefly.style.transition = 'opacity 0.1s ease';

    firefly.dataset.x = x;
    firefly.dataset.y = y;
    firefly.dataset.vx = (Math.random() - 0.5) * 0.1;
    firefly.dataset.vy = (Math.random() - 0.5) * 0.1;
    firefly.dataset.glowPhase = Math.random() * Math.PI * 2;

    container.appendChild(firefly);
    return firefly;
}
