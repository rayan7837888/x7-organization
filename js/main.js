// Main Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', function() {
    // Navigation link activation on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to chat function
    window.scrollToChat = function() {
        const chatSection = document.getElementById('chat');
        if (chatSection) {
            window.scrollTo({
                top: chatSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };
});

// Prevent mobile access
function checkDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for mobile devices
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())) {
        // Show mobile warning but allow access
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff1744;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
            font-weight: bold;
        `;
        warning.textContent = '⚠️ تنبيه: هذا الموقع مُصمم للكمبيوتر فقط. قد تواجه مشاكل في العرض على الجوال.';
        document.body.insertBefore(warning, document.body.firstChild);
        
        // Remove warning after 5 seconds
        setTimeout(() => {
            warning.remove();
        }, 5000);
    }
}

// Check device on page load
window.addEventListener('load', checkDevice);

// Add typing animation to hero
function addTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            subtitle.textContent += text[index];
            index++;
            setTimeout(type, 50);
        }
    }
    
    type();
}

// Run typing animation on page load
window.addEventListener('load', addTypingAnimation);

// Add console welcome message
console.log('%c╔════════════════════════════════════╗', 'color: #00ff00; font-weight: bold;');
console.log('%c║        Welcome to X7               ║', 'color: #00ff00; font-weight: bold;');
console.log('%c║   منظمة سيبرانية متخصصة            ║', 'color: #00ff00; font-weight: bold;');
console.log('%c╚════════════════════════════════════╝', 'color: #00ff00; font-weight: bold;');
console.log('%cالأمان السيبراني أولاً', 'color: #00ff00; font-size: 14px;');