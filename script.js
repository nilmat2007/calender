// API URL from Google Apps Script
const apiUrl = 'https://script.google.com/macros/s/AKfycbziJEkqg_ybK0ioco5120m5591wZ7EcsM0Bu7op3UYKH-gCQdtmF3EO3tCqJrKBK5x9/exec';

// Fetch event data from the API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    generateCalendar(data);
  });

// Generate the calendar
function generateCalendar(events) {
  const calendar = document.getElementById('calendar');
  const daysInMonth = 31;  // ปรับตามเดือน
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;

    // Add click event listener for each day
    dayDiv.addEventListener('click', () => {
      const event = events.find(e => new Date(e.date).getDate() === day);
      if (event) {
        showModal(event);
      } else {
        showModal({ event: "No Event", details: "No details available for this day." });
      }
    });

    calendar.appendChild(dayDiv);
  }
}

// Show the modal with event details
function showModal(event) {
  const modal = document.getElementById('eventModal');
  document.getElementById('eventTitle').textContent = event.event;
  document.getElementById('eventDetails').textContent = event.details;

  const eventImage = document.getElementById('eventImage');
  if (event.image) {
    eventImage.src = event.image;
    eventImage.style.display = 'block';
  } else {
    eventImage.style.display = 'none';
  }

  modal.style.display = 'block';

  // Close the modal
  document.querySelector('.close').onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
