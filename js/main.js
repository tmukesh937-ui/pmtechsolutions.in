// Initialize Lenis
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
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out'
    });
});

gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(cursorFollower, { x: followerX, y: followerY });
});

// Cursor Hover Effects
const interactives = document.querySelectorAll('a, button, .magnetic, .magnetic-btn, .magnetic-subtle');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// --- Magnetic Elements ---
const magnetics = document.querySelectorAll('.magnetic, .magnetic-btn');
magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.5,
            ease: "power3.out"
        });

        const btnText = btn.querySelector('.btn-text');
        if (btnText) {
            gsap.to(btnText, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.5,
                ease: "power3.out"
            });
        }
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" });
        const btnText = btn.querySelector('.btn-text');
        if (btnText) {
            gsap.to(btnText, { x: 0, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" });
        }
    });
});

// Subtle Magnetic
const subtleMagnetics = document.querySelectorAll('.magnetic-subtle');
subtleMagnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.5,
            ease: "power3.out"
        });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    });
});

// --- Preloader & Initialization ---
window.addEventListener('load', () => {
    document.body.classList.remove('loading');

    const preloaderCounter = document.querySelector('.preloader-counter');
    let counter = { val: 0 };

    const tl = gsap.timeline();

    tl.to(counter, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function () {
            preloaderCounter.innerHTML = Math.round(counter.val) + "%";
        }
    })
        .to('.preloader', {
            yPercent: -100,
            duration: 1.2,
            ease: 'power4.inOut',
            delay: 0.5
        })
        .from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        }, "-=0.5")
        .from('.hero-bottom', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.8");
});

// --- Mobile Navigation ---
const menuToggle = document.querySelector('.menu-toggle');
const closeMenu = document.querySelector('.close-menu');
const mobileNav = document.querySelector('.mobile-nav');
const menuOverlay = document.querySelector('.menu-overlay');

function openMenu() {
    mobileNav.classList.add('active');
    menuOverlay.classList.add('active');
    lenis.stop();
}

function closeMenuFn() {
    mobileNav.classList.remove('active');
    menuOverlay.classList.remove('active');
    lenis.start();
}

menuToggle.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFn);
menuOverlay.addEventListener('click', closeMenuFn);

// --- Smooth Scroll for All Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            // Close mobile menu if active (this restarts Lenis)
            if (mobileNav.classList.contains('active')) {
                closeMenuFn();
            }

            // Use timeout to ensure Lenis is fully started before scrolling
            setTimeout(() => {
                lenis.scrollTo(targetElement, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }, 50);
        }
    });
});

// --- Header Scroll Effect ---
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// --- Scroll Animations ---

// About Text Reveal
gsap.to('.reveal-text', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 70%',
    },
    color: '#ffffff',
    duration: 1.5,
    ease: 'power2.out'
});

// Counters
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    gsap.to(counter, {
        scrollTrigger: {
            trigger: counter,
            start: 'top 90%'
        },
        innerHTML: counter.getAttribute('data-target'),
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power1.inOut"
    });
});

// Hero Parallax
gsap.to('.hero-title', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: (i, el) => (1 - parseFloat(el.getAttribute('data-speed'))) * 200
});

// Work Horizontal Scroll (desktop only)
const scrollContainer = document.querySelector('.horizontal-scroll-container');
let workScrollTrigger = null;

function initHorizontalScroll() {
    if (!scrollContainer) return;

    const isMobile = window.innerWidth <= 768;

    // Kill existing ScrollTrigger if any
    if (workScrollTrigger) {
        workScrollTrigger.kill();
        workScrollTrigger = null;
        gsap.set(scrollContainer, { clearProps: "x" });
    }

    if (!isMobile) {
        let scrollWidth = scrollContainer.scrollWidth - window.innerWidth + 100;

        const tween = gsap.to(scrollContainer, {
            x: () => -scrollWidth,
            ease: "none",
            scrollTrigger: {
                trigger: ".work",
                start: "top top",
                end: () => "+=" + scrollWidth,
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        workScrollTrigger = tween.scrollTrigger;
    }
}

initHorizontalScroll();

// Re-initialize on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initHorizontalScroll();
        ScrollTrigger.refresh();
    }, 250);
});

// FAQ Accordion
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');

        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            }
        });

        if (item.classList.contains('active')) {
            item.classList.remove('active');
            content.style.maxHeight = null;
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
        }

        setTimeout(() => ScrollTrigger.refresh(), 500);
    });
});

// Scroll to top
document.querySelector('.scroll-top').addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5 });
});

// --- Abstract 3D WebGL Background ---
function initThreeJS() {
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create an abstract Icosahedron (tech/digital vibe)
    const geometry = new THREE.IcosahedronGeometry(3, 1);

    // Wireframe material for the tech look
    const material = new THREE.MeshBasicMaterial({
        color: 0x7e0ef5,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Inner glowing core
    const innerGeometry = new THREE.IcosahedronGeometry(2.5, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xd100f5,
        transparent: true,
        opacity: 0.1
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Particles around it
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX - windowHalfX) * 0.001;
        targetY = (event.clientY - windowHalfY) * 0.001;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate meshes
        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.001;

        innerMesh.rotation.y -= 0.003;
        innerMesh.rotation.z += 0.002;

        particlesMesh.rotation.y = elapsedTime * 0.05;

        // Smooth mouse follow
        mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
        mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);

        // Scroll interaction
        const scrollY = window.scrollY;
        mesh.position.y = scrollY * 0.001;
        innerMesh.position.y = scrollY * 0.001;
        particlesMesh.position.y = scrollY * 0.002;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        ScrollTrigger.refresh();
    });
}

if (typeof THREE !== 'undefined') {
    initThreeJS();
} else {
    window.addEventListener('load', initThreeJS);
}




// --- Contact Form Submission ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }
        
        contactForm.classList.add('was-validated');

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.innerText;

        btnText.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Note: Replace 'default_service' and 'template_id' 
        // with your actual EmailJS Service ID and Template ID.
        emailjs.sendForm('service_g4tj7ba', 'template_vdae36f', this)
            .then(() => {
                btnText.innerText = 'Successful!';
                submitBtn.style.backgroundColor = '#28a745'; // optional green success color
                submitBtn.style.borderColor = '#28a745';
                setTimeout(() => {
                    window.location.href = 'thankyou.html';
                }, 1500);
            }, (error) => {
                console.error('FAILED...', error);
                alert('Oops! Something went wrong. Please check your EmailJS Service/Template IDs.');
                btnText.innerText = originalText;
                submitBtn.disabled = false;
            });
    });
}