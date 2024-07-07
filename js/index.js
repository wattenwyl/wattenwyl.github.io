document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.getElementById('contact-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const popup = document.getElementById('popup');
    const creditsPopup = document.getElementById('credits-popup');
    const closeButtons = document.querySelectorAll('.close');
    const shapes = document.querySelectorAll('.shape');
    let shapeSequence = [];

    contactBtn.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    creditsBtn.addEventListener('click', () => {
        creditsPopup.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.popup').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('popup')) {
            event.target.style.display = 'none';
        }
    });

    // Add hover and click effects to shapes
    shapes.forEach((shape, index) => {
        shape.addEventListener('mouseover', () => {
            shape.style.filter = 'brightness(1.2)';
        });
        shape.addEventListener('mouseout', () => {
            shape.style.filter = 'brightness(1)';
        });
        shape.addEventListener('click', () => {
            triggerShapeConfetti(index);
            updateShapeSequence(index);
        });
    });

    function triggerShapeConfetti(shapeIndex) {
        const colors = [
            ['#00b8a9', '#0f4c81', '#7be495'], // Kreis
            ['#ff6b6b', '#feca57', '#48dbfb'], // Quadrat
            ['#ff9ff3', '#54a0ff', '#5f27cd']  // Dreieck
        ];

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: colors[shapeIndex]
        });
    }

    function updateShapeSequence(shapeIndex) {
        shapeSequence.push(shapeIndex);
        if (shapeSequence.length > 3) {
            shapeSequence.shift();
        }
        if (shapeSequence.join('') === '012') {
            triggerBigConfetti();
            shapeSequence = [];
        }
    }

    function triggerBigConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);
    }
});