/**
 * Page effects shared across all pages (particles, cursor, scroll progress,
 * magnetic buttons, mobile nav). Lighter version of the index.html inline
 * script — keeps the visual consistency on internal pages.
 */
(function() {
    'use strict';

    const isMobile = window.innerWidth < 768;

    // ─── PARTICLE NETWORK ───
    const pCanvas = document.getElementById('particleCanvas');
    if (pCanvas) {
        const pCtx = pCanvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const PARTICLE_COUNT = isMobile ? 30 : 65;
        const CONNECT_DIST = isMobile ? 80 : 130;
        const MOUSE_RADIUS = 180;

        function resizeCanvas() {
            pCanvas.width = window.innerWidth;
            pCanvas.height = window.innerHeight;
        }
        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * pCanvas.width,
                    y: Math.random() * pCanvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 1.5 + 0.5
                });
            }
        }
        function animate() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            for (const p of particles) {
                if (mouse.x !== null) {
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < MOUSE_RADIUS) {
                        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                        p.vx += (dx / dist) * force * 0.15;
                        p.vy += (dy / dist) * force * 0.15;
                    }
                }
                p.vx *= 0.98; p.vy *= 0.98;
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = pCanvas.width;
                if (p.x > pCanvas.width) p.x = 0;
                if (p.y < 0) p.y = pCanvas.height;
                if (p.y > pCanvas.height) p.y = 0;
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                pCtx.fillStyle = 'rgba(255, 77, 0, 0.5)';
                pCtx.fill();
            }
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.12;
                        pCtx.beginPath();
                        pCtx.moveTo(particles[i].x, particles[i].y);
                        pCtx.lineTo(particles[j].x, particles[j].y);
                        pCtx.strokeStyle = 'rgba(255, 77, 0, ' + alpha + ')';
                        pCtx.lineWidth = 0.5;
                        pCtx.stroke();
                    }
                }
            }
            if (mouse.x !== null) {
                for (const p of particles) {
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < MOUSE_RADIUS) {
                        const alpha = (1 - dist / MOUSE_RADIUS) * 0.25;
                        pCtx.beginPath();
                        pCtx.moveTo(p.x, p.y);
                        pCtx.lineTo(mouse.x, mouse.y);
                        pCtx.strokeStyle = 'rgba(255, 140, 0, ' + alpha + ')';
                        pCtx.lineWidth = 0.6;
                        pCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        resizeCanvas();
        initParticles();
        animate();
        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        // ─── CURSOR CUSTOM ───
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let ringX = 0, ringY = 0;
        if (!isMobile && dot && ring) {
            document.addEventListener('mousemove', (e) => {
                dot.style.left = e.clientX - 4 + 'px';
                dot.style.top = e.clientY - 4 + 'px';
            });
            function followRing() {
                if (mouse.x !== null) {
                    ringX += (mouse.x - ringX) * 0.15;
                    ringY += (mouse.y - ringY) * 0.15;
                    ring.style.left = ringX - 20 + 'px';
                    ring.style.top = ringY - 20 + 'px';
                }
                requestAnimationFrame(followRing);
            }
            followRing();
            document.querySelectorAll('a, button, .btn, .solution-card, .demo-btn, .inv-demo-btn').forEach(el => {
                el.addEventListener('mouseenter', () => ring.classList.add('hover'));
                el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
            });
        }
    }

    // ─── SCROLL PROGRESS ───
    const scrollBar = document.getElementById('scrollProgress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
            scrollBar.style.width = scrolled + '%';
        });
    }

    // ─── MAGNETIC BUTTONS ───
    if (!isMobile) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => btn.style.transition = '', 400);
            });
            btn.addEventListener('mouseenter', () => { btn.style.transition = ''; });
        });
    }

    // ─── MOBILE NAV ───
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });
    }
})();
