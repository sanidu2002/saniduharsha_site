// ===== SCROLL TO TOP ON PAGE LOAD =====
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Ensure page starts at top on refresh/initial load
if (window.location.hash === '' || window.location.hash === '#home') {
    window.scrollTo(0, 0);
}

// ===== MOBILE MENU =====
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger?.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== ACTIVE LINK ON SCROLL =====
const sections = document.querySelectorAll('section');
const navA = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navA.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
function reveal() {
    var reveals = document.querySelectorAll(".reveal, .reveal-up");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
reveal();

// ===== CV DOWNLOAD BUTTON FEEDBACK =====
const downloadBtn = document.querySelector('.btn-download');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        // Add visual feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Optional: Show success message
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
        }, 2000);
    });
}

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate fields
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create mailto link
        const mailtoLink = `mailto:saniduharsha2002@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
        
        // Open mail client
        window.location.href = mailtoLink;
        
        // Show success feedback
        const submitBtn = contactForm.querySelector('.btn-send');
        const originalText = submitBtn.innerHTML;
        const originalBg = submitBtn.style.background;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.disabled = true;
        
        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = originalBg;
            submitBtn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

// ===== FORM INPUT FOCUS EFFECTS =====
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.4)';
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.style.boxShadow = '';
        }
    });
});
