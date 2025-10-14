// AOS Initialization
//document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
  //  AOS.init({
  //      duration: 1000,
  //      once: true,
  //      offset: 100
  //  });

    // Counters setup (added suffix)
    const counters = [
        { id: 'counter1', target: 50, suffix: '+' },
        { id: 'counter2', target: 3, suffix: '' },
        { id: 'counter3', target: 94, suffix: '%' },
        { id: 'counter4', target: 30, suffix: '' }
    ];

    const speed = 200;        // Higher = slower increment speed
    const loopDuration = 2000; // How long the count-up should take
    const pauseDuration = 5000; // 5s pause before restarting

    // Animate a single counter
    function animateCounter(counter, duration) {
        const element = document.getElementById(counter.id);
        const increment = counter.target / (duration / speed);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= counter.target) {
                current = counter.target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (counter.suffix || '');
        }, speed);
    }

    // Animate all counters
    function animateAllCounters() {
        counters.forEach(counter => {
            animateCounter(counter, loopDuration);
        });
    }

    // Loop with pause
    function startCounterLoop() {
        animateAllCounters();
        setInterval(() => {
            animateAllCounters();
        }, loopDuration + pauseDuration); 
    }

    // Trigger when stats section is visible
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounterLoop();
                    observer.unobserve(entry.target); // only start once
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }
            

