
let curGauge = "2/0 AWG (70 mm²)";
let curFuse = "250A Class-T";
let curAmps = 185.2;
let savedCircuits = [
  { name: "2200W Pure Sine Inverter Main Bus", amps: 185.2, gauge: "2/0 AWG (70 mm²)", fuse: "250A Class-T" },
  { name: "12V Diesel Air Heater (Glow Plug Peak)", amps: 14.5, gauge: "10 AWG (6 mm²)", fuse: "20A Blade" },
  { name: "50A Victron Orion XS DC-DC Charger", amps: 50.0, gauge: "6 AWG (16 mm²)", fuse: "60A MIDI" }
];

function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  if (idx === 0) calcWire();
  if (idx === 1) calcSolar();
  if (idx === 2) renderCircuits();
}

function calcWire() {
  const v = parseFloat(document.getElementById('sysVolt').value);
  const w = parseFloat(document.getElementById('loadWatts').value) || 1500;
  const ft = parseFloat(document.getElementById('cableFeet').value) || 6;
  const ah = parseFloat(document.getElementById('bankAh').value) || 300;
  const derate = parseFloat(document.getElementById('winterBattTemp').value);

  curAmps = +((w / 0.92) / v).toFixed(1);
  const roundTripFt = ft * 2;
  const cmil = (10.75 * curAmps * roundTripFt) / (v * 0.02);

  if (curAmps <= 35 && cmil < 10380) { curGauge = "10 AWG (6 mm²)"; curFuse = "40A ATC"; }
  else if (curAmps <= 65 && cmil < 26240) { curGauge = "6 AWG (16 mm²)"; curFuse = "80A MIDI"; }
  else if (curAmps <= 115 && cmil < 66360) { curGauge = "2 AWG (35 mm²)"; curFuse = "150A ANL"; }
  else if (curAmps <= 210) { curGauge = "2/0 AWG (70 mm²)"; curFuse = "250A Class-T"; }
  else { curGauge = "4/0 AWG (120 mm²)"; curFuse = "350A Class-T"; }

  const vDropPct = Math.min(2.8, Math.max(0.45, (curAmps * roundTripFt * 0.00012))).toFixed(2);
  const usableAh = Math.round(ah * derate);

  document.getElementById('kpiWireMain').textContent = `${curGauge} • ${curFuse} Fuse`;
  document.getElementById('kpiWireSub').textContent = `Peak Current: ${curAmps}A @ ${v}V • Voltage Drop: ${vDropPct}% • Winter Usable Bank: ${usableAh} Ah`;

  drawWireCanvas(v, w, curAmps, curGauge, curFuse, usableAh);
}

function drawWireCanvas(v, w, amps, gauge, fuse, usableAh) {
  const c = document.getElementById('wireCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#090f18';
  ctx.fillRect(0, 0, c.width, c.height);

  // Battery Bank Block
  ctx.fillStyle = '#065f46';
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3;
  ctx.fillRect(45, 95, 165, 145);
  ctx.strokeRect(45, 95, 165, 145);

  // Class-T Fuse Block
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = '#fbbf24';
  ctx.fillRect(265, 130, 135, 75);
  ctx.strokeRect(265, 130, 135, 75);

  // Pure Sine Inverter Block
  ctx.fillStyle = '#1e3a8a';
  ctx.strokeStyle = '#60a5fa';
  ctx.fillRect(465, 95, 170, 145);
  ctx.strokeRect(465, 95, 170, 145);

  // Positive Red Bus & Negative Black Bus
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(210, 150); ctx.lineTo(265, 150); ctx.moveTo(400, 150); ctx.lineTo(465, 150); ctx.stroke();
  ctx.strokeStyle = '#9ca3af';
  ctx.beginPath(); ctx.moveTo(210, 200); ctx.lineTo(465, 200); ctx.stroke();

  ctx.fillStyle = '#ecfdf5';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`LiFePO4 BANK`, 72, 135);
  ctx.fillText(`${v}V • ${usableAh} Ah`, 70, 162);
  ctx.fillText(`${Math.round(v*usableAh)} Wh`, 85, 188);

  ctx.fillStyle = '#fef3c7';
  ctx.fillText(fuse, 282, 172);

  ctx.fillStyle = '#e0f2fe';
  ctx.fillText(`INVERTER / LOAD`, 485, 135);
  ctx.fillText(`${w}W (${amps}A)`, 495, 165);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`CABLE SPEC: ${gauge} Marine Tinned Copper • ABYC/NEC Compliant`, 105, 42);
}

function calcSolar() {
  const sw = parseFloat(document.getElementById('solarWatts').value) || 400;
  const sh = parseFloat(document.getElementById('sunHours').value) || 2.0;
  const dcdc = parseFloat(document.getElementById('dcdcAmps').value) || 40;
  const load = parseFloat(document.getElementById('dailyWh').value) || 1500;
  const v = parseFloat(document.getElementById('sysVolt').value) || 12.8;
  const ah = parseFloat(document.getElementById('bankAh').value) || 400;

  const solarWh = Math.round(sw * sh * 0.82);
  const altWh = Math.round(dcdc * 13.4 * 1.0);
  const genWh = solarWh + altWh;
  const bankWh = v * ah * 0.9;
  const days = (bankWh / Math.max(200, load)).toFixed(1);

  document.getElementById('kpiSolarMain').textContent = `${days} Days Off-Grid Autonomy • +${genWh.toLocaleString()} Wh/day`;
  document.getElementById('kpiSolarSub').textContent = `Winter Solar: ${solarWh} Wh + 1hr DC-DC Alternator: ${altWh} Wh vs. Load: ${load} Wh`;

  const c = document.getElementById('solarCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#090f18';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = '#34d399';
  ctx.fillRect(120, 90, Math.min(480, Math.round(genWh / 6)), 45);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(120, 175, Math.min(480, Math.round(load / 6)), 45);

  ctx.fillStyle = '#ecfdf5';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`Daily Charge Harvest: ${genWh} Wh/day (Solar + Alternator)`, 120, 75);
  ctx.fillText(`Daily Winter Consumption: ${load} Wh/day (Diesel Heater, Fridge, Starlink)`, 120, 160);
  ctx.fillText(`Total Stored LiFePO4 Energy: ${Math.round(bankWh).toLocaleString()} Wh (${days} Days Zero-Sun Backup)`, 120, 275);
}

function saveCircuit() {
  const w = document.getElementById('loadWatts').value;
  const ft = document.getElementById('cableFeet').value;
  savedCircuits.push({
    name: `Custom ${w}W DC Circuit (${ft} ft)`,
    amps: curAmps,
    gauge: curGauge,
    fuse: curFuse
  });
  switchTab(2);
}

function removeCircuit(i) {
  savedCircuits.splice(i, 1);
  renderCircuits();
}

function renderCircuits() {
  const box = document.getElementById('circuitList');
  box.innerHTML = savedCircuits.map((c, i) => `<div class="list-item">
    <div><strong>${c.name}</strong><span>${c.amps} A Peak • Cable: ${c.gauge} • Protection: ${c.fuse}</span></div>
    <button class="del-btn" onclick="removeCircuit(${i})">Remove</button>
  </div>`).join('');
}

window.onload = () => { calcWire(); calcSolar(); renderCircuits(); };
