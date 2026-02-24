/* =============================================
   VIVEKANANDHAN PORTFOLIO — script.js
   Dark Midnight + Violet/Cyan Theme
============================================= */

'use strict';

// ─── Custom Cursor ───────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mX = -100, mY = -100, fX = -100, fY = -100;

document.addEventListener('mousemove', e => {
    mX = e.clientX; mY = e.clientY;
    cursor.style.left = mX + 'px';
    cursor.style.top = mY + 'px';
});

// Smooth follower
(function animateFollower() {
    fX += (mX - fX) * 0.1;
    fY += (mY - fY) * 0.1;
    follower.style.left = fX + 'px';
    follower.style.top = fY + 'px';
    requestAnimationFrame(animateFollower);
})();

// Cursor expand on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-pill, .highlight-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '18px';
        cursor.style.height = '18px';
        follower.style.width = '50px';
        follower.style.height = '50px';
        follower.style.borderColor = 'rgba(124,58,237,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'rgba(124,58,237,0.5)';
    });
});

// ─── Header Scroll Effect ─────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
}, { passive: true });

// ─── Active Nav Link ──────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}

// ─── Hamburger Menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinksEl.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
            s.style.transform = ''; s.style.opacity = '';
        });
    });
});

// ─── Typewriter Effect (Hero Role) ───────────
const roles = ['Software Developer', 'Backend Engineer', 'FastAPI Builder', 'Problem Solver', 'Full-Stack Dev'];
const roleEl = document.getElementById('heroRole');
let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeRole() {
    const word = roles[roleIdx];
    if (isDeleting) {
        roleEl.textContent = word.substring(0, charIdx--);
        if (charIdx < 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(typeRole, 500);
            return;
        }
        setTimeout(typeRole, 60);
    } else {
        roleEl.textContent = word.substring(0, charIdx++);
        if (charIdx > word.length) {
            isDeleting = true;
            setTimeout(typeRole, 2000);
            return;
        }
        setTimeout(typeRole, 100);
    }
}
setTimeout(typeRole, 1000);

// ─── Scroll Reveal ────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.section, .project-card, .highlight-card, .ach-card, .skill-category, .contact-card').forEach(el => {
    el.setAttribute('data-reveal', '');
    revealObserver.observe(el);
});

// ─── Smooth Scroll for all #hash links ────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── Project card tilt effect ─────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotY = ((x - cx) / cx) * 5;
        const rotX = ((cy - y) / cy) * 5;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ─── Contact Form ─────────────────────────────
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
const submitBtn = document.getElementById('submitBtn');

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwAXAr0LFlk6lPNhKJ94r-xzlbOInvkExIDAWpzUmxC-jwkiXJf5Ej8O7WqX8biIJUZ/exec';

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';

        try {
            const data = new FormData(form);
            await fetch(SHEET_URL, { method: 'POST', body: data });
            formMsg.className = 'form-status success';
            formMsg.textContent = '✅ Message sent! I\'ll get back to you soon.';
            form.reset();
        } catch {
            formMsg.className = 'form-status error';
            formMsg.textContent = '❌ Something went wrong. Try emailing me directly.';
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        setTimeout(() => { formMsg.className = 'form-status'; }, 6000);
    });
}

// ─── Skill pill entrance stagger ──────────────
const skillPills = document.querySelectorAll('.skill-pill');
const pillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const pills = entry.target.querySelectorAll('.skill-pill');
            pills.forEach((p, i) => {
                setTimeout(() => {
                    p.style.opacity = '1';
                    p.style.transform = 'translateY(0)';
                }, i * 70);
            });
            pillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(cat => {
    cat.querySelectorAll('.skill-pill').forEach(p => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    pillObserver.observe(cat);
});

// ─── Stats count-up ───────────────────────────
const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-num').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── Parallax orbs (subtle) ───────────────────
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.transform = `translateY(${scrollY * 0.08}px)`;
    if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.05}px)`;
}, { passive: true });
