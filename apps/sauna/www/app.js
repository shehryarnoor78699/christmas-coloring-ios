
let curSaunaKw = 9.0;
let curCorrCf = 422;
let savedSaunas = [
  { name: "Backyard Cedar Sauna (7' x 6' x 7')", kw: "9.0 kW Stove", spec: "422 ft³ Corrected • 50A 240V (US) / 3x16A 400V (EU)" }
];

function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  if (idx === 0) calcSauna();
  if (idx === 1) calcBench();
  if (idx === 2) renderSaunas();
}

function calcSauna() {
  const L = parseFloat(document.getElementById('snLen').value) || 7;
  const W = parseFloat(document.getElementById('snWid').value) || 6;
  const H = parseFloat(document.getElementById('snHgt').value) || 7;
  const glass = parseFloat(document.getElementById('snGlass').value) || 18;
  const stone = parseFloat(document.getElementById('snStone').value) || 15;
  const mult = parseFloat(document.getElementById('snWall').value);

  const physCf = Math.round(L * W * H);
  const penaltyCf = Math.round((glass + stone) * 3.3);
  curCorrCf = Math.round((physCf + penaltyCf) * mult);
  const corrM3 = (curCorrCf * 0.0283168).toFixed(1);

  if (curCorrCf <= 210) curSaunaKw = 4.5;
  else if (curCorrCf <= 300) curSaunaKw = 6.0;
  else if (curCorrCf <= 400) curSaunaKw = 8.0;
  else if (curCorrCf <= 500) curSaunaKw = 9.0;
  else if (curCorrCf <= 620) curSaunaKw = 10.5;
  else curSaunaKw = 12.0;

  const breakerUS = curSaunaKw <= 6 ? "30A (10 AWG)" : (curSaunaKw <= 8 ? "40A (8 AWG)" : "50A (6 AWG)");

  document.getElementById('kpiSaunaMain').textContent = `${curSaunaKw.toFixed(1)} kW Sauna Stove • ${curCorrCf} ft³ (${corrM3} m³) Effective`;
  document.getElementById('kpiSaunaSub').textContent = `Physical: ${physCf} ft³ + Glass/Stone Loss: +${penaltyCf} ft³ • US 240V: ${breakerUS} | EU 400V: 3x16A (2.5 mm²)`;

  drawSaunaCanvas(physCf, penaltyCf, curCorrCf, curSaunaKw);
}

function drawSaunaCanvas(physCf, penCf, corrCf, kw) {
  const c = document.getElementById('saunaCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#140c08';
  ctx.fillRect(0, 0, c.width, c.height);

  // Sauna Cabin Cross-Section
  const rx = 100, ry = 45, rw = 480, rh = 240;
  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 4;
  ctx.strokeRect(rx, ry, rw, rh);

  // Thermal stratification gradient
  const grad = ctx.createLinearGradient(rx, ry, rx, ry + rh);
  grad.addColorStop(0, 'rgba(234, 88, 12, 0.42)');
  grad.addColorStop(0.55, 'rgba(251, 146, 60, 0.20)');
  grad.addColorStop(1, 'rgba(56, 189, 248, 0.12)');
  ctx.fillStyle = grad;
  ctx.fillRect(rx + 2, ry + 2, rw - 4, rh - 4);

  // Heater Pillar with Stones on left
  ctx.fillStyle = '#57534e';
  ctx.fillRect(rx + 28, ry + 130, 68, 108);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(rx + 34, ry + 115, 56, 22);

  // 2-Tier Cedar Benches on right
  ctx.fillStyle = '#d97706';
  ctx.fillRect(rx + 290, ry + 110, 175, 18); // Upper bench above stone line!
  ctx.fillRect(rx + 220, ry + 165, 140, 18); // Foot bench above stone line!

  // Dashed horizontal "Stone Plane (Loyly Line)"
  ctx.strokeStyle = '#fde047';
  ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(rx + 15, ry + 125); ctx.lineTo(rx + rw - 15, ry + 125); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#fff7ed';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`195°F (90°C) LOYLY STEAM ZONE`, rx + 165, ry + 32);
  ctx.fillStyle = '#fde047';
  ctx.fillText(`STONE PLANE — FEET ABOVE STONES`, rx + 120, ry + 118);
  ctx.fillStyle = '#fed7aa';
  ctx.fillText(`${kw} kW STOVE • Effective Thermal Volume: ${corrCf} ft³`, rx + 115, 318);
}

function calcBench() {
  const H = (parseFloat(document.getElementById('snHgt').value) || 7) * 12;
  const stH = parseFloat(document.getElementById('stoveH').value) || 24;
  const bathers = parseFloat(document.getElementById('bathers').value) || 4;
  const upperH = Math.round(H - 42);
  const footH = Math.max(stH + 2, Math.round(upperH - 16));

  document.getElementById('kpiBenchMain').textContent = `Upper Bench: ${upperH}" • Foot Bench: ${footH}" (Stove Top: ${stH}")`;
  document.getElementById('kpiBenchSub').textContent = `Foot Bench is +${footH - stH}" Above Stones • Min Bench Length for ${bathers} Bathers: ${bathers * 24}" (${bathers * 2} ft)`;

  const c = document.getElementById('benchCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#140c08';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = '#fb923c';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`TRUMPKIN / FINNISH VTT MECHANICAL DOWNDRAFT VENTILATION`, 85, 42);
  ctx.fillStyle = '#fff7ed';
  ctx.fillText(`Fresh Intake: High Above Heater -> Circular Loyly Loop -> Exhaust: Below Foot Bench`, 42, 145);
  ctx.fillText(`Upper Sitting Bench: ${upperH}" from Floor (42" Ceiling Clearance) | Foot Bench: ${footH}"`, 42, 215);
}

function saveSauna() {
  const L = document.getElementById('snLen').value;
  const W = document.getElementById('snWid').value;
  const H = document.getElementById('snHgt').value;
  savedSaunas.push({
    name: `Custom Sauna (${L}' x ${W}' x ${H}')`,
    kw: `${curSaunaKw.toFixed(1)} kW Heater`,
    spec: `${curCorrCf} ft³ Effective Thermal Volume`
  });
  switchTab(2);
}

function removeSauna(i) {
  savedSaunas.splice(i, 1);
  renderSaunas();
}

function renderSaunas() {
  const box = document.getElementById('saunaList');
  box.innerHTML = savedSaunas.map((s, i) => `<div class="list-item">
    <div><strong>${s.name}</strong><span>${s.kw} • ${s.spec}</span></div>
    <button class="del-btn" onclick="removeSauna(${i})">Remove</button>
  </div>`).join('');
}

window.onload = () => { calcSauna(); calcBench(); renderSaunas(); };
