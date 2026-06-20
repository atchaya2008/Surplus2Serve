/* ============================================
   SURPLUS2SERVE - MAIN SCRIPT
   General functionality across all pages
   ============================================ */

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contactMessageForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!name || !email || !subject || !message) {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.showModal('⚠️ Incomplete Form', 'Please fill all required fields.', 'warning');
            } else {
                alert('Please fill all required fields.');
            }
            return;
        }
        
        // Save message to localStorage
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        console.log('Message saved:', {name, email, subject, message});
        
        // Show success message with modal
        if (typeof notificationManager !== 'undefined') {
            notificationManager.showModal(
                '✅ Message Sent!',
                'Thank you for contacting us! We will get back to you soon.',
                'success',
                {
                    'From': name,
                    'Email': email,
                    'Subject': subject
                }
            );
        } else {
            alert('Thank you for your message! We will get back to you soon.');
        }
        
        contactForm.reset();
    });
}

// Add fade-in animation to elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.process-card, .about-card, .contact-card, .impact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Mobile menu close on link click
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navbarToggler.offsetParent !== null) {
            navbarToggler.click();
        }
    });
});

// Check if user is logged in as admin
function checkAdminStatus() {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    return isAdminLoggedIn === 'true';
}

// Log page visit for analytics
console.log('Surplus2Serve Platform Loaded', {
    timestamp: new Date(),
    page: window.location.pathname
});
