// Keep track of rotation values for each wheel independently
let totalRotationDegrees = { w1: 0, w2: 0, w3: 0 };

// 🌟 THEMES FIXED: 12 COMPLETELY DIFFERENT COLORS ACROSS THE ENTIRE STAGE (NO OVERLAPS)
const wheel1Colors = [
  '#FF2D55', '#FF3B30', '#00C7BE', // Section 1: Pink, Red, Teal
  '#00C7BE', '#28A745', '#FF2D55', // Section 2: Teal, Green, Pink
  '#FF3B30', '#FFD700', '#6F42C1', // Section 3: Red, Gold (Jackpot), Purple
  '#6F42C1', '#28A745', '#FF2D55'  // Section 4: Purple, Green, Pink
];

  },
  w2: {
    border: "#ff007f",
const wheel2Colors = [
  '#196E2E', '#FFD700', '#4B2A85', // Section 1: Dark Green, Gold (Jackpot), Dark Purple
  '#0051A8', '#B31A37', '#B3241B', // Section 2: Ocean Blue, Shaded Pink, Crimson Red
  '#B3241B', '#0051A8', '#196E2E', // Section 3: Crimson Red, Ocean Blue, Dark Green
  '#4B2A85', '#B31A37', '#B3241B'  // Section 4: Dark Purple, Shaded Pink, Crimson Red
];
    
  },
  w3: {
    border: "#ffd700",
    const wheel3Colors = [
  '#66120E', '#0A3314', '#040E1C', // Section 1: Onyx Red, Deep Moss, Midnight Navy
  '#040E1C', '#FFD700', '#540A24', // Section 2: Midnight Navy, Gold (Jackpot), Dark Pink
  '#2C0D52', '#540A24', '#040E1C', // Section 3: Shadow Purple, Dark Pink, Midnight Navy
  '#0A3314', '#040E1C', '#2C0D52'  // Section 4: Deep Moss, Midnight Navy, Shadow Purple
];
    
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

