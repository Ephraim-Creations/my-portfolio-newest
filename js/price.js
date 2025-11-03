// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Booking Modal Functionality
const BookingModal = (function() {
    // Elements
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const choosePlanButtons = document.querySelectorAll('.choose-plan');
    const bookingForm = document.getElementById('booking-form');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const loadingMessage = document.getElementById('loading-message');
    const submitBtn = document.getElementById('submit-btn');
    const selectedPlanDisplay = document.getElementById('selected-plan-display');
    const selectedPlanName = document.getElementById('selected-plan-name');
    const selectedPlanDetails = document.getElementById('selected-plan-details');
    const selectedPlanInput = document.getElementById('selected-plan-input');
    const changePlanBtn = document.getElementById('change-plan-btn');
    const confirmationPopup = document.getElementById('confirmation-popup');
    const confirmationOkBtn = document.getElementById('confirmation-ok');

    // State
    let currentPlan = '';
    let currentPlanDetails = '';

    // Initialize event listeners
    function init() {
        // Plan selection
        choosePlanButtons.forEach(button => {
            button.addEventListener('click', handlePlanSelection);
        });

        // Modal controls
        closeModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', handleOutsideClick);
        
        // Form interactions
        changePlanBtn.addEventListener('click', handleChangePlan);
        confirmationOkBtn.addEventListener('click', closeConfirmation);
        
        // Form validation
        emailInput.addEventListener('input', validateEmail);
        phoneInput.addEventListener('input', validatePhone);
        
        // Form submission
        bookingForm.addEventListener('submit', handleFormSubmission);
    }

    // Event Handlers
    function handlePlanSelection(e) {
        e.preventDefault();
        currentPlan = this.getAttribute('data-plan');
        currentPlanDetails = this.getAttribute('data-details');
        updateSelectedPlanDisplay();
        openModal();
    }

    function handleChangePlan() {
        closeModal();
        scrollToPricing();
    }

    function handleOutsideClick(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    }

    // Modal Functions
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }

    function closeConfirmation() {
        confirmationPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Form Functions
    function updateSelectedPlanDisplay() {
        selectedPlanName.textContent = currentPlan;
        selectedPlanDetails.textContent = currentPlanDetails;
        selectedPlanInput.value = currentPlan;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const isValid = email.endsWith('@gmail.com');
        emailError.style.display = isValid ? 'none' : 'block';
        return isValid;
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^\+\d{1,4}\d{7,14}$/;
        const isValid = phoneRegex.test(phone);
        phoneError.style.display = isValid ? 'none' : 'block';
        return isValid;
    }

    function validateForm() {
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        return isEmailValid && isPhoneValid;
    }

    function resetForm() {
        bookingForm.reset();
        loadingMessage.style.display = 'none';
        emailError.style.display = 'none';
        phoneError.style.display = 'none';
        submitBtn.disabled = false;
        currentPlan = '';
        currentPlanDetails = '';
    }

    function submitForm() {
        submitBtn.disabled = true;
        loadingMessage.style.display = 'block';

        const formData = new FormData(bookingForm);

        fetch(bookingForm.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showSuccess();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            handleSubmissionError(error);
        });
    }

    function showSuccess() {
        loadingMessage.style.display = 'none';
        modal.style.display = 'none';
        confirmationPopup.style.display = 'flex';
        resetForm();
    }

    function handleSubmissionError(error) {
        console.error('Error:', error);
        loadingMessage.style.display = 'none';
        alert('There was an error submitting your form. Please try again or contact us directly.');
        submitBtn.disabled = false;
    }

    // Utility Functions
    function scrollToPricing() {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Public API
    return {
        init: init
    };
})();

// Back to Top Functionality
const BackToTop = (function() {
    const backToTopBtn = document.getElementById("backToTop");
    let hideTimer;

    function init() {
        if (!backToTopBtn) return;

        window.addEventListener("scroll", handleScroll);
        backToTopBtn.addEventListener("click", scrollToTop);
    }

    function handleScroll() {
        if (window.scrollY > 200) {
            showButton();
        } else {
            hideButton();
        }
    }

    function showButton() {
        backToTopBtn.classList.add("show");
        clearTimeout(hideTimer);
        
        // Auto-hide after 5 seconds
        hideTimer = setTimeout(() => {
            if (window.scrollY > 200) { // Only hide if still scrolled down
                backToTopBtn.classList.remove("show");
            }
        }, 5000);
    }

    function hideButton() {
        backToTopBtn.classList.remove("show");
        clearTimeout(hideTimer);
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    return {
        init: init
    };
})();

// Smooth Scrolling for Navigation
const SmoothScroll = (function() {
    function init() {
        // Add smooth scrolling to all internal links
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
    }

    return {
        init: init
    };
})();

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    BookingModal.init();
    BackToTop.init();
    SmoothScroll.init();
});

// Fallback initialization for older browsers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        BookingModal.init();
        BackToTop.init();
        SmoothScroll.init();
    });
} else {
    BookingModal.init();
    BackToTop.init();
    SmoothScroll.init();
}