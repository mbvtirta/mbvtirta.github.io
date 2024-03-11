const token = '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';
const repoOwner = 'mbvtirta';
const repoName = 'mbvtirta.github.io';
const filePath = 'HRD-mengaji/events.JSON';

const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventBtn = document.querySelector(".add-event");
const addEventWrapper = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
const addEventTitle = document.querySelector(".event-name");
const addEventDropdown = document.querySelector(".custom-dropdown");
const addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

let eventsArr = [];
getEvents();

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListener();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((eventItem) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${eventItem.title}</h3>
            </div>
            <div class="event-dropdown">
              <span class="event-dropdown-value">${eventItem.name}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
}


addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

if (addEventSubmit) {
  addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventDropdown = addEventDropdown.value;

    if (eventTitle === "" || eventDropdown === "") {
      alert("Please fill all the fields");
      return;
    }

    let eventExist = false;
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.forEach((event) => {
          if (event.title === eventTitle) {
            eventExist = true;
          }
        });
      }
    });
    if (eventExist) {
      alert("Event already added");
      return;
    }
    const newEvent = {
      title: eventTitle,
      name: eventDropdown
    };
    let eventAdded = false;
    if (eventsArr.length > 0) {
      eventsArr.forEach((item) => {
        if (
          item.day === activeDay &&
          item.month === month + 1 &&
          item.year === year
        ) {
          item.events.push(newEvent);
          eventAdded = true;
        }
      });
    }

    if (!eventAdded) {
      eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        events: [newEvent],
      });
    }

    addEventWrapper.classList.remove("active");
    addEventTitle.value = "Juz ke-"; // Tambahkan default value "Juz ke-"
    addEventDropdown.value = "";
    updateEvents(activeDay);
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }
    saveEvents(); // Simpan data acara setiap kali acara baru ditambahkan
  });
} else {
  console.error("Element .add-event-btn not found in the DOM");
}

eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.querySelector(".event-title").textContent;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events = event.events.filter(item => item.title !== eventTitle);
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
      saveEvents(); // Simpan data acara setiap kali acara dihapus
    }
  }
});

async function saveEvents() {
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update events.JSON',
      content: btoa(JSON.stringify(eventsArr)), // Di sini Anda mengirimkan data eventsArr yang telah diubah
      sha: await getFileSha(),
    }),
  });
  if (response.ok) {
    console.log('Events saved successfully!');
  } else {
    console.error('Failed to save events:', response.status);
  }
}

async function getEvents() {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`);
    if (response.ok) {
      const data = await response.json();
      eventsArr.push(...data);
      console.log('Events loaded successfully:', eventsArr);
      // Tampilkan event saat data acara sudah dimuat
      initCalendar();
      updateEvents(activeDay);
    } else {
      console.error('Failed to load events:', response.status);
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}

async function getFileSha() {
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
    headers: {
      'Authorization': `token ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data.sha;
  } else {
    console.error('Failed to get file SHA:', response.statusText);
    return null;
  }
}
