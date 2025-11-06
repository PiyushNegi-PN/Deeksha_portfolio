// Initialize the contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Show loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    
    // Hide any previous messages
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    
    try {
        // Validate form
        if (!this.checkValidity()) {
            const invalidFields = this.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                invalidFields[0].focus();
                throw new Error('Please fill in all required fields correctly.');
            }
        }
        
        // Make sure emailjs is available
        if (typeof emailjs === 'undefined') {
            throw new Error('Email service is not available. Please try again later.');
        }
        
        // Send the email
        const response = await emailjs.sendForm(
            'service_8zldrlr', 
            'template_a26dh6i', 
            this
        );
        
        if (response.status === 200) {
            // Show success message
            if (successMessage) {
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
            
            // Reset form
            this.reset();
        } else {
            throw new Error('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message with details
        if (errorMessage) {
            const errorMessageText = errorMessage.querySelector('p') || errorMessage;
            errorMessageText.textContent = error.message || 'Failed to send message. Please try again later.';
            errorMessage.style.display = 'block';
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    } finally {
        // Reset button state
        if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        }
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});
