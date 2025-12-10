// Rain effect
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
    let rainCount;
    switch(intensity) {
        case 'low':
            rainCount = 100;
            break;
        case 'medium':
            rainCount = 200;
            break;
        case 'high':
            rainCount = 400;
            break;
        default:
            rainCount = 200;
    }

    // Create rain drops
    const drops = [];
    for (let i = 0; i < rainCount; i++) {
        drops.push(createRainDrop(container));
    }

    // Animation loop
    function animate() {
        drops.forEach(drop => {
            let y = parseFloat(drop.dataset.y);
            const speed = parseFloat(drop.dataset.speed);

            y += speed;

            // Reset if past bottom
            if (y > 105) {
                y = -10;
                drop.style.left = Math.random() * 100 + '%';
            }

            drop.dataset.y = y;
            drop.style.top = y + '%';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createRainDrop(container) {
    const drop = document.createElement('div');

    const x = Math.random() * 100;
    const y = Math.random() * 100 - 10;
    const length = Math.random() * 15 + 10;
    const opacity = Math.random() * 0.3 + 0.2;
    const speed = Math.random() * 1 + 0.8;

    drop.style.position = 'absolute';
    drop.style.left = x + '%';
    drop.style.top = y + '%';
    drop.style.width = '1px';
    drop.style.height = length + 'px';
    drop.style.background = 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, ' + opacity + '))';
    drop.style.borderRadius = '0 0 2px 2px';

    drop.dataset.y = y;
    drop.dataset.speed = speed;

    container.appendChild(drop);
    return drop;
}
