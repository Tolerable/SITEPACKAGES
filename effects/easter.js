// Easter effect (eggs, bunnies, flowers)
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
        case 'medium': objectCount = 25; break;
        case 'high': objectCount = 40; break;
        default: objectCount = 25;
    }

    const objects = [];
    for (let i = 0; i < objectCount; i++) {
        objects.push(createEasterObject(container));
    }

    function animate() {
        objects.forEach(obj => {
            let y = parseFloat(obj.dataset.y);
            let x = parseFloat(obj.dataset.x);
            const speed = parseFloat(obj.dataset.speed);
            const wobble = parseFloat(obj.dataset.wobble);
            let wobblePos = parseFloat(obj.dataset.wobblePos);
            let bounce = parseFloat(obj.dataset.bounce);

            y += speed;
            wobblePos += 0.025;
            x += Math.sin(wobblePos) * wobble;

            // Bouncy effect
            bounce += 0.08;
            const bounceOffset = Math.abs(Math.sin(bounce)) * 2;

            if (y > 105) {
                y = -10;
                x = Math.random() * 100;
            }

            obj.dataset.y = y;
            obj.dataset.x = x;
            obj.dataset.wobblePos = wobblePos;
            obj.dataset.bounce = bounce;
            obj.style.top = (y - bounceOffset) + '%';
            obj.style.left = x + '%';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createEasterObject(container) {
    const obj = document.createElement('div');
    const type = Math.random();

    const x = Math.random() * 100;
    const y = Math.random() * 100 - 10;
    const size = Math.random() * 18 + 14;
    const opacity = Math.random() * 0.5 + 0.4;
    const speed = Math.random() * 0.12 + 0.06;
    const wobble = Math.random() * 0.25;

    obj.style.position = 'absolute';
    obj.style.left = x + '%';
    obj.style.top = y + '%';
    obj.style.fontSize = size + 'px';
    obj.style.opacity = opacity;

    // Easter egg, bunny, chick, flower, butterfly
    if (type < 0.35) {
        obj.textContent = '🥚';
        // Add pastel glow
        obj.style.textShadow = '0 0 8px rgba(255, 200, 200, 0.6)';
    } else if (type < 0.55) {
        obj.textContent = '🐰';
    } else if (type < 0.7) {
        obj.textContent = '🐣';
    } else if (type < 0.85) {
        obj.textContent = '🌸';
        obj.style.textShadow = '0 0 8px rgba(255, 182, 193, 0.6)';
    } else {
        obj.textContent = '🦋';
    }

    obj.dataset.x = x;
    obj.dataset.y = y;
    obj.dataset.speed = speed;
    obj.dataset.wobble = wobble;
    obj.dataset.wobblePos = Math.random() * Math.PI * 2;
    obj.dataset.bounce = Math.random() * Math.PI * 2;

    container.appendChild(obj);
    return obj;
}
