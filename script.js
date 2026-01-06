document.addEventListener('DOMContentLoaded', () => {
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return; 

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header height
                const headerOffset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

});


const scriptURL = 'https://script.google.com/macros/s/AKfycbzNteru7GWkAepXRSrtXepeQyQvLbwkfl_I_DrDJ0v0hjOQv1Up2n1p-ybvPhhVlMqN/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById('msg')

form.addEventListener('submit', e => {
    e.preventDefault()

    fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => {
        msg.innerHTML = "Message sent successfully ✅"
        setTimeout(() => {
            msg.innerHTML = ""
        }, 5000)
        form.reset()
    })
    .catch(error => {
        console.error('Error!', error.message)
        msg.innerHTML = "Something went wrong ❌"
    })
})


    const toggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
        toggleBtn.textContent = "🌞";
    }

    toggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");

        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌞";
        } else {
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "🌙";
        }
    });

