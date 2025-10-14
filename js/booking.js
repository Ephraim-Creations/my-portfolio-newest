// Enhanced Booking Form with Background Submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50
        });
    }

    const projectForm = document.getElementById('projectForm');
    const submitBtn = projectForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formControls = document.querySelectorAll('.form-control');
    const formWrapper = document.querySelector('.form-wrapper');

    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div class="success-text">
                <h3>Reservation Received Successfully!</h3>
                <p>Your reservation has been received. We will process it and get in touch with you after approval.</p>
                <p class="success-note"><small>You should receive a confirmation message on WhatsApp shortly.</small></p>
            </div>
            <button class="cta-button success-btn" onclick="location.reload()">
                <i class="fas fa-plus"></i> Make Another Reservation
            </button>
        </div>
    `;
    formWrapper.appendChild(successMessage);

    // Enhanced form validation
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const validationMessage = field.parentNode.querySelector('.validation-message') || createValidationMessage(field);
        
        // Clear previous states
        field.classList.remove('invalid');
        validationMessage.style.display = 'none';
        
        if (isRequired && !value) {
            field.classList.add('invalid');
            validationMessage.textContent = 'This field is required';
            validationMessage.style.display = 'block';
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('invalid');
                validationMessage.textContent = 'Please enter a valid email address';
                validationMessage.style.display = 'block';
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                field.classList.add('invalid');
                validationMessage.textContent = 'Please enter a valid phone number';
                validationMessage.style.display = 'block';
                return false;
            }
        }
        
        return true;
    }

    function createValidationMessage(field) {
        const validationMessage = document.createElement('div');
        validationMessage.className = 'validation-message';
        field.parentNode.appendChild(validationMessage);
        return validationMessage;
    }

    // Real-time validation
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            validateField(this);
        });
        
        control.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
            // Add visual feedback for filled fields
            if (this.value.trim()) {
                this.style.borderColor = 'var(--primary)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });

        // Prevent form zoom on iOS
        if (control.tagName === 'SELECT') {
            control.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        }
    });

    // Function to submit to WhatsApp - More reliable method
    function submitToWhatsApp(formData) {
        return new Promise((resolve) => {
            try {
                const whatsappMessage = `New Project Reservation%0A%0A` +
                    `👤 Name: ${formData.name}%0A` +
                    `📧 Email: ${formData.email}%0A` +
                    `📞 Phone: ${formData.phone || 'Not provided'}%0A` +
                    `🛠️ Service: ${formData.serviceText}%0A` +
                    `💰 Budget: ${formData.budgetText}%0A` +
                    `⏰ Timeline: ${formData.timelineText}%0A` +
                    `📋 Project Details: ${formData.message || 'No additional details provided'}`;

                // Method 1: Try opening in new tab (most reliable)
                const newWindow = window.open(`https://wa.me/254112268873?text=${whatsappMessage}`, '_blank');
                
                // If popup blocked, use method 2
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // Method 2: Create temporary link and click it
                    const tempLink = document.createElement('a');
                    tempLink.href = `https://wa.me/254112268873?text=${whatsappMessage}`;
                    tempLink.target = '_blank';
                    tempLink.style.display = 'none';
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                }

                // Give it a moment to open
                setTimeout(() => {
                    resolve(true);
                }, 500);

            } catch (error) {
                console.error('Error submitting to WhatsApp:', error);
                resolve(false);
            }
        });
    }

    // Enhanced form submission
    projectForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formControls.forEach(control => {
            if (!validateField(control)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Scroll to first invalid field
            const firstInvalid = document.querySelector('.form-control.invalid');
            if (firstInvalid) {
                const invalidPosition = firstInvalid.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: invalidPosition - 100,
                    behavior: 'smooth'
                });
                firstInvalid.focus();
            }
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        btnLoading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing your reservation...';
        submitBtn.disabled = true;

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            serviceText: document.querySelector(`#service option[value="${document.getElementById('service').value}"]`).textContent,
            budget: document.getElementById('budget').value,
            budgetText: document.getElementById('budget').value ? 
                document.querySelector(`#budget option[value="${document.getElementById('budget').value}"]`).textContent : 'Not specified',
            timeline: document.getElementById('timeline').value,
            timelineText: document.getElementById('timeline').value ? 
                document.querySelector(`#timeline option[value="${document.getElementById('timeline').value}"]`).textContent : 'Not specified',
            message: document.getElementById('message').value.trim()
        };

        try {
            // Show processing state
            submitBtn.style.background = 'var(--primary)';
            
            // Simulate processing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Submit to WhatsApp
            const whatsappSuccess = await submitToWhatsApp(formData);
            
            if (whatsappSuccess) {
                // Show success state
                submitBtn.style.background = 'var(--success)';
                btnLoading.innerHTML = '<i class="fas fa-check"></i> Reservation Successful!';
                
                // Wait a moment then show success
                setTimeout(() => {
                    // Hide the form and show success message
                    projectForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Scroll to top of form wrapper to show success message
                    formWrapper.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });

                    // Reset form but keep it hidden
                    projectForm.reset();
                    submitBtn.classList.remove('loading');
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    btnLoading.style.display = 'none';
                    
                    // Reset border colors
                    formControls.forEach(control => {
                        control.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    });
                }, 1000);
                
            } else {
                throw new Error('Failed to submit to WhatsApp');
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error state
            submitBtn.style.background = '#ef4444';
            btnLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error! Please try the WhatsApp link below';
            submitBtn.disabled = false;
            
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.style.background = '';
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                btnLoading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            }, 4000);
        }
    });

    // Enhanced mobile experience
    function enhanceMobileUX() {
        // Prevent zoom on input focus for iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.addEventListener('focus', function(e) {
                if (e.target.matches('input, select, textarea')) {
                    document.body.style.fontSize = '16px';
                }
            }, true);
            
            document.addEventListener('blur', function(e) {
                if (e.target.matches('input, select, textarea')) {
                    document.body.style.fontSize = '';
                }
            }, true);
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize mobile enhancements
    enhanceMobileUX();

    console.log('Booking form enhanced successfully!');
});