document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle menu button icon
            const menuIcon = menuToggle.querySelector('.fa-bars, .fa-times');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-times');
            }
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Enhanced smooth scrolling for anchor links with precise section alignment
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's a non-section link
            if (targetId === '#' || targetId === '#!') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
            
            // Get header height for offset
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            // Calculate the target position
            const elementRect = targetElement.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            
            // Calculate scroll position with offset
            const scrollPosition = absoluteElementTop - headerHeight;
            
            // Smooth scroll with easing
            const startPosition = window.pageYOffset;
            const distance = scrollPosition - startPosition;
            const duration = 800; // milliseconds
            let start = null;
            
            // Easing function for smooth acceleration/deceleration
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }
            
            // Animation loop
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);
                const easedPercentage = easeInOutCubic(percentage);
                
                window.scrollTo(0, startPosition + (distance * easedPercentage));
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    // Ensure final position is exact
                    window.scrollTo(0, scrollPosition);
                    // Update URL without adding to history
                    history.replaceState(null, null, targetId);
                }
            }
            
            // Start animation
            window.requestAnimationFrame(step);
        });
    });

    // Sticky header on scroll with shadow
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    // Add shadow class on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            header.classList.remove('shadow');
            return;
        }
        
        // Add shadow when scrolled
        if (currentScroll > 10) {
            header.classList.add('shadow');
        } else {
            header.classList.remove('shadow');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
    
    // Initialize header shadow on page load
    if (window.pageYOffset > 10) {
        header.classList.add('shadow');
    }
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    
    function highlightNav() {
        let scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*=${sectionId}]`).classList.add('active');
            } else {
                const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);
                if (navLink) navLink.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkTimelineItems() {
        const triggerBottom = window.innerHeight * 0.8;
        
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            
            if (itemTop < triggerBottom) {
                item.classList.add('visible');
            }
        });
    }
    
    // Run once on page load
    checkTimelineItems();
    
    // Then run on scroll
    window.addEventListener('scroll', checkTimelineItems);

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }

    // Add animation to skill cards on scroll
    const skillCards = document.querySelectorAll('.skill-card');
    
    function animateOnScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        skillCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            
            if (cardTop < triggerBottom) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state
    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Run once on page load
    animateOnScroll();
    
    // Then run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('fade-in');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.hasAttribute('data-src')) {
                imageObserver.observe(img);
            }
        });
    }

    // Add animation to education cards on scroll
    const educationCards = document.querySelectorAll('.education-card');
    
    function animateEducationCards() {
        const triggerBottom = window.innerHeight * 0.8;
        
        educationCards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            
            if (cardTop < triggerBottom) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }
    
    // Set initial state
    educationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Run once on page load
    animateEducationCards();
    
    // Then run on scroll
    window.addEventListener('scroll', animateEducationCards);

    // Add animation to contact form on scroll
    const contactFormElement = document.querySelector('.contact-form');
    const contactInfo = document.querySelector('.contact-info');
    
    function animateContactSection() {
        const triggerBottom = window.innerHeight * 0.8;
        
        if (contactFormElement) {
            const formTop = contactFormElement.getBoundingClientRect().top;
            if (formTop < triggerBottom) {
                contactFormElement.style.opacity = '1';
                contactFormElement.style.transform = 'translateY(0)';
            }
        }
        
        if (contactInfo) {
            const infoTop = contactInfo.getBoundingClientRect().top;
            if (infoTop < triggerBottom) {
                contactInfo.style.opacity = '1';
                contactInfo.style.transform = 'translateY(0)';
            }
        }
    }
    
    // Set initial state
    if (contactFormElement) {
        contactFormElement.style.opacity = '0';
        contactFormElement.style.transform = 'translateY(30px)';
        contactFormElement.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }
    
    if (contactInfo) {
        contactInfo.style.opacity = '0';
        contactInfo.style.transform = 'translateY(30px)';
        contactInfo.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }
    
    // Run once on page load
    animateContactSection();
    
    // Then run on scroll
    window.addEventListener('scroll', animateContactSection);
});

// Add class to body when page is fully loaded
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
