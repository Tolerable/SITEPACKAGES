// St. Patrick's Day effect (clovers, gold, rainbows)
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
        objects.push(createLuckyObject(container));
    }

    function animate() {
        objects.forEach(obj => {
            let y = parseFloat(obj.dataset.y);
            let x = parseFloat(obj.dataset.x);
            const speed = parseFloat(obj.dataset.speed);
            const wobble = parseFloat(obj.dataset.wobble);
            let wobblePos = parseFloat(obj.dataset.wobblePos);
            let rotation = parseFloat(obj.dataset.rotation);

            y += speed;
            wobblePos += 0.02;
            x += Math.sin(wobblePos) * wobble;
            rotation += Math.sin(wobblePos) * 0.3;

            if (y > 105) {
                y = -10;
                x = Math.random() * 100;
            }

            obj.dataset.y = y;
            obj.dataset.x = x;
            obj.dataset.wobblePos = wobblePos;
            obj.dataset.rotation = rotation;
            obj.style.top = y + '%';
            obj.style.left = x + '%';
            obj.style.transform = `rotate(${rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createLuckyObject(container) {
    const obj = document.createElement('div');
    const type = Math.random();

    const x = Math.random() * 100;
    const y = Math.random() * 100 - 10;
    const size = Math.random() * 20 + 15;
    const opacity = Math.random() * 0.5 + 0.4;
    const speed = Math.random() * 0.15 + 0.08;
    const wobble = Math.random() * 0.3;

    obj.style.position = 'absolute';
    obj.style.left = x + '%';
    obj.style.top = y + '%';
    obj.style.fontSize = size + 'px';
    obj.style.opacity = opacity;

    // Clover, gold, rainbow, leprechaun hat
    if (type < 0.45) {
        obj.textContent = '☘️';
        obj.style.textShadow = '0 0 10px rgba(50, 205, 50, 0.6)';
    } else if (type < 0.65) {
        obj.textContent = '🍀'; // Four-leaf clover
        obj.style.textShadow = '0 0 12px rgba(50, 205, 50, 0.8)';
    } else if (type < 0.8) {
        obj.textContent = '🪙';
        obj.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
    } else if (type < 0.9) {
        obj.textContent = '🌈';
    } else {
        obj.textContent = '🎩';
    }

    obj.dataset.x = x;
    obj.dataset.y = y;
    obj.dataset.speed = speed;
    obj.dataset.wobble = wobble;
    obj.dataset.wobblePos = Math.random() * Math.PI * 2;
    obj.dataset.rotation = 0;

    container.appendChild(obj);
    return obj;
}
