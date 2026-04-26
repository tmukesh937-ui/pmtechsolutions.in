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

            // Try to send via PHP, but redirect regardless of result
            fetch('send.php', {
                method: 'POST',
                body: formData
            })
                .then(() => {
                    window.location.href = 'thank-you.html';
                })
                .catch(() => {
                    // PHP not available (file://) — still show thank-you
                    window.location.href = 'thank-you.html';
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

    if (hero) {
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

    // 9. Custom Cursor Animation
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Move Dot Immediately
            cursorDot.style.transform = `translate(${posX - 4}px, ${posY - 4}px)`;

            // Smoothly move outline with slight delay for premium feel
            setTimeout(() => {
                cursorOutline.style.transform = `translate(${posX - 15}px, ${posY - 15}px)`;
            }, 50);
        });

        // Add hover effects for all interactive elements
        const targets = document.querySelectorAll('a, button, .glass-card, .portfolio-item');
        targets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
                cursorDot.style.transform += ' scale(1.5)';
            });
            target.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
            });
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
