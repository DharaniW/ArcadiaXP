// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Update aria-expanded attribute for accessibility
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
  });
  
  // Close menu when clicking on a link (optional)
  document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
              hamburger.classList.remove('active');
              navLinks.classList.remove('active');
              hamburger.setAttribute('aria-expanded', 'false');
          }
      });
  });
  
  // Close menu when clicking outside (optional)
  document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && 
          !event.target.closest('.nav-links') && 
          !event.target.closest('.hamburger')) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
      }
  });
});
// SLIDESHOW FUNCTIONALITY
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !expanded);
  });
});

// Optional: Create navigation dots 

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

// Autoplay every 5 seconds
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

setInterval(nextSlide, 5000);


