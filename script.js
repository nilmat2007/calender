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
  
  document.getElementById('currentMonth').textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.appendChild(createDayElement());
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dayEvents = events.filter(e => new Date(e.date).toDateString() === date.toDateString());
    
    const dayElement = createDayElement(day);
    
    if (dayEvents.length > 0) {
      dayElement.classList.add('has-events');
      const eventIndicator = document.createElement('span');
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

  modalDate.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  eventList.innerHTML = events.length === 0 
    ? '<p class="text-muted">No events scheduled for this day.</p>' 
    : events.map(event => `
      <div class='event-item'>
        <h3>${event.event}</h3>
        <p>${event.details}</p>${event.image ? `<img src="${event.image}" alt="${event.event}" class='event-image'>` : ''}
      </div>`).join('');

  new bootstrap.Modal(modal).show();
}
