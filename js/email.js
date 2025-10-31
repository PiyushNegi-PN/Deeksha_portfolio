// Initialize EmailJS with your public key
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize EmailJS with your public key
        (function() {
            emailjs.init({
                publicKey: '5dYuxXD5cPDBn8OFl',
            });
        })();

        // Handle form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Get the button and change its text
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Send the email
                emailjs.sendForm('service_8zldrlr', 'template_a26dh6i', this)
                    .then(() => {
                        // Show success message
                        document.getElementById('success-message').style.display = 'block';
                        document.getElementById('error-message').style.display = 'none';
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            document.getElementById('success-message').style.display = 'none';
                        }, 5000);
                    })
                    .catch((error) => {
                        console.error('Failed to send message:', error);
                        document.getElementById('error-message').style.display = 'block';
                        document.getElementById('success-message').style.display = 'none';
                        
                        // Hide error message after 5 seconds
                        setTimeout(() => {
                            document.getElementById('error-message').style.display = 'none';
                        }, 5000);
                    })
                    .finally(() => {
                        // Reset button state
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    });
            });
        }
    });
}
