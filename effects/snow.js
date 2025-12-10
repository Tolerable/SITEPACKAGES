// Snow falling effect
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
    let snowCount;
    switch(intensity) {
        case 'low':
            snowCount = 50;
            break;
        case 'medium':
            snowCount = 100;
            break;
        case 'high':
            snowCount = 200;
            break;
        default:
            snowCount = 100;
    }

    // Create snowflakes
    const snowflakes = [];
    for (let i = 0; i < snowCount; i++) {
        snowflakes.push(createSnowflake(container));
    }

    // Animation loop
    function animate() {
        snowflakes.forEach(snowflake => {
            let y = parseFloat(snowflake.dataset.y);
            let x = parseFloat(snowflake.dataset.x);
            const speed = parseFloat(snowflake.dataset.speed);
            const drift = parseFloat(snowflake.dataset.drift);

            // Move down and drift
            y += speed;
            x += Math.sin(y * 0.01) * drift;

            // Reset if past bottom
            if (y > 105) {
                y = -5;
                x = Math.random() * 100;
            }

            // Keep x in bounds
            if (x > 100) x = 0;
            if (x < 0) x = 100;

            snowflake.dataset.y = y;
            snowflake.dataset.x = x;
            snowflake.style.top = y + '%';
            snowflake.style.left = x + '%';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createSnowflake(container) {
    const snowflake = document.createElement('div');

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    const opacity = Math.random() * 0.6 + 0.4;
    const speed = Math.random() * 0.3 + 0.1;
    const drift = Math.random() * 0.3;

    snowflake.style.position = 'absolute';
    snowflake.style.left = x + '%';
    snowflake.style.top = y + '%';
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    snowflake.style.backgroundColor = 'white';
    snowflake.style.borderRadius = '50%';
    snowflake.style.opacity = opacity;
    snowflake.style.boxShadow = '0 0 ' + (size * 2) + 'px rgba(255,255,255,0.5)';

    snowflake.dataset.x = x;
    snowflake.dataset.y = y;
    snowflake.dataset.speed = speed;
    snowflake.dataset.drift = drift;

    container.appendChild(snowflake);
    return snowflake;
}
