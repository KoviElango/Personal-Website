/**
 * APP CONTROLLER
 * Encapsulates all interactions to avoid global scope pollution.
 */
const App = {
    elements: {},

    init() {
        this.elements = {
            cursor: document.getElementById('js-cursor'),
            hoverTriggers: document.querySelectorAll('.js-hover-trigger'),
            menuBtn: document.getElementById('js-menu-btn'),
            mobileMenu: document.getElementById('js-mobile-menu'),
            mobileLinks: document.querySelectorAll('.mobile-link'),
            sections: document.querySelectorAll('section')
        };

        this.initCursor();
        this.initAnimations();
        this.initMobileMenu();
        this.initPortfolio(); 
    },

    initCursor() {
        const { cursor } = this.elements;
        if (!cursor) return;

        // include DIV so large heading blocks and descriptions are considered
        const textTags = new Set(['A','BUTTON','INPUT','TEXTAREA','SELECT','H1','H2','H3','H4','P','SPAN','LI','EM','STRONG','LABEL','DIV']);

        const isValidTarget = (el) => {
            if (!el || el === document || el === document.documentElement || el === cursor) return false;
            // opt-out via helper classes
            if (el.closest && el.closest('.no-cursor-expand')) return false;
            if (el.classList && el.classList.contains('js-no-cursor')) return false;
            // ignore elements that cannot receive pointer events
            if (getComputedStyle(el).pointerEvents === 'none') return false;
            // explicit hover triggers win
            if (el.closest && el.closest('.js-hover-trigger')) return true;
            // common textual / interactive tags
            if (textTags.has(el.tagName)) return true;
            // fallback: elements with only text content
            if (el.childElementCount === 0 && /\S/.test(el.textContent || '')) return true;
            return false;
        };

        let lastActive = false;
        let lastTarget = null;

        // track pointer position and check elements under pointer (handles small text and moving marquee)
        document.addEventListener('mousemove', (e) => {
            // move cursor
            if (window.gsap) {
                gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power2.out" });
            } else {
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            }

            // check all elements stacked under the pointer
            const elements = (document.elementsFromPoint && document.elementsFromPoint(e.clientX, e.clientY)) || [];
            let actionable = false;
            let target = null;
            for (let el of elements) {
                if (isValidTarget(el)) {
                    actionable = true;
                    target = el;
                    break;
                }
            }

            if (actionable && !lastActive) {
                cursor.classList.add('is-active');
                lastActive = true;
                lastTarget = target;
            } else if (!actionable && lastActive) {
                cursor.classList.remove('is-active');
                lastActive = false;
                lastTarget = null;
            } else if (actionable && lastTarget !== target) {
                lastTarget = target;
            }
        }, { passive: true });

        // backward-compatible explicit triggers
        const hoverTriggers = this.elements.hoverTriggers || [];
        if (hoverTriggers && hoverTriggers.length) {
            hoverTriggers.forEach(trigger => {
                trigger.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
                trigger.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
            });
        }
    },

    initAnimations() {
        if (!window.gsap) return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.from("h1", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.2
        });

        const sections = this.elements.sections || [];
        sections.forEach(section => {
            const children = Array.from(section.children || []);
            if (!children.length) return;

            gsap.from(children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out"
            });
        });
    },

    initMobileMenu() {
        const { menuBtn, mobileMenu, mobileLinks } = this.elements;
        if (!menuBtn || !mobileMenu) return;

        const toggleMenu = () => {
            mobileMenu.classList.toggle('is-open');
            const icon = menuBtn.querySelector('i');
            const isOpen = mobileMenu.classList.contains('is-open');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        };

        menuBtn.addEventListener('click', toggleMenu);

        if (mobileLinks && mobileLinks.length) {
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenu.classList.contains('is-open')) toggleMenu();
                });
            });
        }
    },

    /**
     * Portfolio: carousel + canvas particle system
     */
    initPortfolio() {
        // --- Carousel ---
        const slides = document.querySelectorAll('.carousel-slide');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        if (slides && slides.length && nextBtn && prevBtn) {
            let currentSlide = 0;
            const totalSlides = slides.length;
            const updateCarousel = () => {
                slides.forEach(s => s.classList.remove('active'));
                slides[currentSlide].classList.add('active');
            };
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            });
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });
            // autoplay
            setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            }, 6000);
        }

        // --- Canvas particle background ---
        const canvas = document.getElementById('art-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const CONFIG = { particleCount: 50, connectionDist: 140, speed: 0.35, baseColor: '212, 175, 55', glowIntensity: 0.05 };
        let particles = [], w, h;

        function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * w; this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * CONFIG.speed; this.vy = (Math.random() - 0.5) * CONFIG.speed;
                this.size = Math.random() * 1.6 + 0.4;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${CONFIG.baseColor}, 0.7)`; ctx.fill();
            }
        }

        function initParticles() { particles = []; for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle()); }
        function animate() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i]; p.update(); p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < CONFIG.connectionDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${CONFIG.baseColor}, ${(1 - dist/CONFIG.connectionDist) * CONFIG.glowIntensity})`;
                        ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }
};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

