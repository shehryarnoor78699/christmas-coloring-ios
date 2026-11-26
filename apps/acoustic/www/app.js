
let curF1L = 35.3, curF1W = 47.1, curF1H = 62.8;
let savedRooms = [
  { name: "Main Mastering Suite (16' x 12' x 9')", modes: "35.3 Hz / 47.1 Hz / 62.8 Hz", traps: "4 Corner Traps + 8 Wall + 2 Cloud Panels" }
];

function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  if (idx === 0) calcRoom();
  if (idx === 1) calcRt();
  if (idx === 2) renderRooms();
}

function calcRoom() {
  const L = parseFloat(document.getElementById('rmLen').value) || 16;
  const W = parseFloat(document.getElementById('rmWid').value) || 12;
  const H = parseFloat(document.getElementById('rmHgt').value) || 9;

  curF1L = +(1130 / (2 * L)).toFixed(1);
  curF1W = +(1130 / (2 * W)).toFixed(1);
  curF1H = +(1130 / (2 * H)).toFixed(1);
  const sweet = (L * 0.38).toFixed(2);
  const vol = L * W * H;
  const schroeder = Math.round(2000 * Math.sqrt(0.28 / (vol * 0.0283)));

  document.getElementById('kpiRoomMain').textContent = `Axial F1 Modes: ${curF1L} Hz (L) • ${curF1W} Hz (W) • ${curF1H} Hz (H)`;
  document.getElementById('kpiRoomSub').textContent = `38% Mix Sweet Spot: ${sweet} ft from Front Wall • First Reflection Panels @ ${(L*0.24).toFixed(1)} ft`;

  drawRoomCanvas(L, W, sweet, curF1L, curF1W);
}

function drawRoomCanvas(L, W, sweet, fL, fW) {
  const c = document.getElementById('roomCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#0c0a14';
  ctx.fillRect(0, 0, c.width, c.height);

  const rx = 120, ry = 35, rw = 440, rh = 265;
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 3;
  ctx.strokeRect(rx, ry, rw, rh);

  // Corner Bass Traps (4 triangles)
  ctx.fillStyle = '#7c3aed';
  [[rx, ry, 42, 42], [rx+rw-42, ry, 42, 42], [rx, ry+rh-42, 42, 42], [rx+rw-42, ry+rh-42, 42, 42]].forEach(b => {
    ctx.fillRect(b[0], b[1], b[2], b[3]);
  });

  // Side-wall First Reflection Absorbers
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(rx - 6, ry + 75, 12, 65);
  ctx.fillRect(rx + rw - 6, ry + 75, 12, 65);

  // Studio Monitors (L & R) + 38% Listening Position
  const mixY = ry + Math.round(rh * 0.38);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(rx + 95, ry + 32, 32, 24);
  ctx.fillRect(rx + rw - 127, ry + 32, 32, 24);

  // Reflection Ray Lines
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rx + 111, ry + 56);
  ctx.lineTo(rx + 6, ry + 105);
  ctx.lineTo(rx + rw / 2, mixY);
  ctx.moveTo(rx + rw - 111, ry + 56);
  ctx.lineTo(rx + rw - 6, ry + 105);
  ctx.lineTo(rx + rw / 2, mixY);
  ctx.stroke();

  // Sweet spot circle
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(rx + rw / 2, mixY, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f5f3ff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`38% SWEET SPOT (${sweet} ft)`, rx + rw / 2 - 85, mixY + 34);
  ctx.fillStyle = '#c4b5fd';
  ctx.fillText(`CORNER BASS TRAPS (${fL}Hz / ${fW}Hz) + FIRST-REFLECTION MIRROR POINTS`, 72, 324);
}

function calcRt() {
  const L = parseFloat(document.getElementById('rmLen').value) || 16;
  const W = parseFloat(document.getElementById('rmWid').value) || 12;
  const H = parseFloat(document.getElementById('rmHgt').value) || 9;
  const alpha = parseFloat(document.getElementById('surfType').value);
  const panels = parseFloat(document.getElementById('numPanels').value) || 6;
  const traps = parseFloat(document.getElementById('numTraps').value) || 4;
  const clouds = parseFloat(document.getElementById('numClouds').value) || 2;

  const vol = L * W * H;
  const surf = 2 * (L * W + L * H + W * H);
  const rawSabins = surf * alpha;
  const rawRt = +(0.049 * vol / Math.max(15, rawSabins)).toFixed(2);

  const treatSabins = rawSabins + (panels * 8 * 0.95) + (traps * 12 * 1.05) + (clouds * 8 * 0.95);
  const treatRt = +(0.049 * vol / treatSabins).toFixed(2);

  document.getElementById('kpiRtMain').textContent = `Untreated RT60: ${rawRt}s -> Treated RT60: ${treatRt}s`;
  document.getElementById('kpiRtSub').textContent = `${traps} Corner Bass Traps + ${panels} Wall Panels + ${clouds} Ceiling Clouds (${Math.round(treatSabins)} Sabins Total)`;

  const c = document.getElementById('rtCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#0c0a14';
  ctx.fillRect(0, 0, c.width, c.height);

  const freqs = ['63Hz', '125Hz', '250Hz', '500Hz', '1kHz', '4kHz'];
  freqs.forEach((f, i) => {
    const x = 75 + i * 95;
    const hRaw = Math.min(180, Math.round(rawRt * 190 * (i === 0 ? 1.25 : 1.0)));
    const hTrt = Math.min(180, Math.round(treatRt * 190 * (i === 0 ? 1.1 : 0.95)));
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(x, 240 - hRaw, 30, hRaw);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(x + 34, 240 - hTrt, 30, hTrt);
    ctx.fillStyle = '#f5f3ff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(f, x + 14, 265);
  });
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`OCTAVE-BAND RT60 DECAY: UNTREATED (PURPLE) vs. TREATED (GREEN)`, 85, 36);
}

function saveRoom() {
  const L = document.getElementById('rmLen').value;
  const W = document.getElementById('rmWid').value;
  const H = document.getElementById('rmHgt').value;
  savedRooms.push({
    name: `Studio Room (${L}' x ${W}' x ${H}')`,
    modes: `F1: ${curF1L} Hz / ${curF1W} Hz / ${curF1H} Hz`,
    traps: `2nd Harmonics: ${(curF1L*2).toFixed(1)} Hz / ${(curF1W*2).toFixed(1)} Hz`
  });
  switchTab(2);
}

function removeRoom(i) {
  savedRooms.splice(i, 1);
  renderRooms();
}

function renderRooms() {
  const box = document.getElementById('roomList');
  box.innerHTML = savedRooms.map((r, i) => `<div class="list-item">
    <div><strong>${r.name}</strong><span>${r.modes} • ${r.traps}</span></div>
    <button class="del-btn" onclick="removeRoom(${i})">Remove</button>
  </div>`).join('');
}

window.onload = () => { calcRoom(); calcRt(); renderRooms(); };
