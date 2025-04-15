document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector("#menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const bookBtn = document.querySelector("#bookEventBtn");
  const scheduleBtn = document.querySelector("#scheduleEventBtn");
  const calendarModal = document.querySelector("#calendarModal");
  const closeBtn = document.querySelector(".close-btn");
  let flatpickrInstance = null;

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  } 
  //just navigation bar//
  // ADD THE RESPONSIVE NAVIGATION JAVASCRIPT BELOW THIS LINE (after the closing curly brace of the if statement and the comment)

  let menu = document.querySelector('#menu-bar');
  let navbar = document.querySelector('.navbar');
  
  if (menu && navbar) {
    menu.addEventListener('click', () => {
      menu.classList.toggle('fa-times'); // Toggle between bars and X icon
      navbar.classList.toggle('active'); // Show/hide navbar
    });
    
    // Hide menu when scrolling
    window.addEventListener('scroll', () => {
      menu.classList.remove('fa-times');
      navbar.classList.remove('active');
    });
    
    // Hide menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
      }
    });
  }

  // Swiper initialization
  var swiper = new Swiper(".home-slider", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 2,
      slideShadows: true,
    },
    loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  });

  // Function to initialize flatpickr
  // Replace your initializeFlatpickr function with this
function initializeFlatpickr() {
  const calendarElement = document.querySelector("#calendar");
  if (calendarElement && !flatpickrInstance) {
    flatpickrInstance = flatpickr(calendarElement, {
      mode: "single",
      minDate: "today",
      dateFormat: "Y-m-d",
      inline: true, // Make the calendar always visible
      static: true, // Prevent the calendar from being hidden
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Selected date: ", dateStr);
      }
    });
    console.log("Flatpickr initialized on #calendar");
  } else if (!calendarElement) {
    console.error("Error: #calendar element not found!");
  }
}

  // Button click to show modal and initialize flatpickr
  const showModal = () => {
    if (calendarModal) {
      calendarModal.style.display = "flex";
      // Initialize flatpickr every time the modal is shown
      setTimeout(initializeFlatpickr, 100); // Initialize after a short delay
    } else {
      console.error("Error: #calendarModal not found!");
    }
  };

  if (bookBtn) {
    bookBtn.addEventListener("click", showModal);
  }

  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", showModal);
  }

  // Close modal functionality
  if (closeBtn && calendarModal) {
    closeBtn.addEventListener("click", () => {
      calendarModal.style.display = "none";
      if (flatpickrInstance) {
        flatpickrInstance.destroy();
        flatpickrInstance = null;
      }
    });

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target == calendarModal) {
        calendarModal.style.display = "none";
        if (flatpickrInstance) {
          flatpickrInstance.destroy();
          flatpickrInstance = null;
        }
      }
    });
  }
});