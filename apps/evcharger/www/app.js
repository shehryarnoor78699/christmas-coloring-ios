
let curBreaker = 60;
let curWire = "6 AWG (16 mm²)";
let curKw = 11.5;
let savedLoads = [
  { name: "48A Level-2 Hardwired EV Wallbox (125% NEC)", amps: 60, kw: 11.5, note: "6 AWG THHN Copper • 60A 2-Pole" },
  { name: "3-Ton Cold-Climate Heat Pump Condenser", amps: 35, kw: 7.2, note: "8 AWG Copper • 35A Breaker" },
  { name: "Induction Range & Convection Oven", amps: 40, kw: 9.6, note: "8 AWG Copper • 40A Breaker" }
];

function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  if (idx === 0) calcEv();
  if (idx === 1) calcCharge();
  if (idx === 2) renderEvLoads();
}

function calcEv() {
  const grid = document.getElementById('evGrid').value;
  const amps = parseFloat(document.getElementById('evAmps').value);
  const panel = parseFloat(document.getElementById('mainPanel').value);
  const baseA = parseFloat(document.getElementById('baseLoadA').value) || 75;
  const wType = document.getElementById('wireType').value;

  curBreaker = Math.ceil((amps * 1.25) / 5) * 5;
  curKw = grid === 'EU' ? +((amps * 400 * 1.732) / 1000).toFixed(1) : +((amps * (grid === 'UK' ? 230 : 240)) / 1000).toFixed(1);

  if (curBreaker <= 20) curWire = "12 AWG (4 mm²)";
  else if (curBreaker <= 40) curWire = "8 AWG (10 mm²)";
  else if (curBreaker <= 50) curWire = wType === 'NM' ? "6 AWG NM-B (16 mm²)" : "8 AWG THHN (10 mm²)";
  else if (curBreaker <= 60) curWire = wType === 'NM' ? "4 AWG NM-B (25 mm²)" : "6 AWG THHN (16 mm²)";
  else curWire = "4 AWG THHN (25 mm²)";

  const totalA = baseA + curBreaker;
  const pct = Math.round((totalA / panel) * 100);
  const status = pct <= 85 ? 'PASS — SAFE PANEL HEADROOM' : (pct <= 100 ? 'BORDERLINE — CONSIDER CT LOAD MANAGEMENT' : 'OVERLOAD — ADD DCC/CT LOAD SHEDDER OR 200A UPGRADE');

  document.getElementById('kpiEvMain').textContent = `${curBreaker}A Breaker • ${curWire}`;
  document.getElementById('kpiEvSub').textContent = `${amps}A Continuous (${curKw} kW) • Panel Total: ${totalA}A / ${panel}A (${pct}% — ${status})`;

  drawEvCanvas(panel, baseA, curBreaker, amps, curKw, pct);
}

function drawEvCanvas(panel, baseA, breaker, amps, kw, pct) {
  const c = document.getElementById('evCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#07101c';
  ctx.fillRect(0, 0, c.width, c.height);

  // Main Service Panel Box
  ctx.fillStyle = '#112236';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.fillRect(45, 55, 220, 235);
  ctx.strokeRect(45, 55, 220, 235);

  ctx.fillStyle = '#f0f9ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`MAIN PANEL (${panel}A)`, 78, 82);

  // Load Utilization Bar inside Panel
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(70, 100, 170, 24);
  ctx.fillStyle = pct > 100 ? '#ef4444' : (pct > 85 ? '#f59e0b' : '#22c55e');
  ctx.fillRect(70, 100, Math.min(170, Math.round(170 * (pct / 100))), 24);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`${baseA + breaker}A / ${panel}A (${pct}%)`, 95, 117);

  // Dedicated EV Breaker Slot
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(70, 145, 170, 48);
  ctx.fillStyle = '#fff';
  ctx.fillText(`EVSE DEDICATED BREAKER`, 78, 165);
  ctx.fillText(`${breaker}A (125% of ${amps}A)`, 92, 184);

  // Conduit to Wallbox
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(265, 170); ctx.lineTo(435, 170); ctx.stroke();

  // Wallbox Unit
  ctx.fillStyle = '#0f2942';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.fillRect(435, 85, 195, 175);
  ctx.strokeRect(435, 85, 195, 175);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`EV WALLBOX`, 478, 125);
  ctx.fillStyle = '#f0f9ff';
  ctx.fillText(`${kw} kW (${amps}A)`, 480, 155);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#93c5fd';
  ctx.fillText(curWire, 472, 185);
}

function calcCharge() {
  const kwh = parseFloat(document.getElementById('battKwh').value) || 75;
  const wMult = parseFloat(document.getElementById('winterEvTemp').value);
  const rate = parseFloat(document.getElementById('nightRate').value) || 0.10;
  const win = parseFloat(document.getElementById('socWindow').value);

  const netKwh = kwh * win;
  const wallKwh = +(netKwh * 1.06 * wMult).toFixed(1);
  const hrs = wallKwh / Math.max(3.6, curKw);
  const hInt = Math.floor(hrs);
  const mInt = Math.round((hrs - hInt) * 60);
  const cost = (wallKwh * rate).toFixed(2);
  const miles = Math.round(netKwh * 3.3);

  document.getElementById('kpiChgMain').textContent = `${hInt}h ${mInt}m Charge Time • $${cost} Off-Peak`;
  document.getElementById('kpiChgSub').textContent = `Grid Draw: ${wallKwh} kWh (incl. Winter Thermal Prep) • Range Added: +${miles} mi (+${Math.round(miles*1.61)} km)`;

  const c = document.getElementById('chargeCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#07101c';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(90, 95, 490, 48);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(90, 95, Math.round(490 * win), 48);

  ctx.fillStyle = '#f0f9ff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`OVERNIGHT OFF-PEAK CHARGE WINDOW: ${hInt} hrs ${mInt} mins @ ${curKw} kW`, 95, 72);
  ctx.fillText(`Delivered to Pack: ${netKwh.toFixed(1)} kWh | Wall Meter Draw: ${wallKwh} kWh ($${cost})`, 95, 195);
}

function saveEvLoad() {
  savedLoads.push({
    name: `${curKw} kW EV Charger Circuit`,
    amps: curBreaker,
    kw: curKw,
    note: `${curWire} • ${curBreaker}A Breaker (NEC 625.41)`
  });
  switchTab(2);
}

function removeEvLoad(i) {
  savedLoads.splice(i, 1);
  renderEvLoads();
}

function renderEvLoads() {
  const box = document.getElementById('evLoadList');
  let totA = 0;
  box.innerHTML = savedLoads.map((l, i) => {
    totA += l.amps;
    return `<div class="list-item">
      <div><strong>${l.name}</strong><span>${l.amps}A Breaker (${l.kw} kW) • ${l.note}</span></div>
      <button class="del-btn" onclick="removeEvLoad(${i})">Remove</button>
    </div>`;
  }).join('');
}

window.onload = () => { calcEv(); calcCharge(); renderEvLoads(); };
