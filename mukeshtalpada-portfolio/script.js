// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Sticky navbar: add blur background after scrolling 80px
lenis.on('scroll', ({ scroll }) => {
    const navEl = document.querySelector('.navbar');
    if (!navEl) return;
    if (scroll > 80) {
        navEl.classList.add('scrolled');
    } else {
        navEl.classList.remove('scrolled');
    }
});

// Custom Cursor Logic (Disable on mobile)
if (window.innerWidth > 992) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0,
            ease: 'none'
        });
        
        gsap.to(follower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Cursor Hover Effects
    const hoverElements = document.querySelectorAll('a, button, .work-image-wrapper, .cta-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}


// Preloader Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    // Animate text up
    tl.to('.preloader-text span', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    })
    // Animate text away
    .to('.preloader-text span', {
        y: -100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.in',
        delay: 0.4
    })
    // Hide preloader background
    .to('.preloader', {
        height: 0,
        duration: 0.8,
        ease: 'power4.inOut'
    })
    // Hero Elements Reveal
    .from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6
    }, "-=0.2")
    .from('.text-reveal', {
        y: 120,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out'
    }, "-=0.4")
    .from('.hero-desc', {
        y: 20,
        opacity: 0,
        duration: 0.6
    }, "-=0.6")
    .from('.scroll-indicator', {
        opacity: 0,
        duration: 1
    }, "-=0.4")
    .from('.navbar', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        clearProps: 'all'  // Remove GSAP inline styles so CSS takes over cleanly
    }, "-=1");
});

// Scroll Animations

// Section Headers Reveal
gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Expertise Cards Reveal (Spring scale effect)
gsap.from('.expertise-card', {
    scrollTrigger: {
        trigger: '.expertise',
        start: 'top 75%',
    },
    y: 80,
    scale: 0.9,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'back.out(1.2)'
});

// Timeline Items Reveal (Swing from left)
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
        },
        x: -50,
        y: 30,
        rotationZ: -3,
        transformOrigin: "left center",
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.5)'
    });
});

// Contact Box Reveal (Expand up)
gsap.from('.contact-content', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
    },
    y: 100,
    scale: 0.95,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out'
});

// Footer Reveal
gsap.from('footer', {
    scrollTrigger: {
        trigger: 'footer',
        start: 'top 95%',
    },
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Marquee Horizontal Scroll effect
gsap.to('.marquee', {
    scrollTrigger: {
        trigger: '.marquee-container',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    },
    xPercent: -20
});

// Smooth scroll for ALL anchor links (desktop + mobile)
// Menu element references (declared here so scroll handler can access them)
const mobileMenu = document.getElementById('mobile-menu');
const navLinksContainer = document.getElementById('nav-links');
const navbar = document.querySelector('.navbar');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSelector = this.getAttribute('href');
        const target = document.querySelector(targetSelector);
        if (!target) return;

        const isMobile = window.innerWidth <= 992;
        const menuIsOpen = navLinksContainer && navLinksContainer.classList.contains('active');

        if (isMobile && menuIsOpen) {
            // Close the mobile menu first, then scroll after animation (matches 600ms CSS transition)
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (navLinksContainer) navLinksContainer.classList.remove('active');
            if (navbar) navbar.classList.remove('menu-open');
            setTimeout(() => {
                lenis.start();
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            }, 650);
        } else {
            // Desktop: scroll immediately
            lenis.scrollTo(target, { offset: -80, duration: 1.4 });
        }
    });
});

// Mobile Menu Toggle
const toggleMenu = (forceClose = false) => {
    const isOpen = navLinksContainer.classList.contains('active');

    if (forceClose || isOpen) {
        // CLOSE
        mobileMenu.classList.remove('active');
        navLinksContainer.classList.remove('active');
        navbar.classList.remove('menu-open');
        lenis.start();
    } else {
        // OPEN
        mobileMenu.classList.add('active');
        navLinksContainer.classList.add('active');
        navbar.classList.add('menu-open');
        lenis.stop();
    }
};

if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
        if (
            navLinksContainer.classList.contains('active') &&
            !navLinksContainer.contains(e.target) &&
            !mobileMenu.contains(e.target)
        ) {
            toggleMenu(true);
        }
    });
}
