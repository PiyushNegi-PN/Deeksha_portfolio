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
            // Remove old listener first (cloning node is a quick way to wipe listeners if we can't reference original handler easily, 
            // but here we are in same scope, so we just overwrite the behavior if we are careful. 
            // Better: just add the new one and ensure we preventDefault.
            // Since we are inside the init function which runs once, we can just attach our new logic.
            // The previous listener in initScrollToTop used window.scrollTo behavior:smooth.
            // We will intercept it here or assume this runs after. 
            // Ideally we should update initScrollToTop too, but this function only handles nav links usually.
            // Let's rely on modifying initScrollToTop in a separate edit if needed, 
            // OR just handle the specific logic here if possible. 
            // Actually, let's just update the specific scroll top button logic in its own function later 
            // or we can attach a new listener here that stops propagation? 
            // Let's stick to updating the nav links here first.
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
    // Theme Toggle (Dark/Light Mode)
    // ============================================
    function initThemeToggle() {
        if (!themeToggle) return;

        // Check for saved theme preference or default to system preference, then 'light'
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? "dark" : "light");
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        // Toggle theme on button click
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
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
        initThemeToggle();
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
