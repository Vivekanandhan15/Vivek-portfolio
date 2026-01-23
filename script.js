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
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

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

// Contact Form
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

submitBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        formStatus.textContent = 'Message sent successfully ✅';
        setTimeout(() => {
            formStatus.textContent = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        }, 3000);
    }
});

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