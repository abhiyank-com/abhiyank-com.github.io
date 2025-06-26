document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const homeName = document.querySelector('#home-page .hero-name');
    const homeTagline = document.querySelector('#home-page .hero-tagline');
    const homeButton = document.querySelector('#home-page .btn');
    const codeEditor = document.querySelector('#home-page .code-editor-container');

    // --- Animated Code Typing Effect ---
    const animatedCodeElement = document.getElementById('animated-code');
    const codeSnippets = [
        {
            text: `// Initialize futuristic UI...\n<span class="code-keyword">const</span> <span class="code-variable">ui</span> = <span class="code-keyword">new</span> <span class="code-function-name">FuturisticInterface</span>();\n<span class="code-variable">ui</span>.<span class="code-function-name">renderParticles</span>(<span class="code-number">1000</span>);\n<span class="code-variable">ui</span>.<span class="code-function-name">activateNeuralNetwork</span>();`,
            delay: 100
        },
        {
            text: `// Launching quantum encryption...\n<span class="code-keyword">function</span> <span class="code-function-name">secureConnection</span>(<span class="code-variable">data</span>) {\n  <span class="code-keyword">const</span> <span class="code-variable">encrypted</span> = <span class="code-function-name">QuantumEncrypt</span>(<span class="code-variable">data</span>);\n  <span class="code-keyword">return</span> <span class="code-variable">encrypted</span>;\n}`,
            delay: 90
        },
        {
            text: `// Booting up AI core...\n<span class="code-keyword">async</span> <span class="code-keyword">function</span> <span class="code-function-name">startAICore</span>() {\n  <span class="code-keyword">await</span> <span class="code-variable">loadModels</span>();\n  <span class="code-comment">// AI is now sentient</span>\n  <span class="code-function-name">console</span>.<span class="code-function-name">log</span>(<span class="code-string">"AI Core Online."</span>);\n}`,
            delay: 95
        }
    ];
    let currentSnippetIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function typeCode() {
        if (!animatedCodeElement) return;
        const currentSnippet = codeSnippets[currentSnippetIndex];
        
        if (isDeleting) {
            // Deleting: Remove characters one by one (faster)
            // For simplicity in this demo, we'll clear and move to next to avoid complex HTML parsing for deletion
            animatedCodeElement.innerHTML = ''; 
            currentCharIndex = 0;
            isDeleting = false;
            currentSnippetIndex = (currentSnippetIndex + 1) % codeSnippets.length;
            setTimeout(typeCode, 500); // Pause before typing next
        } else {
            // Typing
            if (currentCharIndex < currentSnippet.text.length) {
                // To correctly render HTML tags as part of the string, we need to append carefully
                // This simplified version appends the whole snippet up to currentCharIndex
                // A more robust solution would parse and append token by token
                animatedCodeElement.innerHTML = currentSnippet.text.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                setTimeout(typeCode, Math.random() * currentSnippet.delay + 50); // Randomize typing speed slightly
            } else {
                // Finished typing this snippet
                isDeleting = true;
                setTimeout(typeCode, 3000); // Wait before deleting
            }
        }
    }


    // --- Interactive Background Canvas (Particles) ---
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color, speed) {
            this.x = x;
            this.y = y;
            this.directionX = directionX * speed;
            this.directionY = directionY * speed;
            this.size = size;
            this.color = color;
            this.baseSpeed = speed;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width + this.size * 2 || this.x < -this.size * 2) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height + this.size * 2 || this.y < -this.size * 2) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.height * canvas.width) / 10000; 
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 0.5; 
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const directionX = (Math.random() * 0.4) - 0.2; 
            const directionY = (Math.random() * 0.4) - 0.2;
            const speed = Math.random() * 0.5 + 0.2; // Individual speed for particles
            const color = `rgba(0, 198, 255, ${Math.random() * 0.4 + 0.2})`; 
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color, speed));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) { // Start b from a + 1
                const distance = Math.sqrt(
                    Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
                    Math.pow(particlesArray[a].y - particlesArray[b].y, 2)
                );
                const connectionDistance = Math.min(canvas.width / 8, 120); // Max connection distance

                if (distance < connectionDistance) { 
                    opacityValue = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(0, 123, 255, ${opacityValue * 0.5})`; 
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }
    
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });


    // --- Page Navigation ---
    function showPage(pageId, isInitialLoad = false) {
        pages.forEach(page => {
            if (page.id === pageId) {
                setTimeout(() => {
                    page.classList.add('active');
                    handleScrollAnimations(page); // Trigger scroll animations for new page
                    if (pageId === 'home-page' && isInitialLoad) { // Trigger homepage animations only on initial load of home
                        triggerHomePageIntroAnimations();
                    }
                }, isInitialLoad ? 50 : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-speed')) * 1000 * 0.5) ); // Adjust delay
            } else {
                page.classList.remove('active');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('nav-active', link.dataset.page === pageId);
        });
        
        if (!isInitialLoad) { // Avoid changing hash if it's the initial load based on hash
             window.location.hash = pageId.replace('-page', '');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            const currentPage = document.querySelector('.page-content.active');
            
            if (currentPage && currentPage.id !== pageId) {
                currentPage.classList.remove('active'); 
                showPage(pageId);
            } else if (!currentPage) { 
                showPage(pageId);
            }
             // Smooth scroll to top of new page content
            const targetPageElement = document.getElementById(pageId);
            if (targetPageElement) {
                // Wait for page to become potentially visible before scrolling
                setTimeout(() => {
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetPageElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-speed')) * 1000 * 0.6);
            }
        });
    });
    
    // --- Homepage Intro Animations ---
    function triggerHomePageIntroAnimations() {
        if(homeName) {
            homeName.style.opacity = '0'; // Reset for animation
            homeName.style.transform = 'translateY(40px)';
            setTimeout(() => { homeName.style.opacity = '1'; homeName.style.transform = 'translateY(0)'; }, 200);
        }
        if(homeTagline) {
            homeTagline.style.opacity = '0';
            homeTagline.style.transform = 'translateY(40px)';
            setTimeout(() => { homeTagline.style.opacity = '1'; homeTagline.style.transform = 'translateY(0)'; }, 500);
        }
         if(codeEditor) {
            codeEditor.style.opacity = '0';
            codeEditor.style.transform = 'translateY(40px) scale(0.95)';
            setTimeout(() => { codeEditor.style.opacity = '1'; codeEditor.style.transform = 'translateY(0) scale(1)'; typeCode(); }, 800); // Start typing after editor appears
        }
        if(homeButton) {
            homeButton.style.opacity = '0';
            homeButton.style.transform = 'translateY(40px)';
            setTimeout(() => { homeButton.style.opacity = '1'; homeButton.style.transform = 'translateY(0)'; }, 1100);
        }
    }

    // --- Initial Page Load from Hash or Default to Home ---
    function loadInitialPage() {
        const hash = window.location.hash.substring(1); 
        let initialPageId = 'home-page';
        if (hash) {
            const potentialPageId = hash + '-page';
            if (document.getElementById(potentialPageId)) {
                initialPageId = potentialPageId;
            }
        }
        showPage(initialPageId, true); // Pass true for isInitialLoad
    }
    loadInitialPage(); 

    // --- Scroll-based Animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: To re-animate every time it scrolls out and back in
                // entry.target.classList.remove('visible'); 
            }
        });
    }, { threshold: 0.1 }); 

    function handleScrollAnimations(container) {
        const elementsToObserve = container.querySelectorAll('.reveal-on-scroll');
        elementsToObserve.forEach(el => {
            el.classList.remove('visible'); // Reset for re-animation if page changes
            revealObserver.observe(el);
        });
    }
    
    // --- Project Card Tilt Effect ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / (rect.height / 2)) * -7; // Max tilt 7 degrees
            const rotateY = (x / (rect.width / 2)) * 7;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // --- Contact Form Handling (Now mainly for FormSubmit) ---
    const contactForm = document.getElementById('contact-form');
    const formMessageDiv = document.getElementById('form-submission-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // FormSubmit will handle the submission.
            // You can add client-side validation here if needed before FormSubmit takes over.
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault(); // Prevent FormSubmit if fields are empty
                formMessageDiv.innerHTML = '<p><strong>Error:</strong> Please fill in all fields before transmitting.</p>';
                formMessageDiv.className = 'error';
                setTimeout(() => { formMessageDiv.innerHTML = ''; formMessageDiv.className = ''; }, 4000);
                return;
            }
            // If using JS to show a message after FormSubmit (requires redirecting back with params or AJAX)
            // For now, FormSubmit's default behavior will take over.
            // You can set a `_next` hidden input to redirect to a custom "thank you" page.
            console.log("Form submitted to FormSubmit.co");
            // Optionally, clear form or show a temporary local message
            // setTimeout(() => { contactForm.reset(); }, 1000); 
        });
    }
    
    // --- Login Form (Visual Only) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Login attempt (visual demo). Username: " + document.getElementById('username').value);
            loginForm.reset();
        });
    }


    // --- Dynamic Year in Footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});