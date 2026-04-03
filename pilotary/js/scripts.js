/*!
* Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    //NEWSLETTER COUNTER
    const BASE_DATE = new Date("2025-06-09"); // 🗓 Start date
    const BASE_COUNT = 8;
    const DAILY_INCREASE = 2;

    function calculateSubscribers() {
        const today = new Date();
        const daysPassed = Math.floor((today - BASE_DATE) / (1000 * 60 * 60 * 24));
        return BASE_COUNT + (daysPassed * DAILY_INCREASE);
    }

    function animateCount(el, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    const el = document.getElementById("subscriber-count");
    const target = calculateSubscribers();

    const observer = new IntersectionObserver(
        (entries, observer) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                animateCount(el, target);
                observer.unobserve(el); // Stop observing after animation starts
            }
        },
        {
            threshold: 0.6, // 60% visible triggers the animation
        }
    );

    observer.observe(el);

    const MAIL_TO = 'hello@paluv.de';

    //NEWSLETTER FORM
    document.getElementById('newsletter-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById('newsletter-email');
        const messageInput = document.getElementById('newsletter-message-input');
        const messageBox = document.getElementById('newsletter-message');
        const successText = messageBox.dataset.successText || '✅ Subscribed! Important: Check your spam folder too.';
        const errorText = messageBox.dataset.errorText || '❌ Something went wrong. Try again later.';
        const networkText = messageBox.dataset.networkText || '❌ Network error. Please try again.';
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!email || !message) return;

        try {
            const res = await fetch('/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: MAIL_TO,
                    subject: 'New newsletter signup',
                    name: 'Newsletter',
                    email,
                    message
                })
            });

            if (res.ok) {
                messageBox.classList.remove('d-none');
                messageBox.classList.remove('alert-danger');
                messageBox.classList.add('alert-success');
                messageBox.textContent = successText;
                emailInput.value = '';
                messageInput.value = '';
            } else {
                messageBox.classList.remove('d-none');
                messageBox.classList.remove('alert-success');
                messageBox.classList.add('alert-danger');
                messageBox.textContent = errorText;
            }
        } catch (err) {
            messageBox.classList.remove('d-none');
            messageBox.classList.remove('alert-success');
            messageBox.classList.add('alert-danger');
            messageBox.textContent = networkText;
        }
    });

    //Contact Form
    document.getElementById('contactForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim()
        };

        const successEl = document.getElementById('submitSuccessMessage');
        const errorEl = document.getElementById('submitErrorMessage');

        try {
            const response = await fetch('/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: MAIL_TO,
                    ...data,
                    subject: 'New contact message'
                })
            });

            if (response.ok) {
                successEl.classList.remove('d-none');
                errorEl.classList.add('d-none');
                form.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            successEl.classList.add('d-none');
            errorEl.classList.remove('d-none');
        }
    });


});
