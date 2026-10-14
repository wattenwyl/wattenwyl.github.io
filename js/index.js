document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.getElementById('contact-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const privacyBtn = document.getElementById('privacy-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const popup = document.getElementById('popup');
    const creditsPopup = document.getElementById('credits-popup');
    const privacyPopup = document.getElementById('privacy-popup');
    const emailLink = document.getElementById('email-link');
    const privacyEmailReveal = document.getElementById('privacy-email-reveal');
    const privacyEmailLink = document.getElementById('privacy-email-link');
    const closeButtons = document.querySelectorAll('.close');
    const shapes = document.querySelectorAll('.shape');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiContext = confettiCanvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let confettiParticles = [];
    let confettiFrame = null;
    let canvasScale = 1;
    let shapeSequence = [];
    let lastFocusedElement;

    themeToggle.addEventListener('input', () => {
        const is2016 = !themeToggle.checked;
        document.body.classList.toggle('theme-2016', is2016);
    });

    contactBtn.addEventListener('click', () => {
        revealEmail(emailLink);
        openPopup(popup);
    });

    creditsBtn.addEventListener('click', () => {
        openPopup(creditsPopup);
    });

    privacyBtn.addEventListener('click', () => {
        openPopup(privacyPopup);
    });

    privacyEmailReveal.addEventListener('click', () => {
        revealEmail(privacyEmailLink);
        privacyEmailReveal.hidden = true;
        privacyEmailLink.hidden = false;
        privacyEmailLink.focus();
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closePopup(button.closest('.popup'));
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('popup')) {
            closePopup(event.target);
        }
    });

    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            const openPopupElement = document.querySelector('.popup[aria-hidden="false"]');
            if (openPopupElement) {
                closePopup(openPopupElement);
            }
        }
    });

    function openPopup(element) {
        lastFocusedElement = document.activeElement;
        element.style.display = 'flex';
        element.setAttribute('aria-hidden', 'false');
        element.querySelector('.close').focus();
    }

    function closePopup(element) {
        element.style.display = 'none';
        element.setAttribute('aria-hidden', 'true');
        lastFocusedElement.focus();
    }

    function revealEmail(link) {
        const encodedAddress = [
            34, 38, 39, 61, 40, 34, 61, 103, 62, 40,
            61, 61, 44, 39, 62, 48, 37, 9, 38, 60,
            61, 37, 38, 38, 34, 103, 42, 38, 36
        ];
        const emailAddress = String.fromCharCode(...encodedAddress.map(code => code ^ 73));
        link.href = `mailto:${emailAddress}`;
        link.textContent = emailAddress;
    }

    function resizeConfettiCanvas() {
        canvasScale = Math.min(window.devicePixelRatio || 1, 2);
        confettiCanvas.width = Math.round(window.innerWidth * canvasScale);
        confettiCanvas.height = Math.round(window.innerHeight * canvasScale);
        if (confettiContext) {
            confettiContext.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
        }
    }

    function launchConfetti(particleCount, spread, origin, colors) {
        if (reducedMotion || !confettiContext) {
            return;
        }

        const fullCircle = spread >= 360;
        const spreadRadians = spread * Math.PI / 180;
        for (let index = 0; index < particleCount; index += 1) {
            const angle = fullCircle
                ? Math.random() * Math.PI * 2
                : -Math.PI / 2 + (Math.random() - 0.5) * spreadRadians;
            const speed = 3 + Math.random() * 5;
            const lifetime = 65 + Math.random() * 45;
            confettiParticles.push({
                x: origin.x * window.innerWidth,
                y: origin.y * window.innerHeight,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation: Math.random() * Math.PI,
                rotationSpeed: (Math.random() - 0.5) * 0.22,
                size: 4 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                lifetime,
                remaining: lifetime
            });
        }

        if (confettiFrame === null) {
            confettiFrame = window.requestAnimationFrame(drawConfetti);
        }
    }

    function drawConfetti() {
        confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let index = confettiParticles.length - 1; index >= 0; index -= 1) {
            const particle = confettiParticles[index];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.12;
            particle.vx *= 0.99;
            particle.rotation += particle.rotationSpeed;
            particle.remaining -= 1;

            if (particle.remaining <= 0 || particle.y > window.innerHeight + 30) {
                confettiParticles.splice(index, 1);
                continue;
            }

            confettiContext.save();
            confettiContext.globalAlpha = particle.remaining / particle.lifetime;
            confettiContext.fillStyle = particle.color;
            confettiContext.translate(particle.x, particle.y);
            confettiContext.rotate(particle.rotation);
            confettiContext.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.65);
            confettiContext.restore();
        }

        if (confettiParticles.length > 0) {
            confettiFrame = window.requestAnimationFrame(drawConfetti);
        } else {
            confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
            confettiFrame = null;
        }
    }

    // Add hover and click effects to shapes
    shapes.forEach((shape, index) => {
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

        launchConfetti(50, 60, { x: 0.5, y: 0.6 }, colors[shapeIndex]);
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
        if (reducedMotion) {
            return;
        }

        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = Math.round(30 * (timeLeft / duration));
            const colors = ['#00b8a9', '#0f4c81', '#7be495', '#ff6b6b', '#feca57', '#48dbfb'];
            launchConfetti(particleCount, 360, { x: randomInRange(0.1, 0.3), y: Math.random() * 0.3 }, colors);
            launchConfetti(particleCount, 360, { x: randomInRange(0.7, 0.9), y: Math.random() * 0.3 }, colors);
        }, 250);
    }
});