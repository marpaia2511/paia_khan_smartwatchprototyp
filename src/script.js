const pages = {
    landing: document.getElementById("page-landing"),
    emergency: document.getElementById("page-emergency"),
    vital: document.getElementById("page-vital"),
    sosCountdown: document.getElementById("page-sos-countdown"),
};

function showPage(name) {
    Object.values(pages).forEach(p => p.classList.add("hidden"));
    pages[name].classList.remove("hidden");
    lucide.createIcons();
}

let sosTimerInterval;
const alarmAudio = new Audio("../sounds/sound.mp3");

function startSosSequence() {
    showPage("sosCountdown");

    let timeLeft = 10;
    const timerDisplay = document.getElementById("sos-timer-display");
    timerDisplay.textContent = timeLeft;

    alarmAudio.currentTime = 0;
    alarmAudio.loop = true;
    alarmAudio.play().catch(e => console.log("Audio Error:", e));

    sosTimerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(sosTimerInterval);
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
            showPage("emergency");
        }
    }, 1000);
}

function cancelSos() {
    clearInterval(sosTimerInterval);
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    showPage("landing");
}

document.getElementById("sos-cancel-button").addEventListener("click", cancelSos);

// Toast
document.getElementById("share-button").addEventListener("click", () => {
    const toast = document.getElementById("share-toast");
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2000);
});

// Navigation
document.getElementById("sos-button").addEventListener("click", () => startSosSequence());

// BEIDE Back Buttons führen zur Homepage
document.getElementById("back-from-emergency").addEventListener("click", () => showPage("landing"));
document.getElementById("back-from-vital").addEventListener("click", () => showPage("landing"));


// Vital Data Configuration
const vitalDetails = {
    heart: {
        name: "Herzfrequenz",
        value: "142",
        unit: "bpm",
        color: "#ef4444",
        info: [
            { label: "Status", value: "Kritisch", color: "text-red-400", icon: "alert-circle" },
            { label: "Bereich", value: "60-100", color: "text-slate-400", icon: "activity" },
            { label: "Trend", value: "Steigend", color: "text-red-400", icon: "trending-up" },
            { label: "Messung", value: "12:42", color: "text-slate-200", icon: "clock" },
        ],
        graph: [72,85,95,110,130,142,138,145,140,135,130],
    },
    oxygen: {
        name: "Sauerstoff",
        value: "98",
        unit: "%",
        color: "#10b981",
        info: [
            { label: "Status", value: "Normal", color: "text-emerald-400", icon: "check-circle" },
            { label: "Bereich", value: "95-100%", color: "text-slate-400", icon: "activity" },
            { label: "Trend", value: "Stabil", color: "text-emerald-400", icon: "minus" },
            { label: "Messung", value: "12:42", color: "text-slate-200", icon: "clock" },
        ],
        graph: [94,96,98,99,97,98,98,98],
    },
    "blood-pressure": {
        name: "Blutdruck",
        value: "160/95",
        unit: "mmHg",
        color: "#f97316",
        info: [
            { label: "Status", value: "Erhöht", color: "text-orange-400", icon: "alert-triangle" },
            { label: "Bereich", value: "120/80", color: "text-slate-400", icon: "activity" },
            { label: "Trend", value: "+15%", color: "text-orange-400", icon: "trending-up" },
            { label: "Messung", value: "12:38", color: "text-slate-200", icon: "clock" },
        ],
        graph: [120,135,148,160,162,160,158],
    },
    temperature: {
        name: "Temperatur",
        value: "36.8",
        unit: "°C",
        color: "#3b82f6",
        info: [
            { label: "Status", value: "Normal", color: "text-blue-400", icon: "check-circle" },
            { label: "Bereich", value: "36-37.5", color: "text-slate-400", icon: "thermometer" },
            { label: "Trend", value: "Stabil", color: "text-blue-400", icon: "minus" },
            { label: "Messung", value: "12:30", color: "text-slate-200", icon: "clock" },
        ],
        graph: [36.5,36.7,36.8,36.9,36.8,36.7],
    },
};

// Build graph
function renderVital(type) {
    const data = vitalDetails[type];

    document.getElementById("vital-name").textContent = data.name;
    document.getElementById("vital-value").textContent = data.value;
    document.getElementById("vital-unit").textContent = data.unit;

    // Colors
    document.getElementById("vital-circle").style.borderColor = data.color;
    document.getElementById("vital-graph").style.color = data.color;
    // Glow effect color
    document.getElementById("vital-glow").style.backgroundColor = data.color;

    const min = Math.min(...data.graph);
    const max = Math.max(...data.graph);

    const points = data.graph.map((v, i) => {
        const x = (300 / (data.graph.length - 1)) * i;
        const y = 80 - ((v - min) / (max - min || 1)) * 60 - 10;
        return `${x},${y}`;
    });

    document.getElementById("graph-line").setAttribute("points", points.join(" "));
    document.getElementById("graph-area").setAttribute("points", `0,80 ${points.join(" ")} 300,80`);

    // Info cards
    const infoDiv = document.getElementById("vital-info");
    infoDiv.innerHTML = "";
    data.info.forEach(i => {
        infoDiv.innerHTML += `
      <div class="detail-info-card">
        <div class="flex items-center gap-2 text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">
          <i data-lucide="${i.icon}" class="w-3 h-3 opacity-60"></i>${i.label}
        </div>
        <div class="font-bold text-lg ${i.color}">${i.value}</div>
      </div>`;
    });

    lucide.createIcons();
    showPage("vital");
}

document.querySelectorAll(".vital-card, .vital-row-card").forEach(el => {
    el.addEventListener("click", () => renderVital(el.dataset.vital));
});

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    showPage("landing");
});