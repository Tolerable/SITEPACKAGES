// Bubbles effect
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
    let bubbleCount;
    switch(intensity) {
        case 'low':
            bubbleCount = 20;
            break;
        case 'medium':
            bubbleCount = 40;
            break;
        case 'high':
            bubbleCount = 80;
            break;
        default:
            bubbleCount = 40;
    }

    // Create bubbles
    const bubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(createBubble(container));
    }

    // Animation loop
    function animate() {
        bubbles.forEach(bubble => {
            let y = parseFloat(bubble.dataset.y);
            let x = parseFloat(bubble.dataset.x);
            const speed = parseFloat(bubble.dataset.speed);
            const wobble = parseFloat(bubble.dataset.wobble);
            let wobblePos = parseFloat(bubble.dataset.wobblePos);

            y -= speed;
            wobblePos += 0.02;
            x += Math.sin(wobblePos) * wobble;

            // Reset if past top
            if (y < -10) {
                y = 110;
                x = Math.random() * 100;
            }

            bubble.dataset.y = y;
            bubble.dataset.x = x;
            bubble.dataset.wobblePos = wobblePos;
            bubble.style.top = y + '%';
            bubble.style.left = x + '%';
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function createBubble(container) {
    const bubble = document.createElement('div');

    const x = Math.random() * 100;
    const y = Math.random() * 100 + 100;
    const size = Math.random() * 30 + 10;
    const opacity = Math.random() * 0.3 + 0.1;
    const speed = Math.random() * 0.15 + 0.05;
    const wobble = Math.random() * 0.2;

    bubble.style.position = 'absolute';
    bubble.style.left = x + '%';
    bubble.style.top = y + '%';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.border = '1px solid rgba(255, 255, 255, ' + (opacity + 0.2) + ')';
    bubble.style.borderRadius = '50%';
    bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,' + opacity + '), transparent)';

    bubble.dataset.x = x;
    bubble.dataset.y = y;
    bubble.dataset.speed = speed;
    bubble.dataset.wobble = wobble;
    bubble.dataset.wobblePos = Math.random() * Math.PI * 2;

    container.appendChild(bubble);
    return bubble;
}
