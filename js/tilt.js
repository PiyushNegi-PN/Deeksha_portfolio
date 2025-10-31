document.addEventListener('DOMContentLoaded', function() {
    // Get all cards that should have the tilt effect
    const cards = document.querySelectorAll('.skill-card, .education-card, .project-card, .timeline-content');
    
    // Add tilt effect to each card
    cards.forEach(card => {
        // Add necessary classes
        card.classList.add('tilt-effect');
        
        // Create inner container if it doesn't exist
        if (!card.querySelector('.tilt-inner')) {
            const content = card.innerHTML;
            card.innerHTML = `<div class="tilt-inner">${content}</div>`;
        }
        
        // Add event listeners for tilt effect
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
    
    function handleTilt(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        
        // Get mouse position relative to card
        const mouseX = e.clientX - cardRect.left;
        const mouseY = e.clientY - cardRect.top;
        
        // Calculate center of card
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        
        // Calculate position relative to center (-1 to 1)
        const posX = (mouseX - centerX) / centerX;
        const posY = (mouseY - centerY) / centerY;
        
        // Calculate rotation based on mouse position (limited to 10 degrees)
        const maxTilt = 10; // degrees
        const rotateX = -posY * maxTilt;
        const rotateY = posX * maxTilt;
        
        // Calculate scale (slightly larger when tilted)
        const scale = 1.02;
        
        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        
        // Add shadow based on tilt
        const shadowX = -posX * 15;
        const shadowY = posY * 15;
        const shadowBlur = 20;
        const shadowOpacity = 0.2;
        
        card.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`;
        
        // Add subtle parallax to inner content
        const inner = card.querySelector('.tilt-inner');
        if (inner) {
            inner.style.transform = `translateZ(20px) translateX(${posX * 5}px) translateY(${posY * 5}px)`;
        }
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        
        const inner = this.querySelector('.tilt-inner');
        if (inner) {
            inner.style.transform = 'translateZ(20px)';
        }
    }
});
