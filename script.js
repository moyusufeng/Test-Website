// Get HTML elements
const calendar = document.getElementById('calendar');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const currentStreakElement = document.getElementById('current-streak');
const previousStreaksElement = document.getElementById('previous-streaks');
const selectedDateElement = document.getElementById('selected-date');

// Initialize streak data
let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
let streakHistory = JSON.parse(localStorage.getItem('streakHistory')) || [];
let omadData = JSON.parse(localStorage.getItem('omadData')) || {}; // Store OMAD status per date

// Get today's date
const today = new Date();
const todayString = formatDate(today);
selectedDateElement.innerText = todayString;

// Update UI with current streak
currentStreakElement.innerText = currentStreak;

// Load previous streaks
streakHistory.forEach(streak => {
    const li = document.createElement('li');
    li.innerText = `Streak: ${streak} days`;
    previousStreaksElement.appendChild(li);
});

// Function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Create a calendar for the current month
function generateCalendar() {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Clear the calendar
    calendar.innerHTML = '';

    // Add empty divs to align days with the correct weekday
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendar.appendChild(emptyDiv);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = day;

        const dateStr = formatDate(new Date(currentYear, currentMonth, day));

        // Highlight today's date
        if (dateStr === todayString) {
            dayDiv.classList.add('today');
        }

        // Mark selected day
        if (dateStr === selectedDateElement.innerText) {
            dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', () => {
            handleDateSelection(dateStr, dayDiv);
        });

        calendar.appendChild(dayDiv);
    }
}

// Handle date selection
function handleDateSelection(dateStr, dayDiv) {
    selectedDateElement.innerText = dateStr;

    // Clear previous selections
    const allDays = document.querySelectorAll('#calendar div');
    allDays.forEach(day => day.classList.remove('selected'));

    // Mark the new selected day
    dayDiv.classList.add('selected');

    // Enable the buttons for Yes/No
    yesBtn.disabled = false;
    noBtn.disabled = false;
}

// Handle "Yes" button click (OMAD success)
yesBtn.addEventListener('click', () => {
    const selectedDate = selectedDateElement.innerText;
    omadData[selectedDate] = true;  // Mark as OMAD success
    localStorage.setItem('omadData', JSON.stringify(omadData));

    updateStreak();
    yesBtn.disabled = true;
    noBtn.disabled = true;
});

// Handle "No" button click (OMAD failure)
noBtn.addEventListener('click', () => {
    const selectedDate = selectedDateElement.innerText;
    omadData[selectedDate] = false;  // Mark as OMAD failure
    localStorage.setItem('omadData', JSON.stringify(omadData));

    updateStreak();
    yesBtn.disabled = true;
    noBtn.disabled = true;
});

// Update streak
function updateStreak() {
    let streak = 0;
    let lastSuccess = null;

    for (let date in omadData) {
        if (omadData[date]) {
            streak++;
        } else {
            if (streak > 0) {
                streakHistory.push(streak);
                const li = document.createElement('li');
                li.innerText = `Streak: ${streak} days`;
                previousStreaksElement.appendChild(li);
            }
            streak = 0;
        }
    }

    // Save the current streak and update UI
    currentStreak = streak;
    localStorage.setItem('currentStreak', currentStreak);
    currentStreakElement.innerText = currentStreak;
}

// Generate the calendar
generateCalendar();

// Initial streak calculation
updateStreak();
