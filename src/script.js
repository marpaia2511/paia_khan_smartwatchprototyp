// Konfiguration
const SOS_TIME_SECONDS = 7;
const CIRCUMFERENCE = 603;

const pages = {
    monitoring: document.getElementById('page-monitoring'),
    vitalsView: document.getElementById('page-vitals-view'),
    countdown: document.getElementById('page-countdown'),
    alarmActive: document.getElementById('page-alarm-active')
};

// Vitals Pages
const vitalsP1 = document.getElementById('vitals-p1');
const vitalsP2 = document.getElementById('vitals-p2');
const vitalsP3 = document.getElementById('vitals-p3');
const vitalsDots = [
    document.getElementById('vitals-dot-1'),
    document.getElementById('vitals-dot-2'),
    document.getElementById('vitals-dot-3')
];

// Alarm Pages
const alarmP1 = document.getElementById('alarm-p1');
const alarmP2 = document.getElementById('alarm-p2');
const alarmDots = [
    document.getElementById('alarm-dot-1'),
    document.getElementById('alarm-dot-2')
];

const countdownDisplay = document.getElementById('countdown-display');
const progressCircle = document.getElementById('countdown-progress');
const bpmDisplayHome = document.getElementById('live-bpm-display');
const bpmDisplayEmerg = document.getElementById('emerg-bpm');

let countdownInterval;

function showPage(pageKey) {
    Object.values(pages).forEach(el => el.classList.add('hidden'));
    pages[pageKey].classList.remove('hidden');

    if(pageKey === 'vitalsView') toggleVitalsPage(1);
    if(pageKey === 'alarmActive') toggleAlarmPage(1);

    lucide.createIcons();
}

// === TOGGLE VITAL PAGES (1 -> 2 -> 3 -> 1) ===
function toggleVitalsPage(pageNum) {
    // Hide all
    vitalsP1.classList.add('hidden');
    vitalsP2.classList.add('hidden');
    vitalsP3.classList.add('hidden');
    vitalsDots.forEach(d => d.classList.remove('active'));

    // Show current
    if(pageNum === 1) {
        vitalsP1.classList.remove('hidden');
        vitalsDots[0].classList.add('active');
    } else if (pageNum === 2) {
        vitalsP2.classList.remove('hidden');
        vitalsDots[1].classList.add('active');
    } else {
        vitalsP3.classList.remove('hidden');
        vitalsDots[2].classList.add('active');
    }
}

// Click Events to cycle
vitalsP1.addEventListener('click', () => toggleVitalsPage(2));
vitalsP2.addEventListener('click', () => toggleVitalsPage(3));
vitalsP3.addEventListener('click', () => toggleVitalsPage(1));


// === TOGGLE ALARM PAGES (1 -> 2 -> 1) ===
function toggleAlarmPage(pageNum) {
    if(pageNum === 1) {
        alarmP1.classList.remove('hidden');
        alarmP2.classList.add('hidden');
        alarmDots[0].classList.add('active');
        alarmDots[1].classList.remove('active');
    } else {
        alarmP1.classList.add('hidden');
        alarmP2.classList.remove('hidden');
        alarmDots[0].classList.remove('active');
        alarmDots[1].classList.add('active');
    }
}

alarmP1.addEventListener('click', () => toggleAlarmPage(2));
alarmP2.addEventListener('click', () => toggleAlarmPage(1));


// === NAVIGATION ===
document.getElementById('show-vitals-btn').addEventListener('click', () => showPage('vitalsView'));
document.getElementById('back-to-home-btn').addEventListener('click', () => showPage('monitoring'));
document.getElementById('trigger-sos-btn').addEventListener('click', startCountdown);

function startCountdown() {
    showPage('countdown');
    let timeLeft = SOS_TIME_SECONDS;
    countdownDisplay.textContent = timeLeft;

    progressCircle.style.transition = 'none';
    progressCircle.style.strokeDashoffset = 0;
    progressCircle.getBoundingClientRect();
    progressCircle.style.transition = 'stroke-dashoffset 1s linear';

    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownDisplay.textContent = timeLeft;
        const offset = CIRCUMFERENCE - ((timeLeft / SOS_TIME_SECONDS) * CIRCUMFERENCE);
        progressCircle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            triggerAlarm();
        }
    }, 1000);
}

document.getElementById('cancel-sos-btn').addEventListener('click', () => {
    clearInterval(countdownInterval);
    showPage('monitoring');
});

function triggerAlarm() {
    showPage('alarmActive');
}

// Vital Simulation
function simulateVitals() {
    setInterval(() => {
        const normalBpm = Math.floor(Math.random() * (85 - 80 + 1) + 80);
        const stressBpm = Math.floor(Math.random() * (150 - 140 + 1) + 140);
        if(bpmDisplayHome) bpmDisplayHome.textContent = normalBpm;
        if(bpmDisplayEmerg) bpmDisplayEmerg.textContent = stressBpm;
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    showPage('monitoring');
    simulateVitals();
});