
let curPsf = 26.4;
let curTons = 19.8;
let savedRoofs = [
  { name: "Main Residence Gable Roof (1,500 ft²)", psf: 26.4, tons: 19.8, status: "SAFE (66%)" },
  { name: "Detached Garage & Workshop (750 ft²)", psf: 29.5, tons: 11.1, status: "WARNING (74%)" }
];

function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  if (idx === 0) calcSnow();
  if (idx === 1) calcIce();
  if (idx === 2) renderRoofs();
}

function calcSnow() {
  const psfPerInch = parseFloat(document.getElementById('snowType').value);
  const depth = parseFloat(document.getElementById('snowDepth').value) || 12;
  const area = parseFloat(document.getElementById('roofArea').value) || 1200;
  const cs = parseFloat(document.getElementById('roofPitch').value);
  const limit = parseFloat(document.getElementById('roofLimit').value);
  const ce = parseFloat(document.getElementById('driftFactor').value);

  curPsf = +(depth * psfPerInch * cs * ce).toFixed(1);
  const kpa = (curPsf * 0.04788).toFixed(2);
  curTons = +((curPsf * area) / 2000).toFixed(2);
  const pct = Math.round((curPsf / limit) * 100);
  const status = pct < 70 ? 'SAFE' : (pct < 95 ? 'CAUTION — RAKE EAVES' : 'CRITICAL — RAKE ROOF NOW');

  document.getElementById('kpiSnowMain').textContent = `${curPsf} PSF (${kpa} kN/m²) • Total Snow Mass: ${curTons} Tons`;
  document.getElementById('kpiSnowSub').textContent = `STATUS: ${status} (${pct}% of ${limit} PSF Structural Limit) • Slope Factor Cs: ${cs}`;

  drawSnowCanvas(depth, curPsf, curTons, pct, limit);
}

function drawSnowCanvas(depth, psf, tons, pct, limit) {
  const c = document.getElementById('snowCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#09101f';
  ctx.fillRect(0, 0, c.width, c.height);

  // House body & Roof trusses
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.strokeRect(140, 175, 400, 130);

  // Roof triangle
  ctx.beginPath();
  ctx.moveTo(110, 175);
  ctx.lineTo(340, 75);
  ctx.lineTo(570, 175);
  ctx.closePath();
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.stroke();

  // Snow Pack Blanket on Roof
  const snowH = Math.min(48, Math.max(10, depth * 1.1));
  ctx.beginPath();
  ctx.moveTo(105, 175);
  ctx.lineTo(340, 75);
  ctx.lineTo(575, 175);
  ctx.lineTo(575, 175 - snowH);
  ctx.lineTo(340, 75 - snowH);
  ctx.lineTo(105, 175 - snowH);
  ctx.closePath();
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.stroke();

  // Downward structural load arrows
  ctx.fillStyle = pct >= 95 ? '#ef4444' : (pct >= 70 ? '#f59e0b' : '#38bdf8');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`SNOW PACK: ${depth}" Depth • ${psf} PSF (${(tons*2000).toLocaleString()} lbs Total)`, 145, 34);
  ctx.fillText(`STRUCTURAL GAUGE: ${pct}% of ${limit} PSF Truss Capacity`, 155, 240);

  // Stress bar inside house
  ctx.fillStyle = '#334155';
  ctx.fillRect(165, 255, 350, 22);
  ctx.fillStyle = pct >= 95 ? '#ef4444' : (pct >= 70 ? '#f59e0b' : '#22c55e');
  ctx.fillRect(165, 255, Math.min(350, Math.round(350 * (pct / 100))), 22);
}

function calcIce() {
  const area = parseFloat(document.getElementById('atticArea').value) || 1500;
  const rVal = parseFloat(document.getElementById('atticR').value);
  const outT = parseFloat(document.getElementById('outTempIce').value) || 20;
  const ratio = parseFloat(document.getElementById('ventRatio').value);

  const nfaSqIn = Math.round((area / ratio) * 144);
  const soffitIn = Math.round(nfaSqIn / 2);
  const risk = (rVal < 30 && outT < 28) ? 'HIGH ICE-DAM RISK' : (rVal < 49 ? 'MODERATE RISK' : 'LOW RISK (COLD ROOF)');

  document.getElementById('kpiIceMain').textContent = `${risk} • Required NFA: ${nfaSqIn} sq in`;
  document.getElementById('kpiIceSub').textContent = `Balanced Airflow: ${soffitIn} sq in Soffit Intake + ${soffitIn} sq in Ridge Exhaust (Attic R-${rVal})`;

  const c = document.getElementById('iceCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#09101f';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, 230);
  ctx.lineTo(340, 70);
  ctx.lineTo(580, 230);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`Soffit Intake: ${soffitIn} sq in -> Cold Baffle Channel -> Ridge Exhaust: ${soffitIn} sq in`, 85, 36);
  ctx.fillStyle = '#fb923c';
  ctx.fillText(`Attic Floor Insulation: R-${rVal} • Outdoor Eave Temp: ${outT}°F`, 165, 200);
}

function saveRoof() {
  const area = document.getElementById('roofArea').value;
  const depth = document.getElementById('snowDepth').value;
  savedRoofs.push({
    name: `Roof Section (${area} ft² • ${depth}" Snow)`,
    psf: curPsf,
    tons: curTons,
    status: `${curPsf} PSF (${curTons} Tons)`
  });
  switchTab(2);
}

function removeRoof(i) {
  savedRoofs.splice(i, 1);
  renderRoofs();
}

function renderRoofs() {
  const box = document.getElementById('roofList');
  let totTons = 0;
  box.innerHTML = savedRoofs.map((r, i) => {
    totTons += r.tons;
    return `<div class="list-item">
      <div><strong>${r.name}</strong><span>${r.psf} PSF • ${r.tons} Tons (${(r.tons*2000).toLocaleString()} lbs) • ${r.status}</span></div>
      <button class="del-btn" onclick="removeRoof(${i})">Remove</button>
    </div>`;
  }).join('') + `<div class="kpi-banner" style="margin-top:10px">
    <div class="kpi-main">Total Property Roof Snow Mass: ${totTons.toFixed(2)} Tons (${Math.round(totTons*2000).toLocaleString()} lbs)</div>
    <div class="kpi-sub">${savedRoofs.length} Roof Structures Monitored • 100% Offline ASCE-7 / Eurocode Calculator</div>
  </div>`;
}

window.onload = () => { calcSnow(); calcIce(); renderRoofs(); };
