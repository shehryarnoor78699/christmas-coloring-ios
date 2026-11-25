window.SoilApp = (function () {
  let state = {
    tab: "bed",
    lengthFt: 8,
    widthFt: 4,
    depthIn: 12,
    existingFillCuFt: 6,
    existingCompostPct: 20,
    targetCompostPct: 35,
    loamPct: 45,
    perlitePct: 20,
    bagSizeCuFt: 1.5
  };

  function setTab(t) {
    state.tab = t;
    document.querySelectorAll(".stab").forEach(b => b.classList.toggle("active", b.dataset.t === t));
    render();
  }

  function calcSoil() {
    const totalCuFt = state.lengthFt * state.widthFt * (state.depthIn / 12);
    const totalCuYd = totalCuFt / 27;
    const totalLiters = totalCuFt * 28.3168;
    const topUpCuFt = Math.max(0, totalCuFt - state.existingFillCuFt);
    const bagsNeeded = Math.ceil(topUpCuFt / state.bagSizeCuFt);
    // Compost mass balance for Blend Workflow
    const existingCompostCuFt = state.existingFillCuFt * (state.existingCompostPct / 100);
    const targetTotalCompostCuFt = totalCuFt * (state.targetCompostPct / 100);
    const neededNewCompostCuFt = Math.max(0, targetTotalCompostCuFt - existingCompostCuFt);
    const neededBaseSoilCuFt = Math.max(0, topUpCuFt - neededNewCompostCuFt);
    return { totalCuFt, totalCuYd, totalLiters, topUpCuFt, bagsNeeded, neededNewCompostCuFt, neededBaseSoilCuFt };
  }

  function render() {
    const host = document.getElementById("soil-main");
    if (!host) return;
    const r = calcSoil();
    host.innerHTML = `
      <div class="hero">
        <div style="font-size:11.5px;font-weight:800;">RAISED BED VOLUME &amp; HORIZON BLEND</div>
        <div class="val">${r.totalCuFt.toFixed(1)} cu ft (${r.totalCuYd.toFixed(2)} yd³)</div>
        <div style="font-size:13px;font-weight:700;">
          Top-Up Needed: ${r.topUpCuFt.toFixed(1)} cu ft (${r.bagsNeeded} bags @ ${state.bagSizeCuFt} ft³) • New Compost: ${r.neededNewCompostCuFt.toFixed(1)} ft³
        </div>
      </div>
      <div class="card">
        <div style="font-weight:900;font-size:14px;margin-bottom:8px;">Soil Horizon Cross-Section Profile</div>
        <canvas id="soil-canvas" width="640" height="210" style="width:100%;border-radius:12px;background:#F0FDF4;border:1.5px solid #BBF7D0;"></canvas>
      </div>
      <div class="card">
        <div class="grid-2">
          <div class="fld"><label>Bed Length (ft)</label><input type="number" value="${state.lengthFt}" oninput="SoilApp.upd('lengthFt', this.value)"/></div>
          <div class="fld"><label>Bed Width (ft)</label><input type="number" value="${state.widthFt}" oninput="SoilApp.upd('widthFt', this.value)"/></div>
          <div class="fld"><label>Bed Depth (inches)</label><input type="number" value="${state.depthIn}" oninput="SoilApp.upd('depthIn', this.value)"/></div>
          <div class="fld"><label>Existing Fill (cu ft)</label><input type="number" value="${state.existingFillCuFt}" oninput="SoilApp.upd('existingFillCuFt', this.value)"/></div>
          <div class="fld"><label>Target Compost (%)</label><input type="number" value="${state.targetCompostPct}" oninput="SoilApp.upd('targetCompostPct', this.value)"/></div>
          <div class="fld"><label>Bag Size (cu ft)</label><input type="number" step="0.5" value="${state.bagSizeCuFt}" oninput="SoilApp.upd('bagSizeCuFt', this.value)"/></div>
        </div>
      </div>
    `;
    drawSoilCanvas(r);
  }

  function drawSoilCanvas(r) {
    const c = document.getElementById("soil-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    // 3 Horizon layers inside cedar bed walls
    ctx.fillStyle = "#78350F";
    ctx.fillRect(40, 30, 560, 150);
    ctx.fillStyle = "#92400E";
    ctx.fillRect(50, 40, 540, 45);
    ctx.fillStyle = "#B45309";
    ctx.fillRect(50, 85, 540, 45);
    ctx.fillStyle = "#4D7C0F";
    ctx.fillRect(50, 130, 540, 45);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`Top Organic Compost Layer: ${r.neededNewCompostCuFt.toFixed(1)} cu ft (${state.targetCompostPct}%)`, 65, 68);
    ctx.fillText(`New Screened Topsoil / Loam Blend: ${r.neededBaseSoilCuFt.toFixed(1)} cu ft`, 65, 113);
    ctx.fillText(`Existing Settled Base Fill: ${state.existingFillCuFt.toFixed(1)} cu ft`, 65, 158);
  }

  function upd(k, v) { state[k] = Number(v) || 0; render(); }
  window.addEventListener("DOMContentLoaded", render);
  return { setTab, upd };
})();