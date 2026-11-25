window.GravelApp = (function () {
  let state = {
    tab: "tonnage",
    lengthM: 18,
    widthM: 3.6,
    depthCm: 15,
    compactionPct: 18,
    densityTPerM3: 1.62, // #57 Crushed Stone
    truckPayloadTonnes: 14,
    receivedTonnes: 10,
    pricePerTonne: 42
  };

  function setTab(t) {
    state.tab = t;
    document.querySelectorAll(".qtab").forEach(b => b.classList.toggle("active", b.dataset.t === t));
    render();
  }

  function calcGravel() {
    const geomM3 = state.lengthM * state.widthM * (state.depthCm / 100);
    const looseM3 = geomM3 * (1 + state.compactionPct / 100);
    const totalTonnes = looseM3 * state.densityTPerM3;
    const remainingTonnes = Math.max(0, totalTonnes - state.receivedTonnes);
    const tripsRemaining = Math.ceil(remainingTonnes / Math.max(1, state.truckPayloadTonnes));
    const totalCost = totalTonnes * state.pricePerTonne;
    return { geomM3, looseM3, totalTonnes, remainingTonnes, tripsRemaining, totalCost };
  }

  function render() {
    const host = document.getElementById("quarry-main");
    if (!host) return;
    const r = calcGravel();
    host.innerHTML = `
      <div class="hero">
        <div style="font-size:11.5px;font-weight:800;color:#CBD5E1;">COMPACTED AGGREGATE ORDER &amp; FLEET DISPATCH</div>
        <div class="val">${r.totalTonnes.toFixed(2)} Metric Tonnes</div>
        <div style="font-size:13px;font-weight:700;">
          Loose Volume: ${r.looseM3.toFixed(1)} m³ (+${state.compactionPct}% Compaction) • Remaining: ${r.remainingTonnes.toFixed(1)} t (${r.tripsRemaining} Truck Trips)
        </div>
      </div>
      <div class="card">
        <div style="font-weight:900;font-size:14px;margin-bottom:8px;">Sub-Base Compaction &amp; Delivery Progress</div>
        <canvas id="gravel-canvas" width="640" height="210" style="width:100%;border-radius:12px;background:#0F172A;"></canvas>
      </div>
      <div class="card">
        <div class="grid-2">
          <div class="fld"><label>Driveway Length (m)</label><input type="number" value="${state.lengthM}" oninput="GravelApp.upd('lengthM', this.value)"/></div>
          <div class="fld"><label>Width (m)</label><input type="number" step="0.2" value="${state.widthM}" oninput="GravelApp.upd('widthM', this.value)"/></div>
          <div class="fld"><label>Compacted Depth (cm)</label><input type="number" value="${state.depthCm}" oninput="GravelApp.upd('depthCm', this.value)"/></div>
          <div class="fld"><label>Density (t/m³ • #57=1.62)</label><input type="number" step="0.05" value="${state.densityTPerM3}" oninput="GravelApp.upd('densityTPerM3', this.value)"/></div>
          <div class="fld"><label>Truck Payload (Tonnes)</label><input type="number" value="${state.truckPayloadTonnes}" oninput="GravelApp.upd('truckPayloadTonnes', this.value)"/></div>
          <div class="fld"><label>Received So Far (Tonnes)</label><input type="number" value="${state.receivedTonnes}" oninput="GravelApp.upd('receivedTonnes', this.value)"/></div>
        </div>
      </div>
    `;
    drawGravelCanvas(r);
  }

  function drawGravelCanvas(r) {
    const c = document.getElementById("gravel-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    // Subgrade + Sub-base + Top Wearing Course
    ctx.fillStyle = "#475569"; ctx.fillRect(40, 35, 560, 45);
    ctx.fillStyle = "#64748B"; ctx.fillRect(40, 80, 560, 50);
    ctx.fillStyle = "#F59E0B"; ctx.fillRect(40, 130, 560, 45);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 14px sans-serif";
    ctx.fillText(`Top Crushed Stone Course: ${r.looseM3.toFixed(1)} m³ Loose (${r.totalTonnes.toFixed(1)} Tonnes)`, 60, 62);
    ctx.fillText(`Delivered: ${state.receivedTonnes} t  |  Remaining Dispatch: ${r.remainingTonnes.toFixed(1)} t (${r.tripsRemaining} Trips @ ${state.truckPayloadTonnes}t)`, 60, 110);
    ctx.fillStyle = "#0F172A";
    ctx.fillText(`Estimated Quarry & Haulage Cost: $${r.totalCost.toFixed(2)}`, 60, 158);
  }

  function upd(k, v) { state[k] = Number(v) || 0; render(); }
  window.addEventListener("DOMContentLoaded", render);
  return { setTab, upd };
})();