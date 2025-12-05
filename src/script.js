const pages = {
  landing: document.getElementById("page-landing"),
  emergency: document.getElementById("page-emergency"),
  vital: document.getElementById("page-vital"),
};

function showPage(name) {
  Object.values(pages).forEach(p => p.classList.add("hidden"));
  pages[name].classList.remove("hidden");
  lucide.createIcons();
}

// Toast
document.getElementById("share-button").addEventListener("click", () => {
  const toast = document.getElementById("share-toast");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
});

// Navigation
document.getElementById("sos-button").addEventListener("click", () => showPage("emergency"));
document.getElementById("back-from-emergency").addEventListener("click", () => showPage("landing"));
document.getElementById("back-from-vital").addEventListener("click", () => showPage("landing"));

// Vital Data
const vitalDetails = {
  heart: {
    name: "Herzfrequenz",
    value: "142",
    unit: "bpm",
    color: "#ef4444",
    info: [
      { label: "Status", value: "Erhöht", color: "text-red-400", icon: "trending-up" },
      { label: "Normal", value: "60-100 bpm", color: "text-white", icon: "activity" },
      { label: "Trend", value: "Steigend", color: "text-red-400", icon: "trending-up" },
      { label: "Aktualisiert", value: "vor 2 Min", color: "text-white", icon: "clock" },
    ],
    graph: [72,85,95,110,130,142,138,145,140,135,130],
  },
  oxygen: {
    name: "Sauerstoff",
    value: "98",
    unit: "%",
    color: "#10b981",
    info: [
      { label: "Status", value: "Normal", color: "text-emerald-400", icon: "minus" },
      { label: "Normal", value: "95-100%", color: "text-white", icon: "activity" },
      { label: "Trend", value: "Stabil", color: "text-emerald-400", icon: "minus" },
      { label: "Aktualisiert", value: "vor 1 Min", color: "text-white", icon: "clock" },
    ],
    graph: [94,96,98,99,97,98,98,98],
  },
  "blood-pressure": {
    name: "Blutdruck",
    value: "160/95",
    unit: "mmHg",
    color: "#f97316",
    info: [
      { label: "Status", value: "Erhöht", color: "text-orange-400", icon: "trending-up" },
      { label: "Normal", value: "120/80", color: "text-white", icon: "activity" },
      { label: "Trend", value: "Steigend", color: "text-orange-400", icon: "trending-up" },
      { label: "Aktualisiert", value: "vor 3 Min", color: "text-white", icon: "clock" },
    ],
    graph: [120,135,148,160,162,160,158],
  },
  temperature: {
    name: "Temperatur",
    value: "36.8",
    unit: "°C",
    color: "#3b82f6",
    info: [
      { label: "Status", value: "Normal", color: "text-blue-400", icon: "minus" },
      { label: "Normal", value: "36.5-37.5°C", color: "text-white", icon: "thermometer" },
      { label: "Trend", value: "Stabil", color: "text-blue-400", icon: "minus" },
      { label: "Aktualisiert", value: "vor 5 Min", color: "text-white", icon: "clock" },
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

  // Bubble color border
  document.getElementById("vital-circle").style.borderColor = data.color;

  const min = Math.min(...data.graph);
  const max = Math.max(...data.graph);

  const points = data.graph.map((v, i) => {
    const x = (300 / (data.graph.length - 1)) * i;
    const y = 120 - ((v - min) / (max - min)) * 80 - 10;
    return `${x},${y}`;
  });

  document.getElementById("graph-line").setAttribute("points", points.join(" "));
  document.getElementById("graph-area").setAttribute("points", `0,120 ${points.join(" ")} 300,120`);

  // Info cards
  const infoDiv = document.getElementById("vital-info");
  infoDiv.innerHTML = "";
  data.info.forEach(i => {
    infoDiv.innerHTML += `
      <div class="bg-slate-900/80 rounded-xl p-3 border border-slate-600">
        <div class="flex gap-2 text-xs text-slate-400 mb-1">
          <i data-lucide="${i.icon}" class="w-3 h-3 opacity-70"></i>${i.label}
        </div>
        <div class="font-medium ${i.color}">${i.value}</div>
      </div>`;
  });

  lucide.createIcons();
  showPage("vital");
}

// Click listeners
document.querySelectorAll(".vital-card, .em-row").forEach(el => {
  el.addEventListener("click", () => renderVital(el.dataset.vital));
});

// Init view
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  showPage("landing");
});
