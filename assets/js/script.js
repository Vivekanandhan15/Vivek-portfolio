// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close nav on link click
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.querySelector('i').classList.add('fa-bars');
        hamburger.querySelector('i').classList.remove('fa-times');
    });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });
}

// God-Tier Portal Controller
class PortalController {
    constructor(element, type = 'project') {
        this.el = element;
        this.type = type;
        this.title = this.el.querySelector('h3');
        this.liquidMap = document.getElementById('liquid-map');
        this.chips = this.el.querySelectorAll('.tech-chip');
        this.godRay = this.el.querySelector('.god-ray');

        if (this.type === 'project') {
            this.initProject();
        }

        this.el.addEventListener('mousemove', (e) => this.handleMove(e));
        this.el.addEventListener('mouseleave', () => this.handleLeave());
        this.el.addEventListener('mouseenter', () => this.handleEnter());
    }

    initProject() {
        this.el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        // Randomize tech chip explosion targets
        this.chips.forEach(chip => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const z = 150 + Math.random() * 100;
            chip.style.setProperty('--x-pos', `${x}px`);
            chip.style.setProperty('--y-pos', `${y}px`);
            chip.style.setProperty('--z-depth', `${z}px`);
        });
    }

    handleEnter() {
        if (this.title && this.title.classList.contains('glitch-text')) {
            this.title.style.animation = 'none';
            this.title.offsetHeight; // trigger reflow
            this.title.style.animation = null;
        }
    }

    handleMove(e) {
        const rect = this.el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update mouse position variables for CSS
        this.el.style.setProperty('--mouse-x', `${x}px`);
        this.el.style.setProperty('--mouse-y', `${y}px`);

        if (this.type === 'project') {
            const xPercent = (x / rect.width - 0.5) * 2;
            const yPercent = (y / rect.height - 0.5) * 2;

            // 3D Tilt
            const rotateX = yPercent * -20;
            const rotateY = xPercent * 20;
            this.el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

            // Volumetric Ray Tracking
            if (this.godRay) {
                this.el.style.setProperty('--ray-x', `${(x / rect.width) * 100}%`);
                this.el.style.setProperty('--ray-y', `${(y / rect.height) * 100}%`);
            }

            // Magnetic Tech Drift
            this.chips.forEach((chip, i) => {
                const factor = (i + 1) * 5;
                const driftX = xPercent * factor;
                const driftY = yPercent * factor;
                chip.style.transform = `translateZ(var(--z-depth)) translate(calc(var(--x-pos) + ${driftX}px), calc(var(--y-pos) + ${driftY}px)) scale(1)`;
            });

            // Liquid Intensity
            if (this.liquidMap) {
                const intensity = (Math.abs(xPercent) + Math.abs(yPercent)) * 20;
                this.liquidMap.setAttribute('scale', intensity);
            }
        }
    }

    handleLeave() {
        if (this.type === 'project') {
            this.el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            if (this.liquidMap) this.liquidMap.setAttribute('scale', '0');
            this.chips.forEach(chip => {
                chip.style.transform = 'translateZ(0) scale(0.5)';
            });
        }
    }
}

// Initialize for all interactive elements
document.querySelectorAll('.project-card').forEach(el => new PortalController(el, 'project'));
document.querySelectorAll('.skill-card').forEach(el => new PortalController(el, 'skill'));

// Parallax Effect
const heroContent = document.getElementById('heroContent');
const heroVisual = document.getElementById('heroVisual');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallaxOffset = scrollY * 0.5;
    const opacity = Math.max(0, 1 - scrollY / 500);

    heroContent.style.opacity = opacity;
    heroVisual.style.transform = `translateY(${parallaxOffset}px)`;
});

// Carousel with Smooth Scroll Detection and Lock
let currentSlide = 0;
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const totalSlides = 4;
const carouselSection = document.querySelector('#expertise-section');
let isScrolling = false;
let scrollTimeout;
let scrollAwayAttempts = 0;
const scrollAwayThreshold = 2; // Reduced - number of scroll attempts needed to unlock

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Enhanced scroll-based carousel navigation with lock
let accumulatedDelta = 0;
const deltaThreshold = 50;
let allowScrollAway = false;

window.addEventListener('wheel', (e) => {
    const rect = carouselSection.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);

    // Check if section is centered (within 150px of viewport center for better locking)
    const isCentered = distanceFromCenter < 150;

    if (isCentered) {
        // Scrolling down
        if (e.deltaY > 0) {
            if (currentSlide < totalSlides - 1) {
                // Still have slides to show, prevent scroll
                e.preventDefault();
                allowScrollAway = false;
                scrollAwayAttempts = 0;

                if (!isScrolling) {
                    accumulatedDelta += e.deltaY;
                    clearTimeout(scrollTimeout);

                    if (Math.abs(accumulatedDelta) > deltaThreshold) {
                        isScrolling = true;
                        currentSlide++;
                        updateCarousel();
                        accumulatedDelta = 0;

                        setTimeout(() => {
                            isScrolling = false;
                        }, 900);
                    }

                    scrollTimeout = setTimeout(() => {
                        accumulatedDelta = 0;
                    }, 150);
                }
            } else {
                // On last slide - count scroll attempts
                if (!allowScrollAway) {
                    e.preventDefault();
                    scrollAwayAttempts++;

                    // After threshold attempts, allow next scroll to pass through
                    if (scrollAwayAttempts >= scrollAwayThreshold) {
                        allowScrollAway = true;
                        scrollAwayAttempts = 0;
                    }
                }
                // If allowScrollAway is true, don't prevent - let it scroll to next section
            }
        }
        // Scrolling up
        else if (e.deltaY < 0) {
            // Reset scroll away flag when scrolling up
            allowScrollAway = false;
            scrollAwayAttempts = 0;

            // Always prevent scroll up when in carousel section
            e.preventDefault();

            if (currentSlide > 0 && !isScrolling) {
                accumulatedDelta += e.deltaY;
                clearTimeout(scrollTimeout);

                if (Math.abs(accumulatedDelta) > deltaThreshold) {
                    isScrolling = true;
                    currentSlide--;
                    updateCarousel();
                    accumulatedDelta = 0;

                    setTimeout(() => {
                        isScrolling = false;
                    }, 900);
                }

                scrollTimeout = setTimeout(() => {
                    accumulatedDelta = 0;
                }, 150);
            }
        }
    } else {
        accumulatedDelta = 0;
        scrollAwayAttempts = 0;
        allowScrollAway = false;
    }
}, { passive: false });

// Contact Form (Google Sheets Integration)
const scriptURL = 'https://script.google.com/macros/s/AKfycbzNteru7GWkAepXRSrtXepeQyQvLbwkfl_I_DrDJ0v0hjOQv1Up2n1p-ybvPhhVlMqN/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById('msg')

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault()
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                msg.innerHTML = "Message Sent Successfully ✅";
                setTimeout(function () {
                    msg.innerHTML = ""
                }, 5000)
                form.reset()
            })
            .catch(error => {
                console.error('Error!', error.message);
                msg.innerHTML = "Error sending message ❌";
            })
    })
}

// Custom Glass Cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .project-card, .badge-card, .gallery-item, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// Typewriter Effect
const typewriter = document.getElementById('typewriter');
const words = ["Software Developer.", "Problem Solver.", "Fast Learner.", "Tech Enthusiast."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typewriter.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriter.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}
type();

// 3D Tilt Effect
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
});

// Stats Counter
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const count = () => {
                const current = +entry.target.innerText;
                const increment = target / 50;
                if (current < target) {
                    entry.target.innerText = Math.ceil(current + increment);
                    setTimeout(count, 30);
                } else {
                    entry.target.innerText = target + "+";
                }
            };
            count();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Timeline Animation Observer
const timelineItems = document.querySelectorAll('.timeline-item');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay');
            setTimeout(() => {
                entry.target.classList.add('animate-in');
            }, delay * 200);
            timelineObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// --- 3D Fisheye Scroller Logic (Infinite Loop) ---
class FisheyeScroller {
    constructor() {
        this.container = document.querySelector('.fisheye-container');
        this.track = document.getElementById('fisheyeTrack');
        this.originalCards = Array.from(document.querySelectorAll('.milestone-card-3d'));
        this.titleEl = document.getElementById('fisheye-title');
        this.descEl = document.getElementById('fisheye-desc');

        this.cardWidth = this.originalCards[0].offsetWidth + 20; // card + gap
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.autoScrollSpeed = 2.2;
        this.autoScrollActive = true;

        this.init();
    }

    init() {
        // Clone cards for infinite loop - Maintain correct order
        [...this.originalCards].reverse().forEach(card => {
            const clone = card.cloneNode(true);
            this.track.prepend(clone);
        });

        this.originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            this.track.appendChild(clone);
        });

        this.allCards = Array.from(document.querySelectorAll('.milestone-card-3d'));

        // Initial Position (Center of the original set)
        const initialShift = -this.originalCards.length * this.cardWidth;
        this.currentTranslate = initialShift;
        this.prevTranslate = initialShift;

        // Events
        this.track.addEventListener('mousedown', this.dragStart.bind(this));
        this.track.addEventListener('touchstart', this.dragStart.bind(this));
        window.addEventListener('mouseup', this.dragEnd.bind(this));
        window.addEventListener('touchend', this.dragEnd.bind(this));
        window.addEventListener('mousemove', this.dragAction.bind(this));
        window.addEventListener('touchmove', this.dragAction.bind(this));

        this.container.addEventListener('mouseenter', () => this.autoScrollActive = false);
        this.container.addEventListener('mouseleave', () => this.autoScrollActive = true);

        this.allCards.forEach(card => {
            card.querySelector('img')?.addEventListener('dragstart', (e) => e.preventDefault());
        });

        this.animate();
    }

    dragStart(e) {
        this.isDragging = true;
        this.autoScrollActive = false;
        this.startX = this.getPositionX(e);
        this.track.style.transition = 'none';
    }

    dragAction(e) {
        if (!this.isDragging) return;
        const currentX = this.getPositionX(e);
        const diff = currentX - this.startX;
        this.currentTranslate = this.prevTranslate + diff;
    }

    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.prevTranslate = this.currentTranslate;
        setTimeout(() => {
            if (!this.container.matches(':hover')) this.autoScrollActive = true;
        }, 1000);
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    animate() {
        if (this.autoScrollActive && !this.isDragging) {
            this.currentTranslate -= this.autoScrollSpeed;
            this.prevTranslate = this.currentTranslate;
        }

        // Infinite Loop Logic
        const setWidth = this.originalCards.length * this.cardWidth;
        if (this.currentTranslate <= -setWidth * 2) {
            this.currentTranslate += setWidth;
            this.prevTranslate = this.currentTranslate;
        } else if (this.currentTranslate >= 0) {
            this.currentTranslate -= setWidth;
            this.prevTranslate = this.currentTranslate;
        }

        this.updateFisheye();
        requestAnimationFrame(this.animate.bind(this));
    }

    updateFisheye() {
        const containerRect = this.container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;

        this.track.style.transform = `translateX(${this.currentTranslate}px)`;

        this.allCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distanceFromCenter = cardCenter - centerX;
            const normalizedDistance = distanceFromCenter / (containerRect.width / 2);

            const rotation = normalizedDistance * -45;
            const scale = 1 - Math.min(Math.abs(normalizedDistance) * 0.3, 0.3);
            const zTranslate = Math.min(Math.abs(normalizedDistance) * -200, 0);

            card.style.transform = `rotateY(${rotation}deg) scale(${scale}) translateZ(${zTranslate}px)`;
            card.style.opacity = 1 - Math.min(Math.abs(normalizedDistance) * 0.5, 0.7);

            if (Math.abs(distanceFromCenter) < 150) {
                this.titleEl.textContent = card.dataset.title;
                this.descEl.textContent = card.dataset.desc;
            }
        });
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new FisheyeScroller();
});

// Reveal on Scroll
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});