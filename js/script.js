document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navUl = document.querySelector('.nav ul');
    const navLinks = document.querySelectorAll('.nav a');

    if (mobileToggle && navUl) {
        mobileToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navUl.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(7, 7, 10, 0.95)';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
            } else {
                header.style.background = 'rgba(7, 7, 10, 0.85)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // --- Tabs Functionality ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const targetId = btn.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // --- Accordion Functionality ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const body = item.querySelector('.accordion-body');

                const allItems = document.querySelectorAll('.accordion-item');
                allItems.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('active');
                        i.querySelector('.accordion-body').style.maxHeight = null;
                    }
                });

                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    body.style.maxHeight = body.scrollHeight + "px";
                } else {
                    body.style.maxHeight = null;
                }
            });
        });

        // Open first on load
        const firstAccordionItem = document.querySelector('.accordion-item.active');
        if (firstAccordionItem) {
            const body = firstAccordionItem.querySelector('.accordion-body');
            body.style.maxHeight = body.scrollHeight + "px";
        }
    }

    // --- Scroll Top Button ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
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
    }

    // --- Stats Counter Animation ---
    const statNums = document.querySelectorAll('.stat-num');
    let hasAnimated = false;

    if (statNums.length > 0) {
        const animateCounters = () => {
            statNums.forEach(stat => {
                const target = +stat.getAttribute('data-val');
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current) + "+";
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.innerText = target + "+";
                        if (target === 99 || target === 100) {
                            stat.innerText = target + "%"; // hacky fix to keep the % sign for specific counters
                        }
                    }
                };
                updateCounter();
            });
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        }, { threshold: 0.5 });

        observer.observe(document.querySelector('.stats'));
    }

    // --- Swiper Slider Initialization ---
    if (typeof Swiper !== 'undefined' && document.querySelector('.portfolio-swiper')) {
        new Swiper('.portfolio-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // --- Form Validation ---
    const form = document.getElementById('mainForm');
    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');

        form.addEventListener('submit', function (e) {
            let isValid = true;
            nameInput.parentElement.classList.remove('error');
            emailInput.parentElement.classList.remove('error');

            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('error');
                document.getElementById('nameError').innerText = 'Please enter your name';
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                nameInput.parentElement.classList.add('error');
                document.getElementById('nameError').innerText = 'Name must be at least 2 characters';
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                emailInput.parentElement.classList.add('error');
                document.getElementById('emailError').innerText = 'Please enter your email';
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                document.getElementById('emailError').innerText = 'Please enter a valid email address';
                isValid = false;
            }

            if (!isValid) { e.preventDefault(); }
        });
    }
});

// --- Pre-select Plan ---
window.selectPlan = function (planName) {
    const planSelect = document.getElementById('plan');
    if (planSelect) {
        for (let i = 0; i < planSelect.options.length; i++) {
            if (planSelect.options[i].value.includes(planName)) {
                planSelect.selectedIndex = i;
                break;
            }
        }
    }
};
