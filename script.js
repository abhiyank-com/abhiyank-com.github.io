// Interactive background with particles and connections
document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup for interactive background
    const canvas = document.getElementById('interactive-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Particles configuration
        const particlesArray = [];
        const numberOfParticles = window.innerWidth < 768 ? 50 : 100;
        const connectionDistance = window.innerWidth < 768 ? 120 : 180;
        
        // Create initial particles
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
            });
        }

        // Animation loop for particles
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 123, 255, 0.5)';
            ctx.strokeStyle = 'rgba(0, 198, 255, 0.1)';
            
            // Update and draw particles
            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                
                // Move particles
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Bounce off edges
                if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
                if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Connect particles within range
                for (let j = i; j < particlesArray.length; j++) {
                    const p2 = particlesArray[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        // Resize canvas when window size changes
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Navigation System
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle for mobile
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Function to show specific page content
    function showPage(pageId, isInitialLoad = false) {
        const allPages = document.querySelectorAll('.page-content');
        allPages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Update navigation active states
        navLinks.forEach(link => {
            link.classList.toggle('nav-active', link.dataset.page === pageId);
        });
        
        if (!isInitialLoad) { // Avoid changing hash if it's the initial load based on hash
            window.location.hash = pageId.replace('-page', '');
        }
    }

    // Set up navigation link event listeners
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
            
            // Close mobile menu if open
            if (hamburgerMenu && hamburgerMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                nav.classList.remove('active');
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
    
    // Homepage Intro Animations
    function triggerHomePageIntroAnimations() {
        const homeName = document.querySelector('.home-name');
        const homeTagline = document.querySelector('.home-tagline');
        const codeEditor = document.querySelector('.code-editor');
        
        if (homeName) {
            homeName.style.opacity = '0'; // Reset for animation
            homeName.style.transform = 'translateY(40px)';
            setTimeout(() => { homeName.style.opacity = '1'; homeName.style.transform = 'translateY(0)'; }, 200);
        }
        
        if (homeTagline) {
            homeTagline.style.opacity = '0';
            homeTagline.style.transform = 'translateY(40px)';
            setTimeout(() => { homeTagline.style.opacity = '1'; homeTagline.style.transform = 'translateY(0)'; }, 500);
        }
        
        if (codeEditor) {
            codeEditor.style.opacity = '0';
            codeEditor.style.transform = 'translateY(40px) scale(0.95)';
            setTimeout(() => { 
                codeEditor.style.opacity = '1'; 
                codeEditor.style.transform = 'translateY(0) scale(1)'; 
                typeCode(); 
            }, 800); // Start typing after editor appears
        }
    }
    
    // Create code-typing animation
    let codeText = '';
    let codeIndex = 0;
    let codeSpeed = 40; // Typing speed in ms
    
    function typeCode() {
        const codeDisplay = document.querySelector('.code-content');
        if (!codeDisplay) return;
        
        codeText = codeDisplay.innerHTML;
        codeDisplay.innerHTML = '';
        codeDisplay.style.display = 'block';
        
        function type() {
            if (codeIndex < codeText.length) {
                codeDisplay.innerHTML += codeText.charAt(codeIndex);
                codeIndex++;
                setTimeout(type, codeSpeed);
            } else {
                codeDisplay.innerHTML = codeText; // Ensure complete code is shown
            }
        }
        
        type();
    }

    // Scroll animation for revealing elements
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    function checkIfInView() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // How many pixels from viewport bottom before revealing
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }
    
    window.addEventListener('scroll', checkIfInView);
    checkIfInView(); // Check on initial load

    // Form submission handling for contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show toast notification
            showToast('Message sent successfully!', 'success');
            
            // Reset the form
            contactForm.reset();
        });
    }
    
    // Toast notification function
    function showToast(message, type = 'info') {
        // Create toast if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            
            const icon = document.createElement('span');
            icon.className = 'toast-icon';
            icon.innerHTML = type === 'success' ? '✅' : 'ℹ️';
            
            const content = document.createElement('div');
            content.className = 'toast-content';
            
            toast.appendChild(icon);
            toast.appendChild(content);
            document.body.appendChild(toast);
        }
        
        // Set toast content
        const toastContent = toast.querySelector('.toast-content');
        if (toastContent) {
            toastContent.textContent = message;
        }
        
        // Show the toast
        toast.classList.add('show');
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Handle URL hash for direct navigation
    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const pageId = hash + '-page';
            const pageElement = document.getElementById(pageId);
            if (pageElement) {
                showPage(pageId, true);
                triggerHomePageIntroAnimations();
            } else {
                // Default to home if hash doesn't match a valid page
                showPage('home-page', true);
                triggerHomePageIntroAnimations();
            }
        } else {
            // Default to home if no hash
            showPage('home-page', true);
            triggerHomePageIntroAnimations();
        }
    }
    
    // Initial page load based on URL hash
    handleHash();
    
    // Handle hash changes while on the page
    window.addEventListener('hashchange', handleHash);
});
