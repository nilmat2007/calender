const apiUrl = 'https://script.google.com/macros/s/AKfycbziJEkqg_ybK0ioco5120m5591wZ7EcsM0Bu7op3UYKH-gCQdtmF3EO3tCqJrKBK5x9/exec';
let currentDate = new Date();
let events = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchEvents();
  setupMonthNavigation();
});

function fetchEvents() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      events = data;
      generateCalendar();
    });
}

function setupMonthNavigation() {
  document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
}

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  generateCalendar();
}

function generateCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  document.getElementById('currentMonth').textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.appendChild(createDayElement());
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = createDayElement(day);
    const date = new Date(year, month, day);
    const dayEvents = events.filter(e => new Date(e.date).toDateString() === date.toDateString());
    
    if (dayEvents.length > 0) {
      dayElement.classList.add('has-events');
      const eventIndicator = document.createElement('div');
      eventIndicator.classList.add('event-indicator');
      eventIndicator.textContent = dayEvents.length;
      dayElement.appendChild(eventIndicator);
    }

    dayElement.addEventListener('click', () => showModal(dayEvents, date));
    calendar.appendChild(dayElement);
  }
}

function createDayElement(day = '') {
  const dayElement = document.createElement('div');
  dayElement.classList.add('day');
  dayElement.textContent = day;
  return dayElement;
}

function showModal(events, date) {
  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  const eventList = document.getElementById('eventList');
  const modalTitle = modal.querySelector('.modal-title');

  modalTitle.textContent = 'Event Details';
  modalDate.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  eventList.innerHTML = '';

  if (events.length === 0) {
    eventList.innerHTML = '<p class="text-muted">No events scheduled for this day.</p>';
  } else {
    events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event-item');
      eventElement.innerHTML = `
        <h3>${event.event}</h3>
        <p>${event.details}</p>
        ${event.image ? `<img src="${event.image}" alt="Event image" class="event-image">` : ''}
      `;
      eventList.appendChild(eventElement);
    });
  }

  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();

  // Adjust modal size based on screen size
  adjustModalSize();

  // Adjust modal size when window is resized
  window.addEventListener('resize', adjustModalSize);

  modal.addEventListener('hidden.bs.modal', function () {
    eventList.innerHTML = '';
    window.removeEventListener('resize', adjustModalSize);
  });
}

function adjustModalSize() {
  const modal = document.getElementById('eventModal');
  const modalDialog = modal.querySelector('.modal-dialog');
  const modalContent = modal.querySelector('.modal-content');
  const modalBody = modal.querySelector('.modal-body');

  // Reset any previously set styles
  modalDialog.style.height = '';
  modalContent.style.height = '';
  modalBody.style.maxHeight = '';

  if (window.innerWidth <= 600) {
    // For mobile devices
    modalDialog.style.height = `${window.innerHeight - 20}px`;
    modalContent.style.height = '100%';
    const headerHeight = modal.querySelector('.modal-header').offsetHeight;
    const footerHeight = modal.querySelector('.modal-footer').offsetHeight;
    modalBody.style.maxHeight = `calc(100% - ${headerHeight + footerHeight}px)`;
  } else {
    // For larger screens
    modalBody.style.maxHeight = `calc(80vh - 120px)`;  // Adjust 120px based on your header and footer height
  }
}
