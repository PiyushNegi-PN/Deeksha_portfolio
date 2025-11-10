// Clean hero-anim.js
// Lightweight real-time animator for hero background shapes (parallax + subtle autonomous motion)
(function () {
    try {
        if (typeof window === 'undefined') return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Allow user to override via <html data-force-motion="true"> or global flag
        const forceMotionAttr = document.documentElement.getAttribute('data-force-motion');
        const forced = forceMotionAttr === 'true' || window.HERO_ANIM_FORCE === true;
        console.log('hero-anim: loaded, prefers-reduced-motion =', prefersReduced, 'forced=', forced);

        // start function contains the animator initialization so we can defer or invoke it later
        function startAnimator() {
            // The rest of the original initialization will run here
            initAnimator();
        }

        if (prefersReduced && !forced) {
            console.log('hero-anim: user prefers reduced motion — animator is paused. You can enable it by setting <html data-force-motion="true"> or clicking the "Enable motion" button if available.');
            // Watch for user enabling motion via attribute change
            const mo = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (m.attributeName === 'data-force-motion') {
                        const v = document.documentElement.getAttribute('data-force-motion') === 'true';
                        if (v) {
                            console.log('hero-anim: data-force-motion set — starting animator');
                            mo.disconnect();
                            startAnimator();
                        }
                    }
                }
            });
            mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-force-motion'] });
            return; // exit until user opts in
        }
        // otherwise start immediately
        startAnimator();

    // Move the main initialization into a function so we can start it on demand
        function initAnimator() {
        function q(sel) { return document.querySelector(sel); }
        const s1 = q('.hero-bg .bg-shape.s1');
        const s2 = q('.hero-bg .bg-shape.s2');
        const s3 = q('.hero-bg .bg-shape.s3');
        // optional smaller/medium shapes
        const extras = [
            q('.hero-bg .bg-shape.s4'),
            q('.hero-bg .bg-shape.s5'),
            q('.hero-bg .bg-shape.s6'),
            q('.hero-bg .bg-shape.s7'),
            q('.hero-bg .bg-shape.s8'),
            q('.hero-bg .bg-shape.s9')
        ].filter(Boolean);
        if (!s1 || !s2 || !s3) {
            console.warn('hero-anim: missing primary shape elements; aborting animator');
            return;
        }

        let mouseX = 0, mouseY = 0;
        let winW = window.innerWidth, winH = window.innerHeight;

        window.addEventListener('resize', () => { winW = window.innerWidth; winH = window.innerHeight; });

        // Track mouse/touch for parallax
        function onMove(e) {
            const ev = e.touches ? e.touches[0] : e;
            mouseX = (ev.clientX / winW) * 2 - 1; // -1 .. 1
            mouseY = (ev.clientY / winH) * 2 - 1; // -1 .. 1
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        // also listen for pointermove as a fallback
        window.addEventListener('pointermove', onMove, { passive: true });

        // autonomous oscillation
        let t0 = performance.now();
        // Speed multiplier: increase to make motion faster (1 = normal, 2 = twice as fast)
        const SPEED_MULTIPLIER = 2.0;
        function animate(now) {
            try {
                const t = (now - t0) / 1000 * SPEED_MULTIPLIER; // seconds (scaled)

                // autonomous offsets for primary shapes
                const a1x = Math.sin(t * 1.1) * 28;
                const a1y = Math.cos(t * 1.3) * 22;
                const a2x = Math.sin(t * 1.5 + 1.2) * 34;
                const a2y = Math.cos(t * 1.1 + 0.5) * 28;
                const a3x = Math.sin(t * 0.9 + 2.4) * 42;
                const a3y = Math.cos(t * 1.0 + 1.1) * 34;

                // mouse parallax multipliers (tuned for visible motion)
                const m1 = 40;
                const m2 = 26;
                const m3 = 16;

                const p1x = mouseX * m1 + a1x;
                const p1y = mouseY * m1 + a1y;
                const p2x = mouseX * m2 + a2x;
                const p2y = mouseY * m2 + a2y;
                const p3x = mouseX * m3 + a3x;
                const p3y = mouseY * m3 + a3y;

                // Apply transforms (use translate3d for GPU acceleration)
                s1.style.transform = `translate3d(${p1x}px, ${p1y}px, 0) scale(1.06)`;
                s2.style.transform = `translate3d(${p2x}px, ${p2y}px, 0) scale(1.03)`;
                s3.style.transform = `translate3d(${p3x}px, ${p3y}px, 0) scale(1.02)`;

                // Lightweight parallax/autonomous motion for extra bubbles (subtle)
                if (extras.length) {
                    // multipliers and base amplitudes for extras (one per element)
                    const mExtras = [22, 18, 14, 20, 16, 12];
                    const ampExtras = [18, 14, 12, 20, 15, 10];
                    extras.forEach((el, i) => {
                        const mi = mExtras[i % mExtras.length];
                        const ax = Math.sin(t * (0.8 + i * 0.12) + i) * ampExtras[i % ampExtras.length];
                        const ay = Math.cos(t * (1.0 + i * 0.1) + i * 0.7) * (ampExtras[i % ampExtras.length] * 0.9);
                        const px = mouseX * mi + ax;
                        const py = mouseY * mi + ay;
                        const scl = 1 + 0.02 * (6 - i); // slightly larger scale for earlier extras
                        el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${scl})`;
                        // increase opacity slightly when near center to make them pop
                        try {
                            const dist = Math.hypot(px, py);
                            const o = Math.max(0.12, Math.min(0.5, 0.5 - dist / 600));
                            el.style.opacity = String(o);
                        } catch (e) { /* ignore */ }
                    });
                }

                requestAnimationFrame(animate);
            } catch (err) {
                console.error('hero-anim: error in animate()', err);
            }
        }

        requestAnimationFrame(animate);
    }
    } catch (errOuter) {
        console.error('hero-anim: initialization error', errOuter);
    }
})();

// Time-of-day & theme color setter
(function() {
    function setHeroColorsForHour(hour) {
        // default palettes for morning, afternoon, evening, night
        if (hour >= 6 && hour < 12) {
            // morning
            document.documentElement.style.setProperty('--hero-shape-1', 'rgba(255,200,120,0.95)');
            document.documentElement.style.setProperty('--hero-shape-2', 'rgba(124,211,255,0.88)');
            document.documentElement.style.setProperty('--hero-shape-3', 'rgba(124,58,237,0.85)');
            document.documentElement.style.setProperty('--hero-gradient-a', 'rgba(255,236,209,0.08)');
            document.documentElement.style.setProperty('--hero-gradient-b', 'rgba(255,210,140,0.06)');
        } else if (hour >= 12 && hour < 17) {
            // afternoon
            document.documentElement.style.setProperty('--hero-shape-1', 'rgba(88,166,255,0.95)');
            document.documentElement.style.setProperty('--hero-shape-2', 'rgba(52,211,153,0.92)');
            document.documentElement.style.setProperty('--hero-shape-3', 'rgba(124,58,237,0.90)');
            document.documentElement.style.setProperty('--hero-gradient-a', 'rgba(52,144,220,0.08)');
            document.documentElement.style.setProperty('--hero-gradient-b', 'rgba(88,166,255,0.06)');
        } else if (hour >= 17 && hour < 20) {
            // evening
            document.documentElement.style.setProperty('--hero-shape-1', 'rgba(255,140,110,0.96)');
            document.documentElement.style.setProperty('--hero-shape-2', 'rgba(200,120,255,0.88)');
            document.documentElement.style.setProperty('--hero-shape-3', 'rgba(60,180,200,0.86)');
            document.documentElement.style.setProperty('--hero-gradient-a', 'rgba(255,220,200,0.08)');
            document.documentElement.style.setProperty('--hero-gradient-b', 'rgba(180,120,220,0.06)');
        } else {
            // night
            document.documentElement.style.setProperty('--hero-shape-1', 'rgba(50,100,200,0.95)');
            document.documentElement.style.setProperty('--hero-shape-2', 'rgba(40,140,120,0.92)');
            document.documentElement.style.setProperty('--hero-shape-3', 'rgba(90,40,140,0.90)');
            document.documentElement.style.setProperty('--hero-gradient-a', 'rgba(10,16,40,0.12)');
            document.documentElement.style.setProperty('--hero-gradient-b', 'rgba(30,40,80,0.08)');
        }
    }

    function applyThemeOrTime() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            // Slightly cooler palette for dark theme
            document.documentElement.style.setProperty('--hero-shape-1', 'rgba(80,140,220,0.95)');
            document.documentElement.style.setProperty('--hero-shape-2', 'rgba(40,180,140,0.92)');
            document.documentElement.style.setProperty('--hero-shape-3', 'rgba(120,80,200,0.88)');
            document.documentElement.style.setProperty('--hero-gradient-a', 'rgba(10,24,48,0.12)');
            document.documentElement.style.setProperty('--hero-gradient-b', 'rgba(20,40,80,0.08)');
            return;
        }
        const now = new Date();
        setHeroColorsForHour(now.getHours());
    }

    // initial apply
    applyThemeOrTime();

    // update every 5 minutes in case user keeps the page open
    setInterval(applyThemeOrTime, 5 * 60 * 1000);

    // Observe theme changes on <html data-theme> if present
    const obs = new MutationObserver(() => applyThemeOrTime());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
