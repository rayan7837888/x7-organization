// List of time zones
const TIME_ZONES = [
    { name: 'London (GMT)', timezone: 'Europe/London' },
    { name: 'Paris (CET)', timezone: 'Europe/Paris' },
    { name: 'Tokyo (JST)', timezone: 'Asia/Tokyo' },
    { name: 'Sydney (AEDT)', timezone: 'Australia/Sydney' },
    { name: 'New York (EST)', timezone: 'America/New_York' },
    { name: 'Los Angeles (PST)', timezone: 'America/Los_Angeles' },
    { name: 'Dubai (GST)', timezone: 'Asia/Dubai' },
    { name: 'Singapore (SGT)', timezone: 'Asia/Singapore' },
    { name: 'Hong Kong (HKT)', timezone: 'Asia/Hong_Kong' },
    { name: 'Bangkok (ICT)', timezone: 'Asia/Bangkok' },
    { name: 'Mumbai (IST)', timezone: 'Asia/Kolkata' },
    { name: 'Moscow (MSK)', timezone: 'Europe/Moscow' },
    { name: 'Istanbul (EET)', timezone: 'Europe/Istanbul' },
    { name: 'São Paulo (BRT)', timezone: 'America/Sao_Paulo' },
    { name: 'Mexico City (CST)', timezone: 'America/Mexico_City' },
    { name: 'Cairo (EET)', timezone: 'Africa/Cairo' },
    { name: 'Johannesburg (SAST)', timezone: 'Africa/Johannesburg' },
    { name: 'Auckland (NZDT)', timezone: 'Pacific/Auckland' },
    { name: 'Tehran (IRST)', timezone: 'Asia/Tehran' },
    { name: 'Athens (EET)', timezone: 'Europe/Athens' }
];

// Initialize clocks
let clocks = [];

// Load default clocks from localStorage or set defaults
function initializeClocks() {
    const saved = localStorage.getItem('clocks');
    
    if (saved) {
        clocks = JSON.parse(saved);
    } else {
        // Default clocks
        clocks = [
            { name: 'London (GMT)', timezone: 'Europe/London' },
            { name: 'Tokyo (JST)', timezone: 'Asia/Tokyo' },
            { name: 'New York (EST)', timezone: 'America/New_York' }
        ];
    }
    
    renderClocks();
    startClocks();
}

// Render all clocks
function renderClocks() {
    const grid = document.getElementById('clock-grid');
    
    if (clocks.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center;">
                <div class="empty-state">
                    <p>No time zones added. Click "Add Time Zone" to get started!</p>
                </div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = clocks.map((clock, index) => `
        <div class="clock-card">
            <button class="btn-remove" onclick="removeClock(${index})">×</button>
            <div class="clock-label">Local Time</div>
            <div class="clock-city">${clock.name}</div>
            <div class="digital-clock" id="clock-${index}">--:--:--</div>
            <div class="clock-info">
                <div class="date-display" id="date-${index}">--/--/--</div>
                <div class="utc-offset" id="offset-${index}">UTC</div>
            </div>
        </div>
    `).join('');
}

// Update all clocks
function updateAllClocks() {
    clocks.forEach((clock, index) => {
        updateClock(index);
    });
}

// Update a single clock
function updateClock(index) {
    const clock = clocks[index];
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clock.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clock.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    const time = formatter.format(new Date());
    const date = dateFormatter.format(new Date());
    
    // Calculate UTC offset
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: clock.timezone }));
    const offset = (tzDate - utcDate) / (1000 * 60 * 60);
    const offsetStr = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
    
    // Update DOM
    const clockElement = document.getElementById(`clock-${index}`);
    const dateElement = document.getElementById(`date-${index}`);
    const offsetElement = document.getElementById(`offset-${index}`);
    
    if (clockElement) clockElement.textContent = time;
    if (dateElement) dateElement.textContent = date;
    if (offsetElement) offsetElement.textContent = offsetStr;
}

// Start updating clocks
function startClocks() {
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
}

// Remove a clock
function removeClock(index) {
    clocks.splice(index, 1);
    saveClocks();
    renderClocks();
    startClocks();
}

// Open modal to add timezone
function addTimeZone() {
    const select = document.getElementById('timezone-select');
    select.innerHTML = TIME_ZONES.map(tz => 
        `<option value="${tz.timezone}">${tz.name}</option>`
    ).join('');
    
    document.getElementById('timezone-modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('timezone-modal').style.display = 'none';
}

// Confirm timezone selection
function confirmTimezone() {
    const select = document.getElementById('timezone-select');
    const timezone = select.value;
    const timezoneName = TIME_ZONES.find(tz => tz.timezone === timezone)?.name;
    
    // Check if timezone already exists
    if (clocks.some(c => c.timezone === timezone)) {
        alert('This time zone is already added!');
        return;
    }
    
    clocks.push({ name: timezoneName, timezone: timezone });
    saveClocks();
    renderClocks();
    startClocks();
    closeModal();
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('clocks', JSON.stringify(clocks));
}

// Reset to default clocks
function resetClocks() {
    if (confirm('Are you sure you want to reset to default time zones?')) {
        clocks = [
            { name: 'London (GMT)', timezone: 'Europe/London' },
            { name: 'Tokyo (JST)', timezone: 'Asia/Tokyo' },
            { name: 'New York (EST)', timezone: 'America/New_York' }
        ];
        saveClocks();
        renderClocks();
        startClocks();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('timezone-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClocks);
} else {
    initializeClocks();
}