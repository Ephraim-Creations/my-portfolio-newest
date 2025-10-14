        // Mobile Navigation Toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        });



        // Background Animation
        const bgAnimation = document.getElementById('bgAnimation');
        const codeLines = [
            "const innovation = new DigitalTransformation();",
            "function createExcellence() {",
            "  return strategicImplementation();",
            "}",
            "class EphraimWorks {",
            "  constructor() {",
            "    this.expertise = 'full-stack development';",
            "    this.passion = 'digital innovation';",
            "  }",
            "  deliverResults() {",
            "    return exceptionalOutcomes;",
            "  }",
            "}",
            "// Engineering digital excellence",
            "const solution = new ComprehensiveSolution();",
            "solution.architect();",
            "solution.implement();",
            "solution.optimize();"
        ];

        codeLines.forEach((line, index) => {
            const codeLine = document.createElement('div');
            codeLine.className = 'code-line';
            codeLine.textContent = line;
            codeLine.style.top = `${Math.random() * 100}%`;
            codeLine.style.animationDelay = `${index * 3}s`;
            codeLine.style.opacity = `${0.1 + Math.random() * 0.3}`;
            bgAnimation.appendChild(codeLine);
        });

        // Add scroll animations for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.skill-card, .portfolio-item, .blog-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });


        
//back to TOP
  const backToTopBtn = document.getElementById("backToTop");
  let hideTimer;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add("show");

      // Reset hide timer
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        backToTopBtn.classList.remove("show");
      }, 5000);
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  //Animations
    AOS.init({
    once: false,  // keep animating when scrolling
    mirror: true  // animate out as well
  });

  // FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }

    console.log('FAQ accordion initialized successfully!');
});