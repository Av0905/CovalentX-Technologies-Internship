// NAVBAR SCROLL
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
});

// MOBILE MENU
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Toggle menu icon
    const icon = menuBtn.querySelector("i");
    if(navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

// Close menu when clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.querySelector("i").classList.remove("fa-xmark");
        menuBtn.querySelector("i").classList.add("fa-bars");
    });
});

// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
});

// SCROLL REVEAL ANIMATION
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // Optional: only animate once
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// FAQ ACCORDION
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    
    question.addEventListener("click", () => {
        // Close others
        faqItems.forEach(otherItem => {
            if(otherItem !== item && otherItem.classList.contains("active")) {
                otherItem.classList.remove("active");
            }
        });
        
        // Toggle current
        item.classList.toggle("active");
    });
});

// DEMO MODAL
const watchDemoBtn = document.getElementById("watchDemoBtn");
const demoModal = document.getElementById("demoModal");
const closeModal = document.getElementById("closeModal");

watchDemoBtn.addEventListener("click", () => {
    demoModal.style.display = "flex";
    // Small delay to allow display:flex to apply before adding class for animation
    setTimeout(() => demoModal.classList.add("show"), 10);
});

closeModal.addEventListener("click", () => {
    demoModal.classList.remove("show");
    setTimeout(() => demoModal.style.display = "none", 300);
});

window.addEventListener("click", (e) => {
    if (e.target === demoModal) {
        demoModal.classList.remove("show");
        setTimeout(() => demoModal.style.display = "none", 300);
    }
});

// GET STARTED BUTTON
const getStartedBtn = document.getElementById("getStartedBtn");
if(getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
        window.location.href = "#pricing";
    });
}

// CONTACT FORM
const contactForm = document.getElementById("contactForm");

if(contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Show success state on button
        const btn = contactForm.querySelector("button");
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        btn.style.background = "#10b981";
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "";
            contactForm.reset();
        }, 3000);
    });
}

// TOAST MESSAGE
const toast = document.getElementById("toast");

window.onload = () => {
    setTimeout(() => {
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }, 1000);
};

// BUY BUTTONS
const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach((btn) => {
    btn.addEventListener("click", function() {
        const originalText = this.innerText;
        this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fa-solid fa-check"></i> Selected';
            this.style.background = "#10b981";
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = "";
            }, 2000);
        }, 800);
    });
});