document.addEventListener('DOMContentLoaded', () => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

            // --- Function to trigger the Matrix/Glitch effect ---
            const runGlitch = (element) => {
                const originalText = element.dataset.text;
                let iteration = 0;
                let interval = setInterval(() => {
                    element.innerText = originalText
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return originalText[index];
                            }
                            return letters[Math.floor(Math.random() * letters.length)];
                        })
                        .join("");

                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                    }
                    iteration += 1 / 3;
                }, 30);
                return interval;
            };

            // --- 1. Matrix Glitch Effect for H2 on Page Load ---
            const subtitle = document.getElementById('hero-subtitle');
            if (subtitle) {
                // Auto-run once on page load ONLY (Hover event listener removed)
                runGlitch(subtitle);
            }

            // --- 2. Active Nav Link Logic ---
            const sections = document.querySelectorAll('.section-watch');
            const navLinks = document.querySelectorAll('.nav-link');

            window.addEventListener('scroll', () => {
                let current = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (scrollY >= (sectionTop - 150)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('active');
                    }
                });
            });

            // --- 3. Glitch Button Hover Effect Logic ---
            const glitchButtons = document.querySelectorAll('.glitch-btn');

            glitchButtons.forEach(btn => {
                const textElement = btn.querySelector('.glitch-text');
                const originalText = btn.dataset.text;
                let interval = null;

                btn.addEventListener('mouseenter', event => {
                    let iteration = 0;
                    clearInterval(interval);

                    interval = setInterval(() => {
                        textElement.innerText = originalText
                            .split("")
                            .map((letter, index) => {
                                if (index < iteration) {
                                    return originalText[index];
                                }
                                return letters[Math.floor(Math.random() * letters.length)];
                            })
                            .join("");

                        if (iteration >= originalText.length) {
                            clearInterval(interval);
                        }

                        iteration += 1 / 3;
                    }, 30);
                });

                btn.addEventListener('mouseleave', () => {
                    clearInterval(interval);
                    textElement.innerText = originalText;
                });
            });

            // --- 4. Scroll Reveal Animation Logic ---
            const revealElements = document.querySelectorAll('.reveal');

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            });

            revealElements.forEach(el => revealObserver.observe(el));

            // --- 5. Modal Form Logic ---
            const modal = document.getElementById("contactModal");
            const openBtn = document.getElementById("openContactModal");
            const closeSpan = document.querySelector(".close-modal");

            // Open modal when clicking the button
            openBtn.addEventListener("click", (e) => {
                e.preventDefault();
                modal.classList.add("show");
            });

            // Close modal when clicking the "X"
            closeSpan.addEventListener("click", () => {
                modal.classList.remove("show");
            });

            // Close modal when clicking anywhere outside of it
            window.addEventListener("click", (e) => {
                if (e.target === modal) {
                    modal.classList.remove("show");
                }
            });

            // --- 6. Formspree Submission Logic with Glitch Effect ---
            document.getElementById("quickContactForm").addEventListener("submit", async (e) => {
                e.preventDefault(); // Prevents the page from refreshing

                const submitBtn = e.target.querySelector('button');

                // Trigger Glitch Effect for "Sending..."
                submitBtn.dataset.text = "Sending...";
                // Clear any running interval to prevent overlap
                if (submitBtn.glitchInterval) clearInterval(submitBtn.glitchInterval);
                submitBtn.glitchInterval = runGlitch(submitBtn);

                submitBtn.disabled = true; // Prevent multiple clicks

                // Package the form data
                const formData = new FormData();
                formData.append("name", document.getElementById("senderName").value);
                formData.append("email", document.getElementById("senderEmail").value);
                formData.append("message", document.getElementById("senderMessage").value);

                try {
                    // Send the data to Formspree
                    const response = await fetch('https://formspree.io/f/xwvwanbj', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        alert("Thanks for your message! I will get back to you soon.");
                        modal.classList.remove("show"); // Close the modal
                        e.target.reset(); // Clear the inputs
                    } else {
                        alert("Oops! There was a problem submitting your form.");
                    }
                } catch (error) {
                    alert("Oops! Something went wrong. Please check your internet connection.");
                } finally {
                    // Trigger Glitch Effect back to "Send Message"
                    submitBtn.dataset.text = "Send Message";
                    if (submitBtn.glitchInterval) clearInterval(submitBtn.glitchInterval);
                    submitBtn.glitchInterval = runGlitch(submitBtn);

                    submitBtn.disabled = false; // Re-enable button
                }
            });
        });