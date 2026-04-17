
(function() {
    'use strict';

    // ─── GSAP Setup ───
    gsap.registerPlugin(ScrollTrigger);

    // ─── PARTICLE NETWORK (Canvas 2D) ───
    const pCanvas = document.getElementById('particleCanvas');
    const pCtx = pCanvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 35 : 80;
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

    function animateParticles() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

        for (const p of particles) {
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    p.vx += (dx / dist) * force * 0.15;
                    p.vy += (dy / dist) * force * 0.15;
                }
            }
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = pCanvas.width;
            if (p.x > pCanvas.width) p.x = 0;
            if (p.y < 0) p.y = pCanvas.height;
            if (p.y > pCanvas.height) p.y = 0;

            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            pCtx.fillStyle = 'rgba(255, 77, 0, 0.5)';
            pCtx.fill();
        }

        // Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.12;
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(255, 77, 0, ${alpha})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.stroke();
                }
            }
        }

        // Mouse connections
        if (mouse.x !== null) {
            for (const p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const alpha = (1 - dist / MOUSE_RADIUS) * 0.25;
                    pCtx.beginPath();
                    pCtx.moveTo(p.x, p.y);
                    pCtx.lineTo(mouse.x, mouse.y);
                    pCtx.strokeStyle = `rgba(255, 140, 0, ${alpha})`;
                    pCtx.lineWidth = 0.6;
                    pCtx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    // ─── CUSTOM CURSOR ───
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let ringX = 0, ringY = 0;

    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            dot.style.left = e.clientX - 4 + 'px';
            dot.style.top = e.clientY - 4 + 'px';
        });

        function followRing() {
            ringX += (mouse.x - ringX) * 0.15;
            ringY += (mouse.y - ringY) * 0.15;
            ring.style.left = ringX - 20 + 'px';
            ring.style.top = ringY - 20 + 'px';
            requestAnimationFrame(followRing);
        }
        followRing();

        // Hover effect on interactive elements
        document.querySelectorAll('a, button, .s-card, .stack-item, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    // ─── SCROLL PROGRESS ───
    const scrollBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        scrollBar.style.width = scrolled + '%';
    });

    // ─── TEXT SCRAMBLE EFFECT ───
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 30);
                const end = start + Math.floor(Math.random() * 30);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span style="color:var(--accent);opacity:0.7">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Apply scramble to hero badge
    const scrambleEl = document.querySelector('.scramble');
    if (scrambleEl) {
        const sc = new TextScramble(scrambleEl);
        const phrases = ['DISPONIBLE PARA PROYECTOS', 'OPEN FOR BUSINESS', 'AUTOMATIZACIÓN CON IA', 'ERICK NAVARRO'];
        let counter = 0;
        const nextPhrase = () => {
            sc.setText(phrases[counter]).then(() => {
                setTimeout(nextPhrase, 3000);
            });
            counter = (counter + 1) % phrases.length;
        };
        setTimeout(nextPhrase, 2000);
    }

    // ─── HERO ENTRANCE ANIMATION (GSAP) ───
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTl
        .to('.hero h1 .line-inner', {
            y: 0,
            duration: 1.2,
            stagger: 0.12,
            delay: 0.3
        })
        .to('.hero-badge', { opacity: 1, duration: 0.8 }, '-=0.6')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

    // ─── SUBTLE TILT (kept only on testimonials/why-cards, disabled on mobile) ───
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -3;
                const rotateY = (x - centerX) / centerX * 3;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
                card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => card.style.transition = '', 400);
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = '';
            });
        });
    }

    // ─── MAGNETIC BUTTONS ───
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => btn.style.transition = '', 400);
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = '';
        });
    });

    // ─── SCROLL ANIMATIONS (GSAP ScrollTrigger) ───

    // Services cards
    gsap.utils.toArray('.s-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 60,
            rotateX: -10,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // ─── COUNTER ANIMATION ───
    let countersTriggered = false;
    ScrollTrigger.create({
        trigger: '.results',
        start: 'top 60%',
        onEnter: () => {
            if (countersTriggered) return;
            countersTriggered = true;
            document.querySelectorAll('.r-num').forEach(el => {
                const target = parseInt(el.dataset.target);
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                const obj = { val: 0 };

                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = prefix + Math.round(obj.val) + suffix;
                    }
                });
            });
        }
    });

    // Results cards
    gsap.utils.toArray('.r-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            opacity: 0,
            scale: 0.9,
            y: 30,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'back.out(1.5)'
        });
    });

    // Mid CTA band
    gsap.from('.cta-mid-inner', {
        scrollTrigger: { trigger: '.cta-mid', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
    });

    // Testimonials
    gsap.utils.toArray('.test-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0, y: 50, rotateY: -10, duration: 0.7, delay: i * 0.12, ease: 'power3.out'
        });
    });

    // Why me cards
    gsap.utils.toArray('.why-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0, y: 40, scale: 0.95, duration: 0.6, delay: i * 0.1, ease: 'back.out(1.5)'
        });
    });

    // CTA section
    gsap.from('.cta-content', {
        scrollTrigger: { trigger: '.cta', start: 'top 60%' },
        opacity: 0, y: 50, scale: 0.95, duration: 1, ease: 'power3.out'
    });

    // Guarantee
    gsap.from('.guarantee', {
        scrollTrigger: { trigger: '.guarantee', start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
    });

    // ─── MOBILE NAV ───
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    mobileToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 0 },
                    duration: 1,
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // ─── SECTION LABEL ANIMATIONS ───
    gsap.utils.toArray('.label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: { trigger: label, start: 'top 85%' },
            opacity: 0, x: -30, duration: 0.6, ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.heading').forEach(h => {
        gsap.from(h, {
            scrollTrigger: { trigger: h, start: 'top 85%' },
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.subtext').forEach(s => {
        gsap.from(s, {
            scrollTrigger: { trigger: s, start: 'top 85%' },
            opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power3.out'
        });
    });

})();
