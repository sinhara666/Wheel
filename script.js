// Keep track of rotation values for each wheel independently
let totalRotationDegrees = { w1: 0, w2: 0, w3: 0 };

// 🌟 THEMES FIXED: 12 COMPLETELY DIFFERENT COLORS ACROSS THE ENTIRE STAGE (NO OVERLAPS)
const wheelThemes = {
  w1: {
    border: "#00ffff",
    // Wheel 1 Colors: Pink, Teal, Purple, Light Green
    slices: [
      "#ff007f", "#ff007f", "#ff007f", "#ff007f", // Quarter 1 (Slices 1-4)
      "#00e5ff", "#00e5ff", "#00e5ff", "#00e5ff", // Quarter 2 (Slices 5-8)
      "#9b5de5", "#9b5de5", "#9b5de5", "#9b5de5", // Quarter 3 (Slices 9-12)
      "#00ff66", "#00ff66", "#00ff66", "#00ff66"  // Quarter 4 (Slices 13-16)
    ]
  },
  w2: {
    border: "#ff007f",
    // Wheel 2 Colors: Bright Red, Brilliant Gold, Electric Blue, Hot Orange
    slices: [
      "#ff3333", "#ff3333", "#ff3333", "#ff3333", // Quarter 1 (Slices 1-4)
      "#ffd700", "#ffd700", "#ffd700", "#ffd700", // Quarter 2 (Slices 5-8)
      "#0066ff", "#0066ff", "#0066ff", "#0066ff", // Quarter 3 (Slices 9-12)
      "#ff6600", "#ff6600", "#ff6600", "#ff6600"  // Quarter 4 (Slices 13-16)
    ]
  },
  w3: {
    border: "#ffd700",
    // Wheel 3 Colors: Deep Magenta, Acid Lemon Yellow, Electric Cyan, Neon Violet
    slices: [
      "#cc00ff", "#cc00ff", "#cc00ff", "#cc00ff", // Quarter 1 (Slices 1-4)
      "#ccff00", "#ccff00", "#ccff00", "#ccff00", // Quarter 2 (Slices 5-8)
      "#00ffff", "#00ffff", "#00ffff", "#00ffff", // Quarter 3 (Slices 9-12)
      "#7300e6", "#7300e6", "#7300e6", "#7300e6"  // Quarter 4 (Slices 13-16)
    ]
  }
};

// DIGITAL PRODUCT ASSETS CATALOG FOR REVEALS
const tierPrizes = {
  w1: ["🎁 Premium Cute Cartoon Elf Sticker Pack", "⚡ Advanced Engineering AI Prompt Pack", "🎨 Creative Mascot Vector Graphic Pack", "📋 Core Tech Implementation Workflow"],
  w2: ["⚙️ Operational Business Workflow Pipeline", "🛡️ Ghost Scam Spotter Security E-Book", "📸 Only Lagos: Photography Monetization Kit", "🔄 Content Sequencer Production Workflow"],
  w3: ["💻 AI-Embedded Automated Prompt Dashboard", "🧠 The Rise of Synthetic AI Deep-Dive Guide", "🚀 Turnkey Full Production Digital Machine Engine", "🏆 GRAND JACKPOT: THE COMPLETE ENTERPRISE SUITE"]
};

// 1. ADVANCED VECTOR GENERATION ROUTINE (BUILDS ALL WHEELS AT ONCE)
function drawAllWheelsOnStage() {
  ["w1", "w2", "w3"].forEach(wheelId => {
    const svg = document.getElementById(wheelId);
    if (!svg) return;
    
    let slicesHTML = "";
    const currentColors = wheelThemes[wheelId].slices;
    
    // Draw 16 solid colored paths perfectly aligned
    for (let s = 0; s < 16; s++) {
      const angleStart = s * 22.5; const angleEnd = (s + 1) * 22.5;
      const radStart = (angleStart - 90) * Math.PI / 180; const radEnd = (angleEnd - 90) * Math.PI / 180;
      const x1 = 100 + 100 * Math.cos(radStart); const y1 = 100 + 100 * Math.sin(radStart);
      const x2 = 100 + 100 * Math.cos(radEnd); const y2 = 100 + 100 * Math.sin(radEnd);
      
      slicesHTML += `<path d="M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z" fill="${currentColors[s]}" stroke="none"/>`;
    }

    // Print ONLY the 4 heavy black boundaries marking the 4 large triangles
    for (let q = 0; q < 4; q++) {
      const quarterAngle = q * 90; const radQuarter = (quarterAngle - 90) * Math.PI / 180;
      const xLine = 100 + 100 * Math.cos(radQuarter); const yLine = 100 + 100 * Math.sin(radQuarter);
      slicesHTML += `<line x1="100" y1="100" x2="${xLine}" y2="${yLine}" stroke="#000000" stroke-width="5.5" stroke-linecap="round"/>`;
    }

    svg.innerHTML = slicesHTML;
  });
}

// 2. RUN INDEPENDENT WHEEL SPIN ACTIONS
function executeSpin(wheelId) {
  const wheel = document.getElementById(wheelId);
  const btn = document.getElementById("btn-spin-" + wheelId);
  if (!wheel || !btn) return;
  btn.disabled = true;
  
  const randomSpins = Math.floor(2160 + Math.random() * 1440);
  totalRotationDegrees[wheelId] += randomSpins;
  
  wheel.style.transform = `rotate(${totalRotationDegrees[wheelId]}deg)`;
  
  setTimeout(() => {
    const absoluteDegrees = totalRotationDegrees[wheelId] % 360;
    const needleAngle = (360 - absoluteDegrees) % 360;
    
    let targetQuarter = "Q1";
    if (needleAngle >= 0 && needleAngle < 90) targetQuarter = "Q1";
    else if (needleAngle >= 90 && needleAngle < 180) targetQuarter = "Q2";
    else if (needleAngle >= 180 && needleAngle < 270) targetQuarter = "Q3";
    else targetQuarter = "Q4";
    
    launchBoxPresentation(wheelId, targetQuarter);
    btn.disabled = false;
  }, 4800);
}

// 3. LAUNCH POP OUT PACKAGES FOR TARGET WINNING TRACK
function launchBoxPresentation(wheelId, quarterKey) {
  const currentTheme = wheelThemes[wheelId];
  const frame = document.getElementById('modalFrame');
  if (frame) frame.style.borderColor = currentTheme.border;
  
  document.getElementById('modalTitle').innerText = `${quarterKey === "Q4" && wheelId === "w3" ? "🏆 GOLD JACKPOT UNLOCKED!" : "Section Cleared!"}`;
  
  const grid = document.getElementById('boxesGrid');
  if (!grid) return;
  grid.innerHTML = ""; 

  let startingIndex = 0;
  if (quarterKey === "Q2") startingIndex = 4;
  else if (quarterKey === "Q3") startingIndex = 8;
  else if (quarterKey === "Q4") startingIndex = 12;

  for (let i = 0; i < 4; i++) {
    const boxColor = currentTheme.slices[startingIndex + i];
    const box = document.createElement('div');
    box.className = 'prize-box';
    box.onclick = () => {
      if (!box.classList.contains('opened')) {
        box.classList.add('opened');
        sendWinnerToGoogleSheets(wheelId, quarterKey, i + 1);
      }
    };
    box.innerHTML = `
      <div class="box-inner">
        <div class="box-front" style="background: ${boxColor};">Item ${i + 1}</div>
        <div class="box-back" style="background: #020108; color: #fff; padding: 15px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 1.1rem; border: 2px solid #00ffff;">
          ${tierPrizes[wheelId][i]}
        </div>
      </div>
    `;
    grid.appendChild(box);
  }
  
  const modal = document.getElementById('boxModal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  }
}

function closeModal() {
  const modal = document.getElementById('boxModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 400);
  }
}

function sendWinnerToGoogleSheets(tier, quarter, boxIndex) {
  const googleAppsScriptUrl = "YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE";
  if (googleAppsScriptUrl.includes("YOUR_DEPLOYED_APPS_SCRIPT")) return;

  fetch(googleAppsScriptUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tierWon: tier, quarterWon: quarter, boxClicked: boxIndex, prizeName: tierPrizes[tier][boxIndex - 1], timestamp: new Date().toLocaleString() })
  });
}

// Draw all independent canvas structures immediately on window startup
window.onload = drawAllWheelsOnStage;

