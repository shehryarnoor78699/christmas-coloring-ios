
let currentBtu = 18400;
let currentKw = 5.39;
let savedZones = [
  { name: "Living Room & Kitchen Zone", btu: 18400, kw: 5.39, unit: "18k BTU (5.3 kW) Wall Split" },
  { name: "Master Bedroom Suite", btu: 9200, kw: 2.70, unit: "9k BTU (2.6 kW) Low-Noise Head" }
];

function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  if (idx === 0) calcHeat();
  if (idx === 1) calcCop();
  if (idx === 2) renderZones();
}

function calcHeat() {
  const reg = document.getElementById('regionUnit').value;
  const wTemp = parseFloat(document.getElementById('winterTemp').value);
  let area = parseFloat(document.getElementById('floorArea').value) || 400;
  let ceil = parseFloat(document.getElementById('ceilHeight').value) || 8.5;
  const insul = parseFloat(document.getElementById('insulGrade').value);
  const glass = parseFloat(document.getElementById('glassRatio').value);

  const areaSqFt = (reg === 'US') ? area : area * 10.7639;
  const ceilFt = (reg === 'US' || ceil > 4.5) ? ceil : ceil * 3.28084;
  const deltaTF = 70 - wTemp;

  const baseBtu = areaSqFt * (ceilFt / 8.0) * (deltaTF * 0.62) * insul * glass;
  currentBtu = Math.round(baseBtu / 100) * 100;
  currentKw = +(currentBtu * 0.000293071).toFixed(2);

  const sizes = [9000, 12000, 15000, 18000, 24000, 30000, 36000, 48000, 60000];
  const recBtu = sizes.find(s => s >= currentBtu) || 60000;
  const recTon = (recBtu / 12000).toFixed(1);
  const recKw = (recBtu * 0.000293071).toFixed(1);

  document.getElementById('kpiHeatMain').textContent =
    reg === 'EU' ? `${currentKw} kW (${currentBtu.toLocaleString()} BTU/hr)` : `${currentBtu.toLocaleString()} BTU/hr (${currentKw} kW)`;
  document.getElementById('kpiHeatSub').textContent =
    `Recommended Unit: ${(recBtu/1000)}k BTU (${recTon} Ton / ${recKw} kW) Cold-Climate Inverter • ΔT: ${deltaTF}°F`;

  drawHeatCanvas(areaSqFt, currentBtu, currentKw, wTemp, insul);
}

function drawHeatCanvas(areaSqFt, btu, kw, wTemp, insul) {
  const c = document.getElementById('heatCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);

  ctx.fillStyle = '#091224';
  ctx.fillRect(0, 0, c.width, c.height);

  // Room Cross-Section Envelope
  const rx = 120, ry = 65, rw = 440, rh = 215;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(rx, ry, rw, rh);

  // Roof gable
  ctx.beginPath();
  ctx.moveTo(rx - 20, ry);
  ctx.lineTo(rx + rw / 2, 22);
  ctx.lineTo(rx + rw + 20, ry);
  ctx.closePath();
  ctx.fillStyle = 'rgba(2, 132, 199, 0.22)';
  ctx.fill();
  ctx.stroke();

  // Indoor Thermal Gradient
  const grad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
  grad.addColorStop(0, 'rgba(249, 115, 22, 0.30)');
  grad.addColorStop(1, 'rgba(56, 189, 248, 0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(rx + 2, ry + 2, rw - 4, rh - 4);

  // Wall-mounted Mini Split Head
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(rx + 24, ry + 24, 120, 32);
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('INVERTER HEAD', rx + 36, ry + 44);

  // Warm airflow arcs
  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(rx + 60 + i * 24, ry + 58);
    ctx.quadraticCurveTo(rx + 140 + i * 35, ry + 135, rx + 260 + i * 40, ry + 175);
    ctx.stroke();
  }

  // Heat-loss arrows through walls & roof
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`OUTDOOR: ${wTemp}°F (${Math.round((wTemp-32)*5/9)}°C)`, 16, 36);
  ctx.fillStyle = '#fdba74';
  ctx.fillText(`INDOOR TARGET: 70°F (21°C)`, rx + 150, ry + 44);

  ctx.fillStyle = '#f0f9ff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Thermal Load: ${btu.toLocaleString()} BTU/hr (${kw} kW)`, rx + 75, ry + 135);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#93c5fd';
  ctx.fillText(`Roof Loss: ${Math.round(btu*0.28)} BTU | Wall/Window Loss: ${Math.round(btu*0.52)} BTU | Air Infiltration: ${Math.round(btu*0.20)} BTU`, 45, 315);
}

function calcCop() {
  const cop = parseFloat(document.getElementById('hpTech').value);
  const fuel = document.getElementById('legacyFuel').value;
  const rate = parseFloat(document.getElementById('elecRate').value) || 0.18;
  const hrs = parseFloat(document.getElementById('winterHours').value) || 1800;

  const seasonKwhThermal = currentKw * hrs * 0.55;
  const hpCost = Math.round((seasonKwhThermal / cop) * rate);
  const mult = fuel === 'electric' ? 1.0 : (fuel === 'oil' ? 1.35 : (fuel === 'lpg' ? 1.25 : 1.75));
  const legacyCost = Math.round((seasonKwhThermal / mult) * rate);
  const diff = legacyCost - hpCost;

  document.getElementById('kpiCopMain').textContent =
    `Seasonal SCOP: ${cop.toFixed(2)} • Winter Savings: $${Math.max(120, diff)}/yr`;
  document.getElementById('kpiCopSub').textContent =
    `Heat Pump Winter Cost: $${hpCost} vs. Legacy System: $${Math.max(hpCost + 120, legacyCost)} (${Math.round(seasonKwhThermal)} kWh thermal)`;

  const c = document.getElementById('copCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#091224';
  ctx.fillRect(0, 0, c.width, c.height);

  const maxC = Math.max(hpCost, legacyCost, 500);
  const h1 = Math.round((hpCost / maxC) * 180);
  const h2 = Math.round((Math.max(hpCost + 120, legacyCost) / maxC) * 180);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(140, 250 - h1, 130, h1);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(390, 250 - h2, 130, h2);

  ctx.fillStyle = '#f0f9ff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Heat Pump ($${hpCost})`, 135, 280);
  ctx.fillText(`Legacy System ($${Math.max(hpCost+120, legacyCost)})`, 370, 280);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillText(`COLD-CLIMATE COP CURVE COMPARISON (SCOP ${cop.toFixed(2)})`, 145, 36);
}

function saveZone() {
  const reg = document.getElementById('regionUnit').value;
  const area = document.getElementById('floorArea').value;
  savedZones.push({
    name: `Room Zone (${area} ${reg === 'US' ? 'ft²' : 'm²'})`,
    btu: currentBtu,
    kw: currentKw,
    unit: `${Math.ceil(currentBtu/3000)*3}k BTU (${currentKw} kW) Split`
  });
  switchTab(2);
}

function removeZone(i) {
  savedZones.splice(i, 1);
  renderZones();
}

function renderZones() {
  const box = document.getElementById('zoneList');
  let totalBtu = 0, totalKw = 0;
  box.innerHTML = savedZones.map((z, i) => {
    totalBtu += z.btu;
    totalKw += z.kw;
    return `<div class="list-item">
      <div><strong>${z.name}</strong><span>${z.btu.toLocaleString()} BTU/hr (${z.kw.toFixed(2)} kW) • ${z.unit}</span></div>
      <button class="del-btn" onclick="removeZone(${i})">Remove</button>
    </div>`;
  }).join('') + `<div class="kpi-banner" style="margin-top:10px">
    <div class="kpi-main">Total Multi-Zone Load: ${totalBtu.toLocaleString()} BTU/hr (${totalKw.toFixed(2)} kW)</div>
    <div class="kpi-sub">${savedZones.length} Zones Configured • Outdoor Condenser Sizing: ${(totalBtu/12000).toFixed(1)} Tons</div>
  </div>`;
}

window.onload = () => { calcHeat(); calcCop(); renderZones(); };
