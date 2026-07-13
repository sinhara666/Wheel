// Current Active State Tracker
let activeTier = "w1"; 
let totalRotationDegrees = 0;

// THEMES: 16 COMPLETELY UNIQUE VIBRANT RAINBOW COLORS PER WHEEL (NO REPEATS)
const wheelThemes = {
  w1: {
    title: "Tier 1 Active", value: "$25 Digital Packs Unlocked", border: "#00ffff", btnBg: "linear-gradient(180deg, #00ffff, #0088cc)", btnShadow: "#004466",
    slices: ["#ff0055", "#00ffcc", "#ffcc00", "#9900ff", "#ff6600", "#33ff00", "#0066ff", "#cc00ff", "#00ffff", "#ff00aa", "#ccff00", "#7300e6", "#ff3300", "#00ff00", "#0000ff", "#eeee00"]
  },
  w2: {
    title: "Tier 2 Active", value: "$75 Premium Engine Blueprint", border: "#ff007f", btnBg: "linear-gradient(180deg, #ff007f, #aa0055)", btnShadow: "#55002a",
    slices: ["#3a86ff", "#8338ec", "#ff006e", "#ffbe0b", "#fb5607", "#06d6a0", "#118ab2", "#073b4c", "#e63946", "#8a8d8a", "#a8dadc", "#457b9d", "#7209b7", "#f72585", "#4cc9f0", "#4361ee"]
  },
  w3: {
    title: "Tier 3 Active", value: "$299 Production Machine Vault", border: "#ffd700", btnBg: "linear-gradient(180deg, #ffd700, #cc9900)", btnShadow: "#554400",
    slices: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#d62828", "#003049", "#ad2424", "#6f2dbd", "#a663cc", "#4b225c", "#1d5c2b", "#48cae4", "#0077b6", "#023e8a", "#ffd700"]
  }
};

// AUDITED PRIZE VAULT DIRECT FROM YOUR SYSTEM INVENTORY
const tierPrizes = {
  w1: ["🎁 Premium Cute Cartoon Elf Sticker Pack", "⚡ Advanced Engineering AI Prompt Pack", "🎨 Creative Mascot Vector Graphic Pack", "📋 Core Tech Implementation Workflow"],
  w2: ["⚙️ Operational Business Workflow Pipeline", "🛡️ Ghost Scam Spotter Security E-Book", "📸 Only Lagos: Photography Monetization Kit", "🔄 Content Sequencer Production Workflow"],
  w3: ["💻 AI-Embedded Automated Prompt Dashboard", "🧠 The Rise of Synthetic AI Deep-Dive Guide", "🚀 Turnkey Full Production Digital Machine Engine", "🏆 GRAND JACKPOT: THE COMPLETE ENTERPRISE SUITE"]
};

// 1. DYNAMIC VECTOR WHEEL DRAW ENGINE
function drawCurrentWheel(targetId) {
  const id = targetId || "mainWheelSvg";
  const svg = document.getElementById(id);
  if (!svg) return;
  
  const themeKey = (id === "mainWheelSvg") ? activeTier : id;
  const currentConfig = wheelThemes[themeKey];
  const colorArray = currentConfig.slices;
  
  let slicesHTML = "";
  
  // Render the 16 slices touching seamlessly
  for (let s = 0; s < 16; s++) {
    const angleStart = s * 22.5; const angleEnd = (s + 1) * 22.5;
    const radStart = (angleStart - 90) * Math.PI / 180; const radEnd = (angleEnd - 90) * Math.PI / 180;
    const x1 = 100 + 100 * Math.cos(radStart); const y1 = 100 + 100 * Math.sin(radStart);
    const x2 = 100 + 100 * Math.cos(radEnd); const y2 = 100 + 100 * Math.sin(radEnd);
    
    slicesHTML += `<path d="M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z" fill="${colorArray[s]}" stroke="none"/>`;
  }

  // Render the 4 sharp black lines splitting the wheel into 4 big triangles
  for (let q = 0; q < 4; q++) {
    const quarterAngle = q * 90; const radQuarter = (quarterAngle - 90) * Math.PI / 180;
    const xLine = 100 + 100 * Math.cos(radQuarter); const yLine = 100 + 100 * Math.sin(radQuarter);
    slicesHTML += `<line x1="100" y1="100" x2="${xLine}" y2="${yLine}" stroke="#000000" stroke-width="5.5" stroke-linecap="round"/>`;
  }

  svg.innerHTML = slicesHTML;

  // Refresh display panels and layouts dynamically
  if (id === "mainWheelSvg") {
    document.getElementById("tierDisplayTitle").innerText = currentConfig.title;
    document.getElementById("tierDisplayValue").innerText = currentConfig.value;
    const podium = document.getElementById("podiumFrame");
    if (podium) {
      podium.style.borderColor = currentConfig.border;
      podium.style.boxShadow = `0 20px 40px rgba(0,0,0,0.7), 0 0 25px ${currentConfig.border}`;
    }
    const spinBtn = document.getElementById("spinActionBtn");
    if (spinBtn) {
      spinBtn.style.background = currentConfig.btnBg;
      spinBtn.style.boxShadow = `0 8px 0 ${currentConfig.btnShadow}`;
    }
  }
}

function switchTier(tierId) {
  activeTier = tierId;
  totalRotationDegrees = 0;
  const wheel = document.getElementById("mainWheelSvg") || document.getElementById(tierId);
  if (wheel) wheel.style.transform = `rotate(0deg)`;
  
  document.querySelectorAll('.tier-btn').forEach(btn => btn.classList.remove('active'));
  const activeTabBtn = document.getElementById("btn-tier" + tierId.replace("w", ""));
  if (activeTabBtn) activeTabBtn.classList.add('active');
  
  if (document.getElementById("mainWheelSvg")) {
    drawCurrentWheel("mainWheelSvg");
  } else {
    drawCurrentWheel(tierId);
  }
}

function executeSpin() {
  const activeCanvasId = document.getElementById("mainWheelSvg") ? "mainWheelSvg" : activeTier;
  const wheel = document.getElementById(activeCanvasId);
  const btn = document.getElementById("spinActionBtn") || document.getElementById("btn-tier" + activeTier.replace("w", ""));
  if (!wheel || !btn) return;
  btn.disabled = true;
  
  const randomSpins = Math.floor(2160 + Math.random() * 1440);
  totalRotationDegrees += randomSpins;
  
  wheel.style.transform = `rotate(${totalRotationDegrees}deg)`;
  
  setTimeout(() => {
    const absoluteDegrees = totalRotationDegrees % 360;
    const needleAngle = (360 - absoluteDegrees) % 360;
    
    let targetQuarter = "Q1";
    if (needleAngle >= 0 && needleAngle < 90) targetQuarter = "Q1";
    else if (needleAngle >= 90 && needleAngle < 180) targetQuarter = "Q2";
    else if (needleAngle >= 180 && needleAngle < 270) targetQuarter = "Q3";
    else targetQuarter = "Q4";
    
    launchBoxPresentation(targetQuarter);
    btn.disabled = false;
  }, 4800);
}

function launchBoxPresentation(quarterKey) {
  const currentConfig = wheelThemes[activeTier];
  const frame = document.getElementById('modalFrame');
  if (frame) frame.style.borderColor = currentConfig.border;
  
  document.getElementById('modalTitle').innerText = `${quarterKey === "Q4" && activeTier === "w3" ? "🏆 GOLD JACKPOT UNLOCKED!" : "Section Cleared!"}`;
  
  const grid = document.getElementById('boxesGrid');
  if (!grid) return;
  grid.innerHTML = ""; 

  let startingIndex = 0;
  if (quarterKey === "Q2") startingIndex = 4;
  else if (quarterKey === "Q3") startingIndex = 8;
  else if (quarterKey === "Q4") startingIndex = 12;

  for (let i = 0; i < 4; i++) {
    const boxColor = currentConfig.slices[startingIndex + i];
    const box = document.createElement('div');
    box.className = 'prize-box';
    
    box.onclick = () => {
      if (!box.classList.contains('opened')) {
        box.classList.add('opened');
        // Instantly shoots the information over to your macro spreadsheet setup
        sendWinnerToGoogleSheets(activeTier, quarterKey, i + 1);
      }
    };

    box.innerHTML = `
      <div class="box-inner">
        <div class="box-front" style="background: ${boxColor};">Item ${i + 1}</div>
        <div class="box-back" style="background: #020108; color: #fff; padding: 15px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 1.1rem; border: 2px solid #00ffff;">
          ${tierPrizes[activeTier][i]}
        </div>
      </div>
    `;
    grid.appendChild(box);
  }
  
  const modal = document.getElementById('boxModal');
  if (!modal) return;
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
  const modal = document.getElementById('boxModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 400);
  }
}

// 2. GOOGLE APPS SCRIPT WEB HOOK BRIDGE
function sendWinnerToGoogleSheets(tier, quarter, boxIndex) {
  // PASTE YOUR EXACT DEPLOYED GOOGLE APPS SCRIPT WEB APP URL LINK BETWEEN THESE QUOTES
  const googleAppsScriptUrl = "YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE";
  
  if (googleAppsScriptUrl.includes("YOUR_DEPLOYED_APPS_SCRIPT")) {
    console.log("Local Test Mode: Standing by to link your live macro web app URL token.");
    return;
  }

  const payloadData = {
    tierWon: tier,
    quarterWon: quarter,
    boxClicked: boxIndex,
    prizeName: tierPrizes[tier][boxIndex - 1],
    timestamp: new Date().toLocaleString()
  };

  // Shoots the transaction metrics seamlessly into your macro data matrix via a clean POST payload
  fetch(googleAppsScriptUrl, {
    method: "POST",
    mode: "no-cors", // Crucial block bypass rule to completely prevent Google browser CORS errors
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadData)
  })
  .then(() => console.log("Winner metrics logged successfully inside your macro spreadsheet rows."))
  .catch(err => console.error("Network connection check: verifying macro path alignment...", err));
}

// Global initialization window framework controller loop
window.onload = () => {
  if (document.getElementById("mainWheelSvg")) {
    drawCurrentWheel("mainWheelSvg");
  } else {
    drawCurrentWheel("w1");
    drawCurrentWheel("w2");
    drawCurrentWheel("w3");
  }
};

