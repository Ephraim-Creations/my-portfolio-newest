// WhatsApp Configuration - REPLACE WITH YOUR ACTUAL WHATSAPP NUMBER
const WHATSAPP_NUMBER = '112268873'; // Format: country code + number (no spaces or symbols)
const COUNTRY_CODE = '254'; // Your country code

class BookingForm {
  constructor() {
    this.form = document.getElementById('bookingForm');
    this.successMessage = document.getElementById('successMessage');
    this.submitBtn = this.form.querySelector('.submit-btn');
    this.btnText = this.submitBtn.querySelector('.btn-text');
    this.btnLoading = this.submitBtn.querySelector('.btn-loading');
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.setMinDate();
  }
  
  setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    this.setLoading(true);
    
    try {
      const formData = this.getFormData();
      await this.sendToWhatsApp(formData);
      this.showSuccess();
      this.form.reset();
    } catch (error) {
      console.error('Error sending booking:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }
  
  validateForm() {
    const requiredFields = this.form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showError(field, 'This field is required');
        isValid = false;
      } else {
        this.clearError(field);
      }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField.value && !this.isValidEmail(emailField.value)) {
      this.showError(emailField, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField.value && !this.isValidPhone(phoneField.value)) {
      this.showError(phoneField, 'Please enter a valid phone number');
      isValid = false;
    }
    
    return isValid;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  isValidPhone(phone) {
    // Basic phone validation - adjust as needed
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
  
  showError(field, message) {
    this.clearError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    
    field.style.borderColor = '#ef4444';
    field.parentNode.appendChild(errorElement);
  }
  
  clearError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }
  
  getFormData() {
    return {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      message: document.getElementById('message').value
    };
  }
  
  async sendToWhatsApp(formData) {
    const message = this.formatMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${COUNTRY_CODE}${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Simulate API call delay for better UX
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  formatMessage(formData) {
    const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `📅 New Scheduled consultaion

👤 Customer Information:
• Name: ${formData.firstName} ${formData.lastName}
• Email: ${formData.email}
• Phone: ${formData.phone}

📋 Service Details:
• Service: ${formData.service}
• Preferred Date: ${formattedDate}
• Preferred Time: ${formData.time}

💬 Additional Message:
${formData.message || 'No additional message'}

---
This booking was submitted via website form.`;
  }
  
  setLoading(loading) {
    if (loading) {
      this.btnText.style.display = 'none';
      this.btnLoading.style.display = 'block';
      this.submitBtn.disabled = true;
    } else {
      this.btnText.style.display = 'block';
      this.btnLoading.style.display = 'none';
      this.submitBtn.disabled = false;
    }
  }
  
  showSuccess() {
    this.form.style.display = 'none';
    this.successMessage.style.display = 'block';
    
    // Auto-hide success message after 5 seconds and show form again
    setTimeout(() => {
      this.successMessage.style.display = 'none';
      this.form.style.display = 'flex';
    }, 5000);
  }
}

// Initialize the booking form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookingForm();
});

// Additional utility function for phone number formatting
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
}

