// Main JavaScript for Deeksha's Portfolio
// Handles navigation, theme toggle, scroll effects, and general UI interactions

(function () {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTop');
    const header = document.querySelector('.header');

    // ============================================
    // Smooth Scroll Helper
    // ============================================
    // Custom easing function (easeInOutCubic) for luxurious feel
    const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    // Core animation engine
    const smoothScrollTo = (targetPosition, duration = 1500) => {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + (distance * ease));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    };

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function initMobileMenu() {
        if (!mobileMenu || !navMenu) return;

        mobileMenu.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileMenu.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenu.contains(event.target);

            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================
    // Smooth Scrolling
    // ============================================
    function initSmoothScrolling() {
        const handleScrollClick = (e, link) => {
            const href = link.getAttribute('href');
            // Only handle internal links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    // Calculate precise position
                    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

                    smoothScrollTo(targetPosition, 1500); // 1.5s duration
                }
            }
        };



        navLinks.forEach(link => {
            link.addEventListener('click', (e) => handleScrollClick(e, link));
        });

        // Handle scroll-down button
        const scrollDownBtn = document.querySelector('.scroll-down a');
        if (scrollDownBtn) {
            scrollDownBtn.addEventListener('click', (e) => handleScrollClick(e, scrollDownBtn));
        }

        // Handle Back-to-Top with same slow effect
        if (scrollTopBtn) {
            // Re-attaching logic is handled in initScrollToTop
        }
    }

    // ============================================
    // Active Navigation Link Highlighting
    // ============================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for better UX

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function handleHeaderScroll() {
        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ============================================
    // Scroll to Top Button
    // ============================================
    function initScrollToTop() {
        if (!scrollTopBtn) return;

        // Show/hide scroll to top button
        function toggleScrollTopBtn() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollTo(0, 1500); // 1.5s slow smooth scroll to top
        });

        // Initial check
        toggleScrollTopBtn();

        // Update on scroll
        window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
    }

    // ============================================
    // Loading State
    // ============================================
    function removeLoadingState() {
        // Remove loading state from body after page loads
        setTimeout(() => {
            document.body.classList.remove('loading-state');
        }, 100);
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections and cards
        const elementsToAnimate = document.querySelectorAll(
            '.section, .skill-card, .education-card, .timeline-item, .contact-container'
        );

        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // Scroll Event Listener
    // ============================================
    function initScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateActiveNavLink();
                    handleHeaderScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // Initialize All Functions
    // ============================================
    function init() {
        removeLoadingState();
        initMobileMenu();
        initSmoothScrolling();
        initScrollToTop();
        initScrollAnimations();
        initScrollListener();

        // Initial calls
        updateActiveNavLink();
        handleHeaderScroll();
    }

    // ============================================
    // Start Everything When DOM is Ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
