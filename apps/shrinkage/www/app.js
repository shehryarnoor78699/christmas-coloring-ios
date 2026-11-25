window.ShrinkApp = (function () {
  // Authentic USDA Forest Products Laboratory (FPL) Wood Handbook Coefficients (Shrinkage % from FSP 28% to 0%)
  const FPL_SPECIES = [
    { id: "white_oak", name: "White Oak (Quercus alba)", st: 8.8, sr: 4.4, fsp: 28 },
    { id: "red_oak", name: "Northern Red Oak", st: 8.6, sr: 4.0, fsp: 28 },
    { id: "black_walnut", name: "Black Walnut (Juglans nigra)", st: 7.8, sr: 5.5, fsp: 28 },
    { id: "hard_maple", name: "Sugar Maple (Acer saccharum)", st: 9.9, sr: 4.8, fsp: 28 },
    { id: "cherry", name: "Black Cherry (Prunus serotina)", st: 7.1, sr: 3.7, fsp: 28 },
    { id: "white_pine", name: "Eastern White Pine", st: 6.1, sr: 2.1, fsp: 28 }
  ];

  let state = {
    tab: "move",
    speciesId: "white_oak",
    grain: "tangential", // 'tangential' (flat-sawn) | 'radial' (quarter-sawn)
    widthMm: 450,
    mcInitial: 7.0, // Winter dry %
    mcFinal: 13.5,  // Summer humid %
    mortiseDepthMm: 14.0,
    tempC: 22,
    rhPct: 65
  };

  function setTab(t) {
    state.tab = t;
    document.querySelectorAll(".ltab").forEach(b => b.classList.toggle("active", b.dataset.t === t));
    render();
  }

  function computeMovement() {
    const sp = FPL_SPECIES.find(s => s.id === state.speciesId) || FPL_SPECIES[0];
    const coeff = state.grain === "radial" ? sp.sr : sp.st;
    const deltaMc = state.mcFinal - state.mcInitial;
    // USDA FPL dimensional change formula: dW = W * (deltaMC * (coeff / FSP)) / 100
    const deltaMm = state.widthMm * (deltaMc * (coeff / sp.fsp)) / 100;
    const finalWidthMm = state.widthMm + deltaMm;
    const perSideGapMm = Math.max(1.5, Math.abs(deltaMm) / 2 + 1.0);
    return { sp, coeff, deltaMc, deltaMm, finalWidthMm, perSideGapMm };
  }

  function computeEmc() {
    // Hailwood-Horrobin Equilibrium Moisture Content approximation
    const T = state.tempC;
    const h = Math.max(0.05, Math.min(0.95, state.rhPct / 100));
    const W = 349 + 1.29 * T + 0.0135 * T * T;
    const K = 0.805 + 0.000736 * T - 0.00000273 * T * T;
    const K1 = 6.27 - 0.00938 * T - 0.000303 * T * T;
    const K2 = 1.91 + 0.0407 * T - 0.000293 * T * T;
    const kh = K * h;
    const emc = (1800 / W) * ((kh / (1 - kh)) + ((K1 * kh + 2 * K1 * K2 * kh * kh) / (1 + K1 * kh + K1 * K2 * kh * kh)));
    return Math.round(emc * 10) / 10;
  }

  function render() {
    const host = document.getElementById("lab-main");
    if (!host) return;
    const m = computeMovement();

    if (state.tab === "move" || state.tab === "clearance") {
      host.innerHTML = `
        <div class="hero">
          <div style="font-size:11.5px;font-weight:800;opacity:0.9;">SEASONAL DIMENSIONAL MOVEMENT (${m.sp.name})</div>
          <div class="val">${m.deltaMm >= 0 ? "+" : ""}${m.deltaMm.toFixed(2)} mm</div>
          <div style="font-size:13px;font-weight:700;">
            Final Width: ${m.finalWidthMm.toFixed(2)} mm • Recommended Frame Expansion Gap: ${m.perSideGapMm.toFixed(1)} mm / side
          </div>
        </div>
        <div class="card">
          <div style="font-weight:900;font-size:14px;margin-bottom:8px;">Frame-and-Panel Joinery Clearance Diagram</div>
          <canvas id="joinery-canvas" width="640" height="220" style="width:100%;border-radius:12px;background:#F0FDFA;border:1.5px solid #99F6E4;"></canvas>
        </div>
        <div class="card">
          <div class="grid-2">
            <div class="fld" style="grid-column:span 2;">
              <label>Wood Species (USDA FPL Reference)</label>
              <select onchange="ShrinkApp.upd('speciesId', this.value)">
                ${FPL_SPECIES.map(s => `<option value="${s.id}" ${s.id===state.speciesId?'selected':''}>${s.name} (T:${s.st}% / R:${s.sr}%)</option>`).join("")}
              </select>
            </div>
            <div class="fld">
              <label>Grain Cut Plane</label>
              <select onchange="ShrinkApp.upd('grain', this.value)">
                <option value="tangential" ${state.grain==='tangential'?'selected':''}>Flat-Sawn (Tangential)</option>
                <option value="radial" ${state.grain==='radial'?'selected':''}>Quarter-Sawn (Radial)</option>
              </select>
            </div>
            <div class="fld">
              <label>Panel Width (mm)</label>
              <input type="number" value="${state.widthMm}" oninput="ShrinkApp.upd('widthMm', this.value)" />
            </div>
            <div class="fld">
              <label>Dry Winter MC (%)</label>
              <input type="number" step="0.5" value="${state.mcInitial}" oninput="ShrinkApp.upd('mcInitial', this.value)" />
            </div>
            <div class="fld">
              <label>Humid Summer MC (%)</label>
              <input type="number" step="0.5" value="${state.mcFinal}" oninput="ShrinkApp.upd('mcFinal', this.value)" />
            </div>
          </div>
        </div>
      `;
      drawJoineryCanvas(m);
    } else {
      const emc = computeEmc();
      host.innerHTML = `
        <div class="hero">
          <div style="font-size:11.5px;font-weight:800;">PSYCHROMETRIC EQUILIBRIUM MOISTURE CONTENT (EMC)</div>
          <div class="val">${emc}% EMC</div>
          <div style="font-size:13px;">At ${state.tempC}°C (${Math.round(state.tempC*1.8+32)}°F) and ${state.rhPct}% Relative Humidity</div>
        </div>
        <div class="card">
          <div class="grid-2">
            <div class="fld">
              <label>Shop Temperature (°C)</label>
              <input type="number" value="${state.tempC}" oninput="ShrinkApp.upd('tempC', this.value)" />
            </div>
            <div class="fld">
              <label>Relative Humidity (%)</label>
              <input type="number" value="${state.rhPct}" oninput="ShrinkApp.upd('rhPct', this.value)" />
            </div>
          </div>
        </div>
      `;
    }
  }

  function drawJoineryCanvas(m) {
    const c = document.getElementById("joinery-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    // Left & Right Stile mortise grooves
    ctx.fillStyle = "#7C2D12";
    ctx.fillRect(30, 30, 80, 160);
    ctx.fillRect(530, 30, 80, 160);
    // Center floating panel
    ctx.fillStyle = "#D97706";
    ctx.fillRect(125, 65, 390, 90);
    // Space balls / expansion gap markers
    ctx.fillStyle = "#0F766E";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`← Gap: ${m.perSideGapMm.toFixed(1)}mm`, 115, 50);
    ctx.fillText(`Panel: ${state.widthMm}mm (±${Math.abs(m.deltaMm).toFixed(2)}mm)`, 215, 115);
  }

  function upd(k, v) {
    if (k === "speciesId" || k === "grain") state[k] = v;
    else state[k] = Number(v) || 0;
    render();
  }

  window.addEventListener("DOMContentLoaded", render);
  return { setTab, upd };
})();