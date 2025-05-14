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

  // Replace the existing event form submission handler with this code
// Find this section in your app.js file

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

    const baseCost = eventType === 'booking' ? 2000 : 1500;
    const attendeeCost = parseInt(attendees) * 200;
    const totalCost = baseCost + attendeeCost;

    const formWrapper = document.querySelector("#form-wrapper");
    formWrapper.innerHTML = `
      <div class="payment-container" style="padding: 20px; background: rgba(56, 103, 214, 0.1); border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 15px; color: #3867d6; text-align: center;">Complete Your Payment</h3>
        
        <div class="order-summary" style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">Order Summary</h4>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Event Type:</span><span>${eventType === 'booking' ? 'Event Booking' : 'Event Schedule'}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Date:</span><span>${selectedDate}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Attendees:</span><span>${attendees}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Base Price:</span><span>₹${baseCost.toLocaleString()}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Attendee Fee:</span><span>₹${attendeeCost.toLocaleString()}</span></div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #eee; font-weight: bold;"><span>Total:</span><span>₹${totalCost.toLocaleString()}</span></div>
        </div>

        <div class="payment-methods" style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">Payment Method</h4>
          <div class="payment-options" style="display: flex; flex-direction: column; gap: 10px;">
            <label class="payment-option" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
              <input type="radio" name="paymentMethod" value="card" checked style="margin-right: 10px;">
              <span style="flex-grow: 1;">Credit/Debit Card</span>
              <div class="card-icons" style="display: flex; gap: 5px;">
                <i class="fab fa-cc-visa" style="font-size: 24px; color: #1A1F71;"></i>
                <i class="fab fa-cc-mastercard" style="font-size: 24px; color: #EB001B;"></i>
                <i class="fab fa-cc-amex" style="font-size: 24px; color: #006FCF;"></i>
              </div>
            </label>
            <label class="payment-option" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
              <input type="radio" name="paymentMethod" value="upi" style="margin-right: 10px;">
              <span style="flex-grow: 1;">UPI</span>
              <i class="fas fa-mobile-alt" style="font-size: 24px; color: #6A5ACD;"></i>
            </label>
            <label class="payment-option" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
              <input type="radio" name="paymentMethod" value="netbanking" style="margin-right: 10px;">
              <span style="flex-grow: 1;">Net Banking</span>
              <i class="fas fa-university" style="font-size: 24px; color: #228B22;"></i>
            </label>
          </div>
        </div>

        <div id="card-payment-form" style="padding: 15px; background: white; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">Card Details</h4>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">Card Number</label>
            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="display: flex; gap: 15px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px;">Expiry Date</label>
              <input type="text" id="expiryDate" placeholder="MM/YY" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px;">CVV</label>
              <input type="text" id="cvv" placeholder="123" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">Name on Card</label>
            <input type="text" id="nameOnCard" placeholder="John Doe" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 10px;">
          <button id="backToForm" style="padding: 10px 20px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 1.5rem;">Back</button>
          <button id="processPayment" style="flex-grow: 1; padding: 10px 20px; background: #3867d6; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.5rem;">Pay ₹${totalCost.toLocaleString()}</button>
        </div>
      </div>
    `;

    const bookingDetails = { name, email, phone, eventType, attendees, selectedDate, totalCost };

    document.querySelector("#backToForm").addEventListener("click", () => {
      eventForm.reset();
      initializeEventForm();
    });

    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const cardForm = document.querySelector('#card-payment-form');
    const paymentSection = document.querySelector(".payment-methods");

    const upiInputHTML = `
      <div id="upi-section" style="padding: 15px; background: white; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px; color: #333;">Enter your UPI ID</h4>
        <input type="text" id="upiId" placeholder="example@upi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
      </div>
    `;

    let upiSection = null;

    paymentOptions.forEach(option => {
      option.addEventListener('change', function () {
        const selected = this.value;
        if (selected === 'card') {
          cardForm.style.display = 'block';
          if (upiSection) upiSection.remove();
        } else {
          cardForm.style.display = 'none';
          if (!upiSection && selected === 'upi') {
            paymentSection.insertAdjacentHTML('afterend', upiInputHTML);
            upiSection = document.querySelector("#upi-section");
          } else if (upiSection) {
            upiSection.style.display = selected === 'upi' ? 'block' : 'none';
          }
        }
      });
    });

    document.querySelector("#processPayment").addEventListener("click", () => {
      const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

      const payButton = document.querySelector("#processPayment");
      const originalText = payButton.textContent;
      payButton.textContent = "Processing...";
      payButton.disabled = true;

      if (selectedMethod === 'card') {
        const cardNumber = document.querySelector("#cardNumber").value.trim();
        const expiryDate = document.querySelector("#expiryDate").value.trim();
        const cvv = document.querySelector("#cvv").value.trim();
        const nameOnCard = document.querySelector("#nameOnCard").value.trim();

        if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
          alert("Please fill in all card details");
          payButton.textContent = originalText;
          payButton.disabled = false;
          return;
        }

        setTimeout(() => showConfirmation(bookingDetails), 2000);

      } else if (selectedMethod === 'upi') {
        const upiId = document.querySelector("#upiId")?.value.trim();
        if (!upiId || !upiId.match(/^\w+@\w+$/)) {
          alert("Please enter a valid UPI ID (e.g., name@bank)");
          payButton.textContent = originalText;
          payButton.disabled = false;
          return;
        }

        setTimeout(() => {
          alert(`A payment request has been sent to your UPI ID: ${upiId}. Please approve it in your UPI app.`);
          showConfirmation(bookingDetails);
        }, 1500);

      } else {
        setTimeout(() => showConfirmation(bookingDetails), 2000);
      }
    });
  });
}

function showConfirmation(details) {
  const formWrapper = document.querySelector("#form-wrapper");

  formWrapper.innerHTML = `
    <div class="confirmation-message" style="text-align: center; padding: 20px; background: rgba(56, 103, 214, 0.1); border-radius: 10px; margin-bottom: 20px;">
      <div style="font-size: 48px; color: #3867d6; margin-bottom: 15px;">✓</div>
      <h3 style="margin-bottom: 15px; color: #3867d6;">Payment Successful!</h3>
      <p style="font-size: 1.6rem; margin-bottom: 10px;">Thank you, ${details.name}!</p>
      <p style="font-size: 1.4rem; margin-bottom: 5px;">Your ${details.eventType === 'booking' ? 'event booking' : 'event schedule'} is confirmed for ${details.selectedDate}.</p>
      <p style="font-size: 1.4rem; margin-bottom: 5px;">Total paid: ₹${details.totalCost.toLocaleString()}</p>
      <p style="font-size: 1.4rem; margin-bottom: 20px;">Booking confirmation sent to ${details.email}.</p>
      <button id="closeConfirmation" style="background: #3867d6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1.5rem;">Close</button>
    </div>
  `;

  formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.querySelector("#closeConfirmation").addEventListener("click", () => {
    calendarModal.style.display = "none";
    if (flatpickrInstance) {
      flatpickrInstance.destroy();
      flatpickrInstance = null;
    }
  });
}

function initializeEventForm() {
  const formWrapper = document.querySelector("#form-wrapper");
  formWrapper.innerHTML = `
    <form id="eventForm">
      <label for="name">Name:</label>
      <input type="text" id="name" required />
      <label for="email">Email:</label>
      <input type="email" id="email" required />
      <label for="phone">Contact Number:</label>
      <input type="tel" id="phone" required />
      <label for="eventType">Event Type:</label>
      <select id="eventType" name="eventType">
        <option value="booking">Book Event</option>
        <option value="scheduling">Schedule Event</option>
      </select>
      <label for="attendees">Number of Attendees:</label>
      <input type="number" id="attendees" min="1" required />
      <button type="submit">Continue to Payment</button>
    </form>
  `;

  const newForm = document.querySelector("#eventForm");
  if (newForm) {
    newForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Will reattach main submit listener
    });
  }
}


// Add this function to show the confirmation after payment
function showConfirmation(details) {
  const formWrapper = document.querySelector("#form-wrapper");
  
  formWrapper.innerHTML = `
    <div class="confirmation-message" style="text-align: center; padding: 20px; background: rgba(56, 103, 214, 0.1); border-radius: 10px; margin-bottom: 20px;">
      <div style="font-size: 48px; color: #3867d6; margin-bottom: 15px;">✓</div>
      <h3 style="margin-bottom: 15px; color: #3867d6;">Payment Successful!</h3>
      <p style="font-size: 1.6rem; margin-bottom: 10px;">Thank you, ${details.name}!</p>
      <p style="font-size: 1.4rem; margin-bottom: 5px;">Your ${details.eventType === 'booking' ? 'event booking' : 'event schedule'} is confirmed for ${details.selectedDate}.</p>
      <p style="font-size: 1.4rem; margin-bottom: 5px;">Total paid: ₹${details.totalCost.toLocaleString()}</p>
      <p style="font-size: 1.4rem; margin-bottom: 20px;">Booking confirmation sent to ${details.email}.</p>
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
}

// Helper function to initialize the event form
function initializeEventForm() {
  const formWrapper = document.querySelector("#form-wrapper");
  formWrapper.innerHTML = `
    <form id="eventForm">
      <label for="name">Name:</label>
      <input type="text" id="name" required />
      <label for="email">Email:</label>
      <input type="email" id="email" required />
      <label for="phone">Contact Number:</label>
      <input type="tel" id="phone" required />
      <label for="eventType">Event Type:</label>
      <select id="eventType" name="eventType">
        <option value="booking">Book Event</option>
        <option value="scheduling">Schedule Event</option>
      </select>
      <label for="attendees">Number of Attendees:</label>
      <input type="number" id="attendees" min="1" required />
      <button type="submit">Continue to Payment</button>
    </form>
  `;
  
  // Re-attach event listener to the new form
  const newForm = document.querySelector("#eventForm");
  if (newForm) {
    newForm.addEventListener("submit", function(e) {
      e.preventDefault();
      // The original submit handler will be called again
    });
  }
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

//contact us form to show thnks msg
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('contactForm');
  const thankYouMessage = document.getElementById('thankYouMessage');

  form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the page from refreshing

      // Hide the form
      form.style.display = 'none';

      // Show the Thank You message
      thankYouMessage.style.display = 'block';
  });
});


//get started things button code//

document.addEventListener("DOMContentLoaded", function () {
  const getStartedBtn = document.getElementById("getStartedBtn");

  const modal = document.createElement("div");
  modal.className = "auth-modal";
  document.body.appendChild(modal);

  getStartedBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showAuthModal();
  });

  function showAuthModal() {
    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="auth-modal-content">
        <span class="close-auth">&times;</span>
        <div class="auth-container">
          <h2>Select Account Type</h2>
          <div class="account-type-buttons">
            <button class="account-type" data-type="user">User</button>
            <button class="account-type" data-type="vendor">Vendor</button>
          </div>

          <div id="form-container" style="display:none;">
            <h3 id="form-title">Sign Up</h3>
            <form id="authForm">
              <input type="text" id="username" name="username" placeholder="Full Name" required>
              <input type="email" id="email" name="email" placeholder="Email" required>
              <input type="password" id="password" name="password" placeholder="Password" required>
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>

              <div class="form-footer">
                <button type="submit">Sign Up</button>
                <p class="toggle-link">Already have an account? <a href="#" id="toggleForm">Login</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const closeBtn = modal.querySelector(".close-auth");
    const accountButtons = modal.querySelectorAll(".account-type");
    const formContainer = modal.querySelector("#form-container");
    const toggleLinkArea = modal.querySelector(".toggle-link");

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    accountButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const accountType = btn.dataset.type;
        formContainer.style.display = "block";
        document.getElementById("form-title").textContent = `Sign Up as ${accountType}`;
      });
    });

    formContainer.addEventListener("click", function (e) {
      if (e.target.id === "toggleForm") {
        e.preventDefault();
        const title = document.getElementById("form-title");
        const confirmPassword = document.getElementById("confirmPassword");
        const button = modal.querySelector("#authForm button");

        if (title.textContent.includes("Login")) {
          title.textContent = "Sign Up";
          button.textContent = "Sign Up";
          toggleLinkArea.innerHTML = `Already have an account? <a href="#" id="toggleForm">Login</a>`;
          confirmPassword.style.display = "block";
        } else {
          title.textContent = "Login";
          button.textContent = "Login";
          toggleLinkArea.innerHTML = `Don't have an account? <a href="#" id="toggleForm">Sign Up</a>`;
          confirmPassword.style.display = "none";
        }
      }
    });

    modal.querySelector("#authForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const username = modal.querySelector("#username").value.trim();
      const email = modal.querySelector("#email").value.trim();
      const password = modal.querySelector("#password").value.trim();
      const confirmPassword = modal.querySelector("#confirmPassword").value.trim();
      const isSignup = document.getElementById("form-title").textContent.includes("Sign Up");

      if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      if (isSignup && password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      // 🎉 Show congratulations message
      const action = isSignup ? "Account Created" : "Logged In";
      const user = username || email;

      formContainer.innerHTML = `
        <h3 style="text-align:center;">🎉 Congratulations!</h3>
        <p style="text-align:center; font-size: 1.1rem;">${action} Successfully<br><strong>${user}</strong></p>
        <button id="closeAfterSuccess" style="margin-top: 20px;">Close</button>
      `;

      modal.querySelector("#closeAfterSuccess").addEventListener("click", () => {
        modal.style.display = "none";
      });
    });

    window.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});


