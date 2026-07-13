// Color layouts mapping
const wheelThemes = {
  w1: {
    Q1: ["#00f0ff", "#00d0ef", "#00b0df", "#0090cf"],
    Q2: ["#39ff14", "#2ecc71", "#27ae60", "#1e824c"],
    Q3: ["#ff007f", "#e6194b", "#c51130", "#990011"],
    Q4: ["#ff9f43", "#f39c12", "#e67e22", "#d35400"]
  },
  w2: {
    Q1: ["#9b5de5", "#8338ec", "#7209b7", "#560bad"],
    Q2: ["#f15bb5", "#ff006e", "#d90429", "#a60000"],
    Q3: ["#00f5d4", "#00bbf9", "#0096c7", "#03045e"],
    Q4: ["#ffea00", "#ffcc00", "#ffa600", "#ff7b00"]
  },
  w3: {
    Q1: ["#a8ff78", "#78ffd6", "#4ca1af", "#2c3e50"],
    Q2: ["#fd746c", "#ff9068", "#f12711", "#f5af19"],
    Q3: ["#6441a5", "#2a0845", "#41295a", "#2F0743"],
    Q4: ["#45aaf2", "#2d98da", "#3a3a5c", "#ffd700"] // Special Gold Spot Slot
  }
};

const productPrizes = [
  "https://picsum.photos", 
  "https://picsum.photos", 
  "https://picsum.photos", 
  "https://picsum.photos"
];

let spinLogs = { w1: 0, w2: 0, w3: 0 };

function buildGameWheels() {
  ["w1", "w2", "w3"].forEach(id => {
    const svg = document.getElementById(id);
    let slicesHTML = "";
    const theme = wheelThemes[id];
    const masterColors = [...theme.Q1, ...theme.Q2, ...theme.Q3, ...theme.Q4];
    
    // Draw slices cleanly with no interior dividing borders
    for (let s = 0; s < 16; s++) {
      const angleStart = s * 22.5;
      const angleEnd = (s + 1) * 22.5;
      
      const radStart = (angleStart - 90) * Math.PI / 180;
      const radEnd = (angleEnd - 90) * Math.PI / 180;
      
      const x1 = 100 + 100 * Math.cos(radStart);
      const y1 = 100 + 100 * Math.sin(radStart);
      const x2 = 100 + 100 * Math.cos(radEnd);
      const y2 = 100 + 100 * Math.sin(radEnd);
      
      slicesHTML += `
        <path d="M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z" 
              fill="${masterColors[s]}" 
              stroke="none"/>
      `;
    }

    // Draw the 4 bold black dividing borders explicitly between quarters
    for (let q = 0; q < 4; q++) {
      const quarterAngle = q * 90;
      const radQuarter = (quarterAngle - 90) * Math.PI / 180;
      const xLine = 100 + 100 * Math.cos(radQuarter);
      const yLine = 100 + 100 * Math.sin(radQuarter);

      slicesHTML += `
        <line x1="100" y1="100" x2="${xLine}" y2="${yLine}" 
              stroke="#000000" stroke-width="4" stroke-linecap="round"/>
      `;
    }
    svg.innerHTML = slicesHTML;
  });
}

function spinEngine(id) {
  const wheel = document.getElementById(id);
  const btn = document.getElementById('btn-' + id);
  btn.disabled = true;
  
  const degreesToTurn = Math.floor(2160 + Math.random() * 1440);
  spinLogs[id] += degreesToTurn;
  
  wheel.style.transform = `rotate(${spinLogs[id]}deg)`;
  
  setTimeout(() => {
    const absoluteDegrees = spinLogs[id] % 360;
    const needleAngle = (360 - absoluteDegrees) % 360;
    
    let targetQuarter = "Q1";
    if (needleAngle >= 0 && needleAngle < 90) targetQuarter = "Q1";
    else if (needleAngle >= 90 && needleAngle < 180) targetQuarter = "Q2";
    else if (needleAngle >= 180 && needleAngle < 270) targetQuarter = "Q3";
    else targetQuarter = "Q4";
    
    launchBoxPresentation(id, targetQuarter);
    btn.disabled = false;
  }, 4800);
}

function launchBoxPresentation(wheelId, quarterKey) {
  const targetDataset = wheelThemes[wheelId][quarterKey];
  const frame = document.getElementById('modalFrame');
  
  if(wheelId === "w1") frame.style.borderColor = "#00ffff";
  else if(wheelId === "w2") frame.style.borderColor = "#ff007f";
  else frame.style.borderColor = "#ffd700";

  document.getElementById('modalTitle').innerText = `${quarterKey === "Q4" && wheelId === "w3" ? "🏆 GOLD JACKPOT UNLOCKED!" : "Section Cleared!"}`;
  
  const grid = document.getElementById('boxesGrid');
  grid.innerHTML = ""; 
  
  targetDataset.forEach((color, index) => {
    const box = document.createElement('div');
    box.className = 'prize-box';
    box.onclick = () => box.classList.toggle('opened');
    box.innerHTML = `
      <div class="box-inner">
        <div class="box-front" style="background: ${color};">Item ${index + 1}</div>
        <div class="box-back"><img src="${productPrizes[index]}" alt="Prize Visual"></div>
      </div>
    `;
    grid.appendChild(box);
  });
  
  const modal = document.getElementById('boxModal');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
  const modal = document.getElementById('boxModal');
  modal.classList.remove('active');
  setTimeout(() => modal.style.display = 'none', 400);
}

window.onload = buildGameWheels;

