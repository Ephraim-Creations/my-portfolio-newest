// Preloader functionality
document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('site-content');
    const startTime = Date.now();

    function hidePreloader() {
        preloader.classList.add('fade-out');

        setTimeout(() => {
            preloader.style.display = 'none';
            content.classList.remove('content-hidden');

            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    offset: 100,
                    once: true
                });
            }
        }, 500);
    }

    window.addEventListener('load', function () {
        const minDisplayTime = 1500;
        const elapsed = Date.now() - startTime;

        if (elapsed < minDisplayTime) {
            setTimeout(hidePreloader, minDisplayTime - elapsed);
        } else {
            hidePreloader();
        }
    });

    // Hard fallback
    setTimeout(function () {
        if (!preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    }, 5000);
});
