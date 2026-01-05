   let currentStep = 1;
    const totalSteps = 3;

    // Check for success parameter in URL
    if (window.location.search.includes('success=true')) {
        document.querySelector('.booking-form').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.querySelectorAll('.progress-step').forEach(step => step.classList.add('active'));
    }

    function nextStep() {
        // Validate current step before proceeding
        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgressIndicator();
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep--;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgressIndicator();
        }
    }

    function updateProgressIndicator() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function validateStep(stepNumber) {
        const stepElement = document.getElementById(`step${stepNumber}`);
        const requiredInputs = stepElement.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous error messages
        stepElement.querySelectorAll('.error-message').forEach(el => el.remove());

        for (const input of requiredInputs) {
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Validate radio groups
        const radioGroups = stepElement.querySelectorAll('.contact-options, .service-categories, .time-options');
        for (const group of radioGroups) {
            const radioName = group.querySelector('input[type="radio"]').name;
            const selected = stepElement.querySelector(`input[name="${radioName}"]:checked`);
            if (!selected) {
                const firstLabel = group.querySelector('label');
                showError(firstLabel, 'Please select an option');
                isValid = false;
            }
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = stepElement.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isValid;
    }

    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.style.fontWeight = '500';
        
        // Insert after the input or its container
        const parent = input.closest('.form-group') || input.parentNode;
        parent.appendChild(errorDiv);
        
        // Add error styling to input
        input.style.borderColor = '#ef4444';
        input.addEventListener('input', function() {
            this.style.borderColor = '';
            errorDiv.remove();
        }, { once: true });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Form submission handling
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        // Validate all steps before submission
        for (let i = 1; i <= totalSteps; i++) {
            if (!validateStep(i)) {
                e.preventDefault();
                // Go to first step with error
                document.getElementById(`step${currentStep}`).classList.remove('active');
                currentStep = i;
                document.getElementById(`step${currentStep}`).classList.add('active');
                updateProgressIndicator();
                return;
            }
        }

        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        
        // Form will submit normally to FormSubmit.co
    });

    // Auto-scroll to success message if success parameter exists
    window.addEventListener('load', function() {
        if (window.location.search.includes('success=true')) {
            document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
        }
    });