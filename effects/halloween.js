// Halloween floating objects effect (pumpkins, bats, ghosts)
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
    let objectCount;
    switch(intensity) {
        case 'low': objectCount = 10; break;
        case 'medium': objectCount = 20; break;
        case 'high': objectCount = 35; break;
        default: objectCount = 20;
    }

    const objects = [];
    for (let i = 0; i < objectCount; i++) {
        objects.push(createHalloweenObject(container));
    }

    function animate() {
        objects.forEach(obj => {
            let y = parseFloat(obj.dataset.y);
            let x = parseFloat(obj.dataset.x);
            const speed = parseFloat(obj.dataset.speed);
            const wobble = parseFloat(obj.dataset.wobble);
            let wobblePos = parseFloat(obj.dataset.wobblePos);
            let rotation = parseFloat(obj.dataset.rotation);

            // Float upward slowly
            y -= speed * 0.3;
            wobblePos += 0.02;
            x += Math.sin(wobblePos) * wobble;
            rotation += Math.sin(wobblePos * 2) * 0.5;

            if (y < -15) {
                y = 110;
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

function createHalloweenObject(container) {
    const obj = document.createElement('div');
    const type = Math.random();

    const x = Math.random() * 100;
    const y = Math.random() * 120;
    const size = Math.random() * 25 + 20;
    const opacity = Math.random() * 0.4 + 0.3;
    const speed = Math.random() * 0.15 + 0.05;
    const wobble = Math.random() * 0.3;

    obj.style.position = 'absolute';
    obj.style.left = x + '%';
    obj.style.top = y + '%';
    obj.style.fontSize = size + 'px';
    obj.style.opacity = opacity;
    obj.style.textShadow = '0 0 10px rgba(255, 100, 0, 0.5)';

    // Pumpkin, bat, ghost, or skull emoji
    if (type < 0.35) {
        obj.textContent = '🎃';
    } else if (type < 0.6) {
        obj.textContent = '🦇';
    } else if (type < 0.85) {
        obj.textContent = '👻';
    } else {
        obj.textContent = '💀';
    }

    obj.dataset.x = x;
    obj.dataset.y = y;
    obj.dataset.speed = speed;
    obj.dataset.wobble = wobble;
    obj.dataset.wobblePos = Math.random() * Math.PI * 2;
    obj.dataset.rotation = Math.random() * 20 - 10;

    container.appendChild(obj);
    return obj;
}
