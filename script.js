document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animation Library (Refined & Immediate for Visibility)
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: true,
                offset: 20,
                duration: 600,
                easing: 'ease-out-quad',
                disable: window.innerWidth < 768
            });
            // Force a refresh after layout settles
            setTimeout(() => AOS.refresh(), 500);
        }
    };

    // Initialize immediately to ensure banner visibility
    initAOS();

    // Priority load for visual elements, then idle for others
    const scheduleInitialInfo = () => {
        // Refresh AOS on window load and after layout is fully calculated
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
            setTimeout(() => AOS.refresh(), 2000);
        }

        const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 500));
        idleCallback(() => {
            initObservers();
        });
    };

    // Safety fallback: if AOS fails to reveal elements, show them anyway after a delay
    setTimeout(() => {
        document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
            el.classList.add('aos-animate');
        });
    }, 4000);

    // Refresh AOS on scroll to handle content-visibility sections
    let aosScrollTimeout;
    window.addEventListener('scroll', () => {
        if (typeof AOS !== 'undefined' && !aosScrollTimeout) {
            aosScrollTimeout = setTimeout(() => {
                AOS.refresh();
                aosScrollTimeout = null;
            }, 500);
        }
    }, { passive: true });

    if (document.readyState === 'complete') {
        scheduleInitialInfo();
    } else {
        window.addEventListener('load', scheduleInitialInfo, { once: true });
    }

    // 2. Preloader Removal (Optimized)
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 300);
        }
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader, { once: true });
    }

    // 3. Navbar scroll effect (Throttled)
    const navbar = document.getElementById('mainNav');
    let scrollTimeout;
    const toggleNavbarState = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                toggleNavbarState();
                scrollTimeout = null;
            }, 100);
        }
    }, { passive: true });

    // 4. Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 5. Intersection Observers (Moved to a function for deferred init)
    const initObservers = () => {
        const sections = document.querySelectorAll('section[id], div[id]');
        const allNavLinks = document.querySelectorAll('#mainNav .nav-link');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    allNavLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });

        sections.forEach(section => sectionObserver.observe(section));

        // Counter Observer
        const counters = document.querySelectorAll('.counter-value');
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(counter => counterObserver.observe(counter));
    };

    // 6. Optimized Counter Animation (requestAnimationFrame)
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const originalText = counter.innerText;
        const suffix = originalText.replace(/[0-9]/g, '');
        const duration = 1500;
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentCount = Math.floor(progress * target);

            counter.innerText = currentCount + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = target + suffix;
            }
        };

        window.requestAnimationFrame(step);
    };

    // 7. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 8. Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            emailjs.sendForm('service_g4tj7ba', 'template_vdae36f', this)
                .then(() => {
                    if (typeof gtag === 'function') {
                        gtag('event', 'generate_lead', {
                            'event_callback': () => window.location.href = 'thank-you.html'
                        });
                        setTimeout(() => { if (!window.location.href.includes('thank-you.html')) window.location.href = 'thank-you.html'; }, 1000);
                    } else {
                        window.location.href = 'thank-you.html';
                    }
                }, (error) => {
                    console.error('FAILED...', error);
                    alert("Email failed to send.");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                });
        });
    }

    // 9. Mouse Parallax (Optimized)
    const hero = document.getElementById('hero');
    if (hero && window.innerWidth >= 992) {
        const orb1 = document.getElementById('orb1');
        const orb2 = document.getElementById('orb2');
        const mainGlow = document.getElementById('mainGlow');

        let ticking = false;
        hero.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const { clientX, clientY } = e;
                    const x = clientX / window.innerWidth;
                    const y = clientY / window.innerHeight;

                    if (orb1) orb1.style.transform = `translate3d(${x * 60}px, ${y * 60}px, 0)`;
                    if (orb2) orb2.style.transform = `translate3d(${(1 - x) * 50}px, ${(1 - y) * 50}px, 0)`;
                    if (mainGlow) {
                        mainGlow.style.transform = `translate3d(${(x - 0.5) * 40}px, ${(y - 0.5) * 40}px, 0) translate(-50%, -50%)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 10. Update Footer Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

