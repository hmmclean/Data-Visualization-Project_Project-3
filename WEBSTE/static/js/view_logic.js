// view_logic.js

$(document).ready(function() {
  var carouselItems = $('.carousel-item');
  var currentIndex = 0;

  function showNextSlide() {
    var nextIndex = (currentIndex + 1) % carouselItems.length;

    carouselItems.eq(currentIndex).fadeOut(1800); // Fade out the current slide
    carouselItems.eq(nextIndex).fadeIn(1200); // Fade in the next slide

    currentIndex = nextIndex; // Update the current index
  }

  // Show the first slide immediately when the page loads or refreshes
  carouselItems.eq(currentIndex).fadeIn(1000);

  // Start the carousel animation (adjust the interval as needed)
  setInterval(showNextSlide, 8000); // Set to 5 seconds (5000 milliseconds)
});

// Get references to the carousel content and the current slide
const carouselContent = document.querySelector('.carousel-content');
let currentSlide = 0;

// Function to move the carousel to the previous slide
function prevSlide() {
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  if (currentSlide > 0) {
    currentSlide--;
    updateSlidePosition();
  } else {
    // If at the beginning, go to the last slide
    currentSlide = totalSlides - 1;
    updateSlidePosition();
  }
}

// Function to move the carousel to the next slide
function nextSlide() {
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlidePosition();
  } else {
    // If at the end, go back to the first slide
    currentSlide = 0;
    updateSlidePosition();
  }
}

// Function to update the slide position based on the current slide
function updateSlidePosition() {
  const slides = document.querySelectorAll('.carousel-item');

  slides.forEach((slide, index) => {
    if (index === currentSlide) {
      const img = slide.querySelector('img');
      img.setAttribute('src', img.getAttribute('data-src')); // Load image
      slide.style.display = 'block'; // Display the current slide
    } else {
      slide.style.display = 'none'; // Hide other slides
    }
  });

  const slideWidth = document.querySelector('.carousel-item').clientWidth;
  const newPosition = -currentSlide * slideWidth;
  carouselContent.style.transform = `translateX(${newPosition}px)`;
}

// Call updateSlidePosition() initially to show the first slide
updateSlidePosition();