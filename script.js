// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init();
});

// Sticky header functionality
window.onscroll = () => { 
    let header = document.querySelector('.header'); 
    header.classList.toggle('sticky', window.scrollY > 100); 
};

// Toggle icon and navbar for mobile menu
let menuIcon = document.querySelector('#menu-icon'); 
let navbar = document.querySelector('.navbar'); 
menuIcon.onclick = () => { 
    menuIcon.classList.toggle('bx-x'); 
    navbar.classList.toggle('active'); 
}; 

// Close navbar when a nav link is clicked (for mobile)
document.querySelectorAll('.navbar a').forEach(link => { 
    link.addEventListener('click', () => { 
        menuIcon.classList.remove('bx-x'); 
        navbar.classList.remove('active'); 
    }); 
}); 

// Highlight active section in navbar
const sections = document.querySelectorAll('section'); 
const navLinks = document.querySelectorAll('.navbar a'); 
window.addEventListener('scroll', () => { 
    let current = ''; 
    sections.forEach(section => { 
        const sectionTop = section.offsetTop; 
        const sectionHeight = section.clientHeight; 
        if (window.scrollY >= (sectionTop - sectionHeight/3)) { 
            current = section.getAttribute('id'); 
        } 
    }); 
    
    navLinks.forEach(link => { 
        link.classList.remove('active'); 
        if (link.getAttribute('href') === `#${current}`) { 
            link.classList.add('active'); 
        } 
    }); 
}); 

// Contact form submission with validation
$("#submit-form").submit((e) => { 
    e.preventDefault(); 
    
    // Form validation
    const requiredFields = $('#submit-form [required]'); 
    let isValid = true; 
    
    requiredFields.each(function() { 
        if (!$(this).val()) { 
            isValid = false; 
            $(this).addClass('error'); 
            
            // Remove error class after 3 seconds or when user types
            setTimeout(() => {
                $(this).removeClass('error');
            }, 3000);
            
            $(this).on('input', function() {
                $(this).removeClass('error');
            });
        } else { 
            $(this).removeClass('error'); 
        } 
    }); 
    
    // Validate email format
    const emailField = $('#submit-form input[type="email"]');
    if (emailField.val() && !isValidEmail(emailField.val())) {
        isValid = false;
        emailField.addClass('error');
        
        // Remove error class after 3 seconds or when user types
        setTimeout(() => {
            emailField.removeClass('error');
        }, 3000);
        
        emailField.on('input', function() {
            emailField.removeClass('error');
        });
    }
    
    if (!isValid) { 
        showNotification("Please fill all required fields correctly", "error");
        return; 
    } 
    
    // Show loading state
    const submitBtn = $('#submit-form .btn'); 
    const originalText = submitBtn.text(); 
    submitBtn.text('Submitting...'); 
    submitBtn.prop('disabled', true); 
    
    // Collect form data
    const formData = {
        name: $('input[name="FullName"]').val(),
        email: $('input[name="Email"]').val(),
        phone: $('input[name="Phone"]').val(),
        subject: $('input[name="Subject"]').val(),
        message: $('textarea[name="Message"]').val()
    };
    
    // Use Email.js for sending emails (you need to include the Email.js library and set up your account)
    emailjs.send('service_j6gckb7', 'template_p9gilwd', formData)
        .then(function(response) {
            showNotification("Your message has been sent successfully!", "success");
            $('#submit-form')[0].reset();
        }, function(error) {
            showNotification("Failed to send message. Please try again later.", "error");
            console.error('EmailJS error:', error);
        })
        .finally(function() {
            submitBtn.text(originalText);
            submitBtn.prop('disabled', false);
        });
}); 

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type) {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Add CSS for notification
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-size: 1.6rem;
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .notification.success {
                background-color: #4CAF50;
            }
            .notification.error {
                background-color: #F44336;
            }
            .notification.warning {
                background-color: #FF9800;
            }
            .notification.info {
                background-color: #2196F3;
            }
            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
            @media (max-width: 768px) {
                .notification {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    font-size: 1.4rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    const notification = document.querySelector('.notification');
    
    // Clear any existing timers
    if (notification.timer) {
        clearTimeout(notification.timer);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 5 seconds
    notification.timer = setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
    
    // Allow clicking to dismiss
    notification.onclick = function() {
        notification.classList.remove('show');
        clearTimeout(notification.timer);
    };
}