// Christmas floating objects effect (snowflakes, trees, ornaments, stars)
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

    let objectCount;
    switch(intensity) {
        case 'low': objectCount = 15; break;
        case 'medium': objectCount = 30; break;
        case 'high': objectCount = 50; break;
        default: objectCount = 30;
    }

    const objects = [];
    for (let i = 0; i < objectCount; i++) {
        objects.push(createChristmasObject(container));
    }

    function animate() {
        objects.forEach(obj => {
            let y = parseFloat(obj.dataset.y);
            let x = parseFloat(obj.dataset.x);
            const speed = parseFloat(obj.dataset.speed);
            const drift = parseFloat(obj.dataset.drift);
            let rotation = parseFloat(obj.dataset.rotation);
            const rotSpeed = parseFloat(obj.dataset.rotSpeed);

            y += speed;
            x += Math.sin(y * 0.02) * drift;
            rotation += rotSpeed;

            if (y > 105) {
                y = -10;
                x = Math.random() * 100;
            }

            obj.dataset.y = y;
            obj.dataset.x = x;
            obj.dataset.rotation = rotation;
            obj.style.top = y + '%';
            obj.style.left = x + '%';
            obj.style.transform = `rotate(${rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createChristmasObject(container) {
    const obj = document.createElement('div');
    const type = Math.random();

    const x = Math.random() * 100;
    const y = Math.random() * 100 - 10;
    const size = Math.random() * 20 + 15;
    const opacity = Math.random() * 0.5 + 0.4;
    const speed = Math.random() * 0.2 + 0.1;
    const drift = Math.random() * 0.2;

    obj.style.position = 'absolute';
    obj.style.left = x + '%';
    obj.style.top = y + '%';
    obj.style.fontSize = size + 'px';
    obj.style.opacity = opacity;

    // Snowflake, tree, ornament, star, or gift
    if (type < 0.4) {
        obj.textContent = '❄️';
        obj.style.textShadow = '0 0 8px rgba(200, 230, 255, 0.8)';
    } else if (type < 0.55) {
        obj.textContent = '🎄';
    } else if (type < 0.7) {
        obj.textContent = '🎁';
    } else if (type < 0.85) {
        obj.textContent = '⭐';
        obj.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
    } else {
        obj.textContent = '🔔';
    }

    obj.dataset.x = x;
    obj.dataset.y = y;
    obj.dataset.speed = speed;
    obj.dataset.drift = drift;
    obj.dataset.rotation = 0;
    obj.dataset.rotSpeed = (Math.random() - 0.5) * 0.5;

    container.appendChild(obj);
    return obj;
}
