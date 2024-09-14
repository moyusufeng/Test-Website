// Get HTML elements
const dateElement = document.getElementById('date');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const currentStreakElement = document.getElementById('current-streak');
const previousStreaksElement = document.getElementById('previous-streaks');

// Get today's date
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
dateElement.innerText = `Today is: ${today}`;

// Initialize streak data
let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
let lastCheckInDate = localStorage.getItem('lastCheckInDate') || null;
let streakHistory = JSON.parse(localStorage.getItem('streakHistory')) || [];

// Update UI with current streak
currentStreakElement.innerText = currentStreak;

// Load previous streaks
streakHistory.forEach(streak => {
    const li = document.createElement('li');
    li.innerText = `Streak: ${streak} days`;
    previousStreaksElement.appendChild(li);
});

// Check if today has been checked in already
if (lastCheckInDate === today) {
    yesBtn.disabled = true;
    noBtn.disabled = true;
}

// Handle "Yes" button click (OMAD success)
yesBtn.addEventListener('click', () => {
    if (lastCheckInDate !== today) {
        currentStreak += 1;
        localStorage.setItem('currentStreak', currentStreak);
        localStorage.setItem('lastCheckInDate', today);
        currentStreakElement.innerText = currentStreak;

        // Disable buttons after checking in
        yesBtn.disabled = true;
        noBtn.disabled = true;
    }
});

// Handle "No" button click (OMAD failure)
noBtn.addEventListener('click', () => {
    if (lastCheckInDate !== today) {
        // Save the current streak to history
        if (currentStreak > 0) {
            streakHistory.push(currentStreak);
            localStorage.setItem('streakHistory', JSON.stringify(streakHistory));
            
            // Update previous streaks list
            const li = document.createElement('li');
            li.innerText = `Streak: ${currentStreak} days`;
            previousStreaksElement.appendChild(li);
        }

        // Reset the current streak
        currentStreak = 0;
        localStorage.setItem('currentStreak', currentStreak);
        localStorage.setItem('lastCheckInDate', today);
        currentStreakElement.innerText = currentStreak;

        // Disable buttons after checking in
        yesBtn.disabled = true;
        noBtn.disabled = true;
    }
});
