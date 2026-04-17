# Particle Network — Canvas 2D Implementation

## Core Concept
A field of particles that drift slowly, connect to nearby neighbors with lines, and react to mouse position. Creates a "neural network" or "data mesh" aesthetic.

## Implementation Pattern

```javascript
class ParticleNetwork {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: options.mouseRadius || 150 };
        this.particleCount = options.count || 80;
        this.connectionDistance = options.connectionDistance || 120;
        this.particleColor = options.particleColor || '255, 77, 0';
        this.lineColor = options.lineColor || '255, 77, 0';
        this.speed = options.speed || 0.3;
        
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.speed,
                vy: (Math.random() - 0.5) * this.speed,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update & draw particles
        for (const p of this.particles) {
            // Mouse repulsion
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.vx += (dx / dist) * force * 0.2;
                    p.vy += (dy / dist) * force * 0.2;
                }
            }
            
            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;
            
            // Move
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.particleColor}, 0.6)`;
            this.ctx.fill();
        }
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.connectionDistance) {
                    const alpha = 1 - (dist / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(${this.lineColor}, ${alpha * 0.15})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
        
        // Mouse connections
        if (this.mouse.x !== null) {
            for (const p of this.particles) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const alpha = 1 - (dist / this.mouse.radius);
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(${this.lineColor}, ${alpha * 0.3})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}
```

## Usage
```javascript
const canvas = document.getElementById('particleCanvas');
new ParticleNetwork(canvas, {
    count: 80,           // particles (reduce to 40 on mobile)
    connectionDistance: 120,
    mouseRadius: 150,
    particleColor: '255, 77, 0',
    lineColor: '255, 77, 0',
    speed: 0.3
});
```

## Performance Notes
- Keep particle count under 100 on desktop, 40 on mobile
- Connection check is O(n²) — acceptable up to ~150 particles
- Use `devicePixelRatio` for sharp rendering on retina displays
- Canvas should be `position: fixed` behind content with `pointer-events: none` (except for mouse tracking)
