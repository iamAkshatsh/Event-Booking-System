document.addEventListener("DOMContentLoaded", function () {
  let menu = document.querySelector('#menu-bar');
  let navbar = document.querySelector('.navbar');
  const bookBtn = document.querySelector("#bookEventBtn");
  const scheduleBtn = document.querySelector("#scheduleEventBtn");
  const calendarModal = document.querySelector("#calendarModal");
  const closeBtn = document.querySelector(".close-btn");
  const eventForm = document.querySelector("#eventForm");
  let flatpickrInstance = null;

  const bookedDates = ["2025-04-18", "2025-04-20", "2025-04-25", "2025-04-30"];
  const eventDetails = {
    "2025-04-18": { title: "Corporate Conference", attendees: 120, location: "Main Hall" },
    "2025-04-20": { title: "Birthday Party", attendees: 35, location: "Garden Area" },
    "2025-04-25": { title: "Wedding Reception", attendees: 200, location: "Grand Ballroom" },
    "2025-04-30": { title: "Product Launch", attendees: 85, location: "Exhibition Center" }
  };

  // Menu toggle
  if (menu && navbar) {
    menu.addEventListener('click', () => {
      menu.classList.toggle('fa-times');
      navbar.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
      menu.classList.remove('fa-times');
      navbar.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
      }
    });
  }

  // Swiper init
  if (typeof Swiper !== 'undefined') {
    new Swiper(".home-slider", {
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
  } else {
    console.warn("Swiper is not defined");
  }

  // Tooltip
  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'date-tooltip';
  tooltipEl.style.cssText = `
    position: absolute;
    background: #444;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    font-size: 1.4rem;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    display: none;
    max-width: 250px;
  `;
  document.body.appendChild(tooltipEl);

  function initializeFlatpickr() {
    const calendarElement = document.querySelector("#calendar");
    if (calendarElement && !flatpickrInstance) {
      flatpickrInstance = flatpickr(calendarElement, {
        mode: "single",
        minDate: "today",
        dateFormat: "Y-m-d",
        inline: true,
        static: true,
        onDayCreate: function (_, __, ___, dayElem) {
          const dateStr = dayElem.dateObj.toISOString().split('T')[0];

          if (bookedDates.includes(dateStr)) {
            dayElem.classList.add('booked-date');
            dayElem.style.backgroundColor = "rgba(255, 99, 71, 0.3)";
            dayElem.style.borderRadius = "5px";

            dayElem.addEventListener('mouseover', function (e) {
              const eventInfo = eventDetails[dateStr];
              if (eventInfo) {
                tooltipEl.innerHTML = `
                  <strong>${eventInfo.title}</strong><br>
                  Attendees: ${eventInfo.attendees}<br>
                  Location: ${eventInfo.location}
                `;
                tooltipEl.style.display = 'block';
                tooltipEl.style.left = `${e.pageX + 10}px`;
                tooltipEl.style.top = `${e.pageY + 10}px`;
              }
            });

            dayElem.addEventListener('mouseout', function () {
              tooltipEl.style.display = 'none';
            });

          } else {
            dayElem.style.backgroundColor = "rgba(56, 103, 214, 0.1)";
            dayElem.style.borderRadius = "5px";
          }
        },
        onChange: function (selectedDates, dateStr, instance) {
          if (bookedDates.includes(dateStr)) {
            alert("This date is already booked. Please select another date.");
            instance.clear();
            return;
          }

          let hiddenInput = document.querySelector("#selectedDate");
          if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.id = "selectedDate";
            hiddenInput.name = "selectedDate";
            eventForm.appendChild(hiddenInput);
          }
          hiddenInput.value = dateStr;

          document.querySelector("#form-wrapper").style.display = "block";
          
          // Scroll to the form section
          setTimeout(() => {
            document.querySelector("#form-wrapper").scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    }
  }

  function updateFormStructure() {
    const formWrapper = document.querySelector("#form-wrapper");
    if (formWrapper && !document.querySelector("#phone")) {
      const emailField = document.querySelector("#email").parentNode;
      const phoneField = document.createElement('div');
      phoneField.innerHTML = `
        <label for="phone">Contact Number:</label>
        <input type="tel" id="phone" name="phone" required />
      `;
      emailField.after(phoneField);

      const eventTypeField = document.querySelector("#eventType").parentNode;
      const attendeesField = document.createElement('div');
      attendeesField.innerHTML = `
        <label for="attendees">Number of Attendees:</label>
        <input type="number" id="attendees" name="attendees" min="1" required />
      `;
      eventTypeField.after(attendeesField);
    }
  }

  function adjustModalLayout() {
    const modalContent = document.querySelector(".modal-content");
    const calendar = document.querySelector("#calendar");
    const formWrapper = document.querySelector("#form-wrapper");
    
    if (modalContent && calendar && formWrapper) {
      // Check if content exceeds viewport height
      if (modalContent.scrollHeight > window.innerHeight * 0.8) {
        modalContent.style.height = '80vh';
        modalContent.style.overflowY = 'auto';
      }
      
      // Ensure form is visible
      if (formWrapper.style.display === "block") {
        setTimeout(() => {
          formWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }

  function showModal(eventType) {
    if (!calendarModal) return;
    calendarModal.style.display = "flex";

    updateFormStructure();

    const eventTypeSelect = document.querySelector("#eventType");
    if (eventTypeSelect) {
      eventTypeSelect.value = eventType;
    }

    setTimeout(() => {
      if (flatpickrInstance) {
        flatpickrInstance.destroy();
        flatpickrInstance = null;
      }
      initializeFlatpickr();
      adjustModalLayout(); // Adjust layout after initializing flatpickr
    }, 100);
  }

  if (bookBtn) bookBtn.addEventListener("click", e => {
    e.preventDefault();
    showModal("booking");
  });

  if (scheduleBtn) scheduleBtn.addEventListener("click", e => {
    e.preventDefault();
    showModal("scheduling");
  });

  const ticketButtons = document.querySelectorAll('.view-more-button');
  ticketButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const box = button.closest('.box');
      const eventName = box.querySelector('.title').textContent;
      const eventLocation = box.querySelector('.location').textContent;
      const eventDate = box.querySelector('.date').textContent;

      showModal("booking");

      setTimeout(() => {
        const formTitle = document.querySelector(".modal-content h2");
        if (formTitle) {
          formTitle.textContent = `Book Tickets: ${eventName}`;
        }
      }, 200);
    });
  });

  if (eventForm) {
    eventForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector("#name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const phone = document.querySelector("#phone")?.value.trim() || "";
      const eventType = document.querySelector("#eventType").value;
      const attendees = document.querySelector("#attendees")?.value || "1";
      const selectedDate = document.querySelector("#selectedDate")?.value || "";

      if (!name) return alert("Please enter your name");
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return alert("Enter a valid email");
      if (phone && !phone.match(/^[0-9+\- ]{10,15}$/)) return alert("Enter a valid phone number");
      if (!selectedDate) return alert("Select a date");

      const formWrapper = document.querySelector("#form-wrapper");
      formWrapper.innerHTML = `
        <div class="confirmation-message" style="text-align: center; padding: 20px; background: rgba(56, 103, 214, 0.1); border-radius: 10px; margin-bottom: 20px;">
          <h3 style="margin-bottom: 15px; color: #3867d6;">Booking Confirmed!</h3>
          <p style="font-size: 1.6rem; margin-bottom: 10px;">Thank you, ${name}!</p>
          <p style="font-size: 1.4rem; margin-bottom: 5px;">Your ${eventType === 'booking' ? 'event booking' : 'event schedule'} is set for ${selectedDate}.</p>
          <p style="font-size: 1.4rem; margin-bottom: 20px;">Confirmation sent to ${email}.</p>
          <button id="closeConfirmation" style="background: #3867d6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1.5rem;">Close</button>
        </div>
      `;
      
      // Scroll to see confirmation message
      formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

      document.querySelector("#closeConfirmation").addEventListener("click", () => {
        calendarModal.style.display = "none";
        if (flatpickrInstance) {
          flatpickrInstance.destroy();
          flatpickrInstance = null;
        }
      });
    });
  }

  function closeModal() {
    calendarModal.style.display = "none";
    if (flatpickrInstance) {
      flatpickrInstance.destroy();
      flatpickrInstance = null;
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === calendarModal) closeModal();
  });

  // Add to calendar
  function addToCalendar(eventName, eventDate, eventLocation) {
    const start = new Date(eventDate).toISOString().replace(/[-:]/g, "").split(".")[0];
    const end = new Date(new Date(eventDate).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0];
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${start}/${end}&location=${encodeURIComponent(eventLocation)}`;
    window.open(url, "_blank");
  }

  const calendarButtons = document.querySelectorAll(".add-to-calendar");
  calendarButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const box = button.closest('.box');
      const eventName = box.querySelector('.title').textContent;
      const eventLocation = box.querySelector('.location').textContent;
      const eventDate = box.querySelector('.date').textContent;
      addToCalendar(eventName, eventDate, eventLocation);
    });
  });
  
  // Handle window resize to adjust modal layout
  window.addEventListener('resize', adjustModalLayout);
});
