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
  const daysInMonth = 31;  // Adjust according to the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;

    const dayEvents = events.filter(e => new Date(e.date).getDate() === day);
    if (dayEvents.length > 0) {
      dayDiv.classList.add('has-events');
      const indicator = document.createElement('span');
      indicator.classList.add('event-indicator');
      indicator.textContent = dayEvents.length;
      dayDiv.appendChild(indicator);
    }

    // Add click event listener for each day
    dayDiv.addEventListener('click', () => {
      if (dayEvents.length > 0) {
        showModal(dayEvents, day);
      } else {
        showModal([{ event: "No Event", details: "No events scheduled for this day." }], day);
      }
    });

    calendar.appendChild(dayDiv);
  }
}

// Show the modal with event details
function showModal(events, day) {
  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const eventList = document.getElementById('eventList');

  modalDate.textContent = `Events for Day ${day}`;
  eventList.innerHTML = '';

  events.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.event;
    eventItem.appendChild(eventTitle);

    const eventDetails = document.createElement('p');
    eventDetails.textContent = event.details;
    eventItem.appendChild(eventDetails);

    if (event.image) {
      const eventImage = document.createElement('img');
      eventImage.src = event.image;
      eventImage.alt = event.event;
      eventImage.classList.add('event-image');
      eventItem.appendChild(eventImage);
    }

    eventList.appendChild(eventItem);
  });

  modal.style.display = 'block';

  // Close the modal
  const closeBtn = modal.querySelector('.close');
  closeBtn.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
