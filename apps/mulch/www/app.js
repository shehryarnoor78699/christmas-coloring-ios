window.MulchApp = (function () {
  let state = {
    tab: "cov",
    areaSqFt: 320,
    targetDepthIn: 3.0,
    observedDepthIn: 1.2,
    storedBags: 4,
    bagCapCuFt: 2.0,
    inspectIntervalDays: 90,
    bulkPriceYd: 46,
    bagPrice: 4.75
  };

  function setTab(t) {
    state.tab = t;
    document.querySelectorAll(".mtab").forEach(b => b.classList.toggle("active", b.dataset.t === t));
    render();
  }

  function calcMulch() {
    const fullCuFt = state.areaSqFt * (state.targetDepthIn / 12);
    const fullCuYd = fullCuFt / 27;
    const deficitDepthIn = Math.max(0, state.targetDepthIn - state.observedDepthIn);
    const topUpCuFt = state.areaSqFt * (deficitDepthIn / 12);
    const storedCuFt = state.storedBags * state.bagCapCuFt;
    const netBuyCuFt = Math.max(0, topUpCuFt - storedCuFt);
    const bagsToBuy = Math.ceil(netBuyCuFt / state.bagCapCuFt);
    const bulkCost = fullCuYd * state.bulkPriceYd;
    const bagCost = bagsToBuy * state.bagPrice;
    return { fullCuFt, fullCuYd, deficitDepthIn, topUpCuFt, bagsToBuy, bulkCost, bagCost };
  }

  function render() {
    const host = document.getElementById("mulch-main");
    if (!host) return;
    const r = calcMulch();
    host.innerHTML = `
      <div class="hero">
        <div style="font-size:11.5px;font-weight:800;color:#FECDD3;">MULCH TOP-UP &amp; SEASONAL CARE PLAN</div>
        <div class="val">${r.bagsToBuy} Bags to Buy (${r.topUpCuFt.toFixed(1)} ft³)</div>
        <div style="font-size:13px;font-weight:700;">
          Full Bed: ${r.fullCuYd.toFixed(2)} yd³ • Settled Deficit: ${r.deficitDepthIn.toFixed(1)}" • Stored Inventory Used: ${state.storedBags} bags
        </div>
      </div>
      <div class="card">
        <div style="font-weight:900;font-size:14px;margin-bottom:8px;">Mulch Settling &amp; Moisture Retention Layer</div>
        <canvas id="mulch-canvas" width="640" height="210" style="width:100%;border-radius:12px;background:#FFF1F2;border:1.5px solid #FECDD3;"></canvas>
      </div>
      <div class="card">
        <div class="grid-2">
          <div class="fld"><label>Bed Area (sq ft)</label><input type="number" value="${state.areaSqFt}" oninput="MulchApp.upd('areaSqFt', this.value)"/></div>
          <div class="fld"><label>Target Depth (in)</label><input type="number" step="0.5" value="${state.targetDepthIn}" oninput="MulchApp.upd('targetDepthIn', this.value)"/></div>
          <div class="fld"><label>Observed Settled Depth (in)</label><input type="number" step="0.2" value="${state.observedDepthIn}" oninput="MulchApp.upd('observedDepthIn', this.value)"/></div>
          <div class="fld"><label>Stored Bags On Hand</label><input type="number" value="${state.storedBags}" oninput="MulchApp.upd('storedBags', this.value)"/></div>
          <div class="fld"><label>Bag Capacity (cu ft)</label><input type="number" step="0.5" value="${state.bagCapCuFt}" oninput="MulchApp.upd('bagCapCuFt', this.value)"/></div>
          <div class="fld"><label>Inspection Cycle (Days)</label><input type="number" value="${state.inspectIntervalDays}" oninput="MulchApp.upd('inspectIntervalDays', this.value)"/></div>
        </div>
      </div>
    `;
    drawMulchCanvas(r);
  }

  function drawMulchCanvas(r) {
    const c = document.getElementById("mulch-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#881337"; ctx.fillRect(40, 35, 560, 55);
    ctx.fillStyle = "#065F46"; ctx.fillRect(40, 90, 560, 55);
    ctx.fillStyle = "#4C0519"; ctx.fillRect(40, 145, 560, 35);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 14px sans-serif";
    ctx.fillText(`Fresh Top-Up Cedar Bark Layer: +${r.deficitDepthIn.toFixed(1)} in (${r.bagsToBuy} new bags + ${state.storedBags} stored)`, 60, 68);
    ctx.fillText(`Existing Settled Organic Mulch Base: ${state.observedDepthIn.toFixed(1)} in`, 60, 122);
    ctx.fillText(`Geotextile Weed Barrier & Sub-Soil Horizon (${state.areaSqFt} sq ft)`, 60, 168);
  }

  function upd(k, v) { state[k] = Number(v) || 0; render(); }
  window.addEventListener("DOMContentLoaded", render);
  return { setTab, upd };
})();