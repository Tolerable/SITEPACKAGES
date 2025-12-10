// Summer/Beach effect (sun, waves, palms, beach items)
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
        case 'low': objectCount = 12; break;
        case 'medium': objectCount = 22; break;
        case 'high': objectCount = 35; break;
        default: objectCount = 22;
    }

    const objects = [];
    for (let i = 0; i < objectCount; i++) {
        objects.push(createSummerObject(container));
    }

    function animate() {
        objects.forEach(obj => {
            let y = parseFloat(obj.dataset.y);
            let x = parseFloat(obj.dataset.x);
            const speed = parseFloat(obj.dataset.speed);
            const sway = parseFloat(obj.dataset.sway);
            let swayPos = parseFloat(obj.dataset.swayPos);

            y += speed;
            swayPos += 0.015;
            x += Math.sin(swayPos) * sway;

            if (y > 105) {
                y = -10;
                x = Math.random() * 100;
            }

            obj.dataset.y = y;
            obj.dataset.x = x;
            obj.dataset.swayPos = swayPos;
            obj.style.top = y + '%';
            obj.style.left = x + '%';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createSummerObject(container) {
    const obj = document.createElement('div');
    const type = Math.random();

    const x = Math.random() * 100;
    const y = Math.random() * 100 - 10;
    const size = Math.random() * 18 + 14;
    const opacity = Math.random() * 0.5 + 0.4;
    const speed = Math.random() * 0.1 + 0.05;
    const sway = Math.random() * 0.2;

    obj.style.position = 'absolute';
    obj.style.left = x + '%';
    obj.style.top = y + '%';
    obj.style.fontSize = size + 'px';
    obj.style.opacity = opacity;

    // Sun, sunglasses, palm, shell, umbrella, wave
    if (type < 0.2) {
        obj.textContent = '☀️';
        obj.style.textShadow = '0 0 15px rgba(255, 200, 0, 0.8)';
    } else if (type < 0.35) {
        obj.textContent = '🕶️';
    } else if (type < 0.5) {
        obj.textContent = '🌴';
    } else if (type < 0.65) {
        obj.textContent = '🐚';
    } else if (type < 0.8) {
        obj.textContent = '🏖️';
    } else if (type < 0.9) {
        obj.textContent = '🌊';
        obj.style.textShadow = '0 0 10px rgba(100, 200, 255, 0.6)';
    } else {
        obj.textContent = '🍹';
    }

    obj.dataset.x = x;
    obj.dataset.y = y;
    obj.dataset.speed = speed;
    obj.dataset.sway = sway;
    obj.dataset.swayPos = Math.random() * Math.PI * 2;

    container.appendChild(obj);
    return obj;
}
