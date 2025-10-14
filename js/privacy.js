// Privacy Policy Scroll and Print Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get sidebar and sections
    const sidebar = document.getElementById('privacySidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const policySections = document.querySelectorAll('.policy-section');
    const printButton = document.getElementById('printPolicy');

    // Function to update active nav link
    function updateActiveNav() {
        let currentSection = '';
        
        policySections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // Print functionality
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    // Scroll event listener for sidebar
    window.addEventListener('scroll', function() {
        // Update active nav
        updateActiveNav();
        
        // Add scroll class to sidebar for styling
        if (window.scrollY > 200) {
            sidebar.classList.add('scrolled');
        } else {
            sidebar.classList.remove('scrolled');
        }
    });

    // Initial call to set active nav
    updateActiveNav();
});