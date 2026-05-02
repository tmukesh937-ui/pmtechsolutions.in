document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animation Library
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out-cubic',
    });

    // 2. Preloader Removal
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 500);
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // 3. Navbar scroll effect
    const navbar = document.getElementById('mainNav');

    const toggleNavbarState = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Initial check and scroll event
    toggleNavbarState();
    window.addEventListener('scroll', toggleNavbarState);

    // 4. Smooth Scrolling for Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Scroll to target
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4b. Active nav link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id], div[id]');
    const allNavLinks = document.querySelectorAll('#mainNav .nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // 5. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 6. Form Submission via AJAX (always shows thank-you page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            contactForm.classList.add('was-validated');

            // Only proceed if form is valid
            if (!contactForm.checkValidity()) return;

            // Show loading state on button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            const formData = new FormData(contactForm);

            // Send via EmailJS
            emailjs.sendForm('service_g4tj7ba', 'template_vdae36f', this)
                .then(() => {
                    console.log('SUCCESS!');
                    // Fire event tracking and redirect to thank-you.html
                    if (typeof gtag === 'function') {
                        gtag('event', 'generate_lead', {
                            'event_category': 'Contact',
                            'event_label': 'Form Submit',
                            'event_callback': function () {
                                window.location.href = 'thank-you.html';
                            }
                        });
                        // Fallback redirect for adblockers
                        setTimeout(() => {
                            if (!window.location.href.includes('thank-you.html')) {
                                window.location.href = 'thank-you.html';
                            }
                        }, 1000);
                    } else {
                        window.location.href = 'thank-you.html';
                    }
                }, (error) => {
                    console.log('FAILED...', error);
                    alert("Email failed to send. Error: " + JSON.stringify(error));
                });
        }, false);
    }

    // 7. Update Footer Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 8. Mouse Parallax for Hero Background
    const hero = document.getElementById('hero');
    const orb1 = document.getElementById('orb1');
    const orb2 = document.getElementById('orb2');
    const mainGlow = document.getElementById('mainGlow');

    // Only run mouse interactive effects on desktop
    if (hero && window.innerWidth >= 992) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = clientX / window.innerWidth;
            const y = clientY / window.innerHeight;

            // Move orbs in different directions/speeds
            if (orb1) orb1.style.transform = `translate(${x * 100}px, ${y * 100}px)`;
            if (orb2) orb2.style.transform = `translate(${(1 - x) * 80}px, ${(1 - y) * 80}px)`;
            // mainGlow uses rotate in CSS, so we follow a similar pattern here
            if (mainGlow) mainGlow.style.marginLeft = `${(x - 0.5) * 50}px`;
            if (mainGlow) mainGlow.style.marginTop = `${(y - 0.5) * 50}px`;
        });
    }



    // 10. Scroll-Triggered Counter Animation
    const counters = document.querySelectorAll('.counter-value');
    const speed = 50; // Faster increment for better visibility

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, {
        threshold: 0.2 // Start when only 20% visible for immediate effect
    });

    counters.forEach(counter => counterObserver.observe(counter));
});
