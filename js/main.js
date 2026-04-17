(function() {
    'use strict';
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    // ─── PARTICLE NETWORK ───
    const pCanvas = document.getElementById('particleCanvas');
    if (pCanvas) {
        const pCtx = pCanvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const COUNT = isMobile ? 35 : 80;
        const DIST = isMobile ? 80 : 130;
        const MRAD = 180;

        function resize() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
        function init() {
            particles = [];
            for (let i = 0; i < COUNT; i++) {
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
                    if (dist < MRAD) {
                        const f = (MRAD - dist) / MRAD;
                        p.vx += (dx/dist) * f * 0.15;
                        p.vy += (dy/dist) * f * 0.15;
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
                pCtx.fillStyle = 'rgba(255,77,0,0.5)';
                pCtx.fill();
            }
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < DIST) {
                        pCtx.beginPath();
                        pCtx.moveTo(particles[i].x, particles[i].y);
                        pCtx.lineTo(particles[j].x, particles[j].y);
                        pCtx.strokeStyle = `rgba(255,77,0,${(1-dist/DIST)*0.12})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.stroke();
                    }
                }
            }
            if (mouse.x !== null) {
                for (const p of particles) {
                    const dx = p.x - mouse.x, dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < MRAD) {
                        pCtx.beginPath();
                        pCtx.moveTo(p.x, p.y);
                        pCtx.lineTo(mouse.x, mouse.y);
                        pCtx.strokeStyle = `rgba(255,140,0,${(1-dist/MRAD)*0.25})`;
                        pCtx.lineWidth = 0.6;
                        pCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        resize(); init(); animate();
        window.addEventListener('resize', () => { resize(); init(); });
        document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    }

    // ─── CURSOR ───
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let ringX = 0, ringY = 0, mx = 0, my = 0;
    if (!isMobile && dot && ring) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx - 4 + 'px';
            dot.style.top = my - 4 + 'px';
        });
        (function followRing() {
            ringX += (mx - ringX) * 0.15;
            ringY += (my - ringY) * 0.15;
            ring.style.left = ringX - 20 + 'px';
            ring.style.top = ringY - 20 + 'px';
            requestAnimationFrame(followRing);
        })();
        document.querySelectorAll('a, button, .card, .tilt-card, .feature-card, .btn, .stack-item').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    // ─── SCROLL PROGRESS ───
    const scrollBar = document.getElementById('scrollProgress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            scrollBar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
        });
    }

    // ─── NAV SCROLL ───
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
    }

    // ─── MOBILE NAV ───
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('active');
        });
        links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        }));
    }

    // ─── MAGNETIC BUTTONS ───
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.3}px,${(e.clientY-r.top-r.height/2)*0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
            setTimeout(() => btn.style.transition = '', 400);
        });
        btn.addEventListener('mouseenter', () => btn.style.transition = '');
    });

    // ─── 3D TILT ───
    document.querySelectorAll('.tilt-card').forEach(card => {
        let angle = 0;
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const rx = (y - r.height/2) / (r.height/2) * -8;
            const ry = (x - r.width/2) / (r.width/2) * 8;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
            const light = card.querySelector('.light');
            if (light) { light.style.left = x-100+'px'; light.style.top = y-100+'px'; }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            setTimeout(() => card.style.transition = '', 500);
        });
        card.addEventListener('mouseenter', () => card.style.transition = '');
        (function rotateBorder() {
            angle += 0.5;
            card.style.setProperty('--angle', angle + 'deg');
            requestAnimationFrame(rotateBorder);
        })();
    });

    // ─── PAGE HERO ANIMATION ───
    const pageHero = document.querySelector('.page-hero');
    if (pageHero) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.to('.page-hero .line-inner', { y: 0, duration: 1.2, stagger: 0.12, delay: 0.2 })
          .to('.page-hero .hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
          .to('.page-hero .hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
    }

    // ─── SCROLL REVEAL for labels/headings/subtext ───
    gsap.utils.toArray('.label').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
    });
    gsap.utils.toArray('.heading').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' });
    });
    gsap.utils.toArray('.subtext').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power3.out' });
    });

    // ─── FEATURE CARDS ANIMATION ───
    gsap.utils.toArray('.feature-card').forEach((c, i) => {
        gsap.from(c, {
            scrollTrigger: { trigger: c, start: 'top 85%' },
            opacity: 0, y: 50, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
        });
    });

    // ─── STEP CARDS ───
    gsap.utils.toArray('.step-card').forEach((c, i) => {
        gsap.from(c, {
            scrollTrigger: { trigger: c, start: 'top 85%' },
            opacity: 0, y: 40, duration: 0.6, delay: i * 0.1, ease: 'power3.out'
        });
    });

    // ─── TIMELINE ITEMS ───
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 85%' },
            opacity: 0, x: -30, duration: 0.6, delay: i * 0.1, ease: 'power3.out'
        });
    });

    // ─── TWO-COL ───
    gsap.utils.toArray('.two-col').forEach(grid => {
        const children = grid.children;
        if (children[0]) gsap.from(children[0], { scrollTrigger: { trigger: grid, start: 'top 75%' }, opacity: 0, x: -40, duration: 0.8, ease: 'power3.out' });
        if (children[1]) gsap.from(children[1], { scrollTrigger: { trigger: grid, start: 'top 75%' }, opacity: 0, x: 40, duration: 0.8, delay: 0.15, ease: 'power3.out' });
    });

    // ─── CTA BANNER ───
    gsap.utils.toArray('.cta-banner').forEach(cta => {
        gsap.from(cta.querySelector('h2'), { scrollTrigger: { trigger: cta, start: 'top 65%' }, opacity: 0, y: 40, scale: 0.95, duration: 0.9, ease: 'power3.out' });
    });

    // ─── FAQ ACCORDION ───
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

})();
