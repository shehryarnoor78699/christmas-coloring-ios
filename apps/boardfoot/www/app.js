window.CutPlusApp = (function () {
  const SPECIES = [
    { id: "walnut", name: "American Black Walnut", densityLbBf: 3.18, defaultPriceBf: 11.50, janka: "1,010 lbf" },
    { id: "white_oak", name: "Quarter-Sawn White Oak", densityLbBf: 3.92, defaultPriceBf: 8.75, janka: "1,360 lbf" },
    { id: "hard_maple", name: "Hard Sugar Maple", densityLbBf: 3.68, defaultPriceBf: 6.90, janka: "1,450 lbf" },
    { id: "cherry", name: "Appalachian Black Cherry", densityLbBf: 2.92, defaultPriceBf: 7.40, janka: "950 lbf" },
    { id: "mahogany", name: "Honduran Mahogany", densityLbBf: 2.85, defaultPriceBf: 10.20, janka: "900 lbf" }
  ];

  let state = {
    tab: "bf",
    thicknessIn: 1.0, // 4/4
    widthIn: 8.5,
    lengthFt: 10.0,
    qty: 6,
    wastePct: 15,
    pricePerBf: 11.50,
    speciesId: "walnut",
    // Cut-list kerf optimizer (in mm)
    stockLenMm: 2440,
    kerfMm: 3.2,
    trimEndMm: 15,
    cutsInput: "610,4\n450,3\n305,4",
    batches: [
      { title: "Dining Table Top (8/4 Black Walnut)", bf: 64.4, cost: 740.60, weightLb: 204.8 },
      { title: "Shaker Cabinet Stiles (4/4 White Oak)", bf: 28.2, cost: 246.75, weightLb: 110.5 }
    ]
  };

  function setTab(t) {
    state.tab = t;
    document.querySelectorAll(".tab-pill").forEach(b => b.classList.toggle("active", b.dataset.tab === t));
    render();
  }

  function calcBf() {
    const sp = SPECIES.find(s => s.id === state.speciesId) || SPECIES[0];
    const netBf = (state.thicknessIn * state.widthIn * state.lengthFt / 12) * state.qty;
    const grossBf = netBf * (1 + state.wastePct / 100);
    const totalCost = grossBf * state.pricePerBf;
    const weightLb = grossBf * sp.densityLbBf;
    return { sp, netBf, grossBf, totalCost, weightLb };
  }

  function solve1DCutList() {
    const usableStock = Math.max(200, state.stockLenMm - 2 * state.trimEndMm);
    const pieces = [];
    state.cutsInput.split(/\n+/).forEach(line => {
      const parts = line.trim().split(",");
      if (parts.length >= 2) {
        const len = Number(parts[0]);
        const q = Math.min(30, Math.max(1, Number(parts[1]) || 1));
        if (len > 10 && len <= usableStock) {
          for (let i = 0; i < q; i++) pieces.push(len);
        }
      }
    });
    pieces.sort((a, b) => b - a);
    const boards = [];
    for (const p of pieces) {
      let placed = false;
      for (const b of boards) {
        const needed = (b.cuts.length > 0 ? state.kerfMm : 0) + p;
        if (b.used + needed <= usableStock) {
          b.cuts.push(p);
          b.used += needed;
          placed = true;
          break;
        }
      }
      if (!placed) {
        boards.push({ cuts: [p], used: p, usable: usableStock });
      }
    }
    const totalPieceLen = pieces.reduce((a, b) => a + b, 0);
    const totalStockLen = boards.length * state.stockLenMm;
    const yieldPct = totalStockLen > 0 ? (totalPieceLen / totalStockLen) * 100 : 0;
    return { boards, usableStock, totalPieces: pieces.length, yieldPct };
  }

  function render() {
    const host = document.getElementById("main-view");
    if (!host) return;
    if (state.tab === "bf") {
      const r = calcBf();
      host.innerHTML = `
        <div class="hero-box">
          <div style="font-size:11.5px;font-weight:800;color:#FDE68A;">GROSS HARDWOOD ORDER (WITH ${state.wastePct}% WASTE)</div>
          <div class="hero-val">${r.grossBf.toFixed(2)} BF</div>
          <div style="font-size:13.5px;font-weight:700;color:#FEF3C7;">
            Net: ${r.netBf.toFixed(2)} BF • Est. Cost: $${r.totalCost.toFixed(2)} • Weight: ${r.weightLb.toFixed(1)} lb
          </div>
        </div>
        <div class="card">
          <div class="grid-2">
            <div class="field" style="grid-column:span 2;">
              <label>Hardwood Species</label>
              <select onchange="CutPlusApp.upd('speciesId', this.value)">
                ${SPECIES.map(s => `<option value="${s.id}" ${s.id===state.speciesId?'selected':''}>${s.name} ($${s.defaultPriceBf}/BF)</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label>Thickness (in • 4/4=1.0, 8/4=2.0)</label>
              <input type="number" step="0.25" value="${state.thicknessIn}" oninput="CutPlusApp.upd('thicknessIn', this.value)" />
            </div>
            <div class="field">
              <label>Board Width (Inches)</label>
              <input type="number" step="0.5" value="${state.widthIn}" oninput="CutPlusApp.upd('widthIn', this.value)" />
            </div>
            <div class="field">
              <label>Board Length (Feet)</label>
              <input type="number" step="0.5" value="${state.lengthFt}" oninput="CutPlusApp.upd('lengthFt', this.value)" />
            </div>
            <div class="field">
              <label>Piece Quantity</label>
              <input type="number" step="1" value="${state.qty}" oninput="CutPlusApp.upd('qty', this.value)" />
            </div>
            <div class="field">
              <label>NHLA Waste Factor (%)</label>
              <input type="number" step="1" value="${state.wastePct}" oninput="CutPlusApp.upd('wastePct', this.value)" />
            </div>
            <div class="field">
              <label>Price per Board Foot ($)</label>
              <input type="number" step="0.25" value="${state.pricePerBf}" oninput="CutPlusApp.upd('pricePerBf', this.value)" />
            </div>
          </div>
          <button class="btn-amber" onclick="CutPlusApp.saveBatch()">💾 Save Millwork Batch to Project</button>
        </div>
        <div class="card">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;color:#FDE68A;">3D Isometric Board-Foot Blueprint</div>
          <canvas id="bf-cad-canvas" width="640" height="220" style="width:100%;border-radius:12px;background:#0F172A;border:1px solid #334155;"></canvas>
        </div>
      `;
      drawBoardCad(r);
    } else if (state.tab === "cutlist") {
      const sol = solve1DCutList();
      host.innerHTML = `
        <div class="hero-box">
          <div style="font-size:11.5px;font-weight:800;color:#FDE68A;">1D LINEAR KERF &amp; STOCK OPTIMIZATION</div>
          <div class="hero-val">${sol.boards.length} Stock Boards</div>
          <div style="font-size:13px;font-weight:700;color:#FEF3C7;">
            ${sol.totalPieces} Finished Cuts • Material Yield: ${sol.yieldPct.toFixed(1)}% • Kerf: ${state.kerfMm} mm
          </div>
        </div>
        <div class="card">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;color:#FDE68A;">Live Saw-Kerf Nesting Diagram</div>
          <canvas id="kerf-canvas" width="660" height="260" style="width:100%;border-radius:12px;background:#0F172A;border:1px solid #334155;"></canvas>
        </div>
        <div class="card">
          <div class="grid-2">
            <div class="field">
              <label>Stock Length (mm)</label>
              <input type="number" value="${state.stockLenMm}" oninput="CutPlusApp.upd('stockLenMm', this.value)" />
            </div>
            <div class="field">
              <label>Saw Blade Kerf (mm)</label>
              <input type="number" step="0.2" value="${state.kerfMm}" oninput="CutPlusApp.upd('kerfMm', this.value)" />
            </div>
            <div class="field" style="grid-column:span 2;">
              <label>Finished Cuts (Length_mm,Quantity per line)</label>
              <textarea rows="3" oninput="CutPlusApp.upd('cutsInput', this.value)">${state.cutsInput}</textarea>
            </div>
          </div>
        </div>
      `;
      drawKerfDiagram(sol);
    } else if (state.tab === "species") {
      host.innerHTML = `<div class="card"><h3 style="margin:0 0 10px;color:#FDE68A;">NHLA Hardwood Density &amp; Janka Hardness Reference</h3>` +
        SPECIES.map(s => `
          <div style="padding:10px;border-bottom:1px solid #334155;display:flex;justify-content:space-between;">
            <div>
              <div style="font-weight:800;">${s.name}</div>
              <div style="font-size:12px;color:#94A3B8;">Density: ${s.densityLbBf} lb/BF • Janka Hardness: ${s.janka}</div>
            </div>
            <span style="color:#F59E0B;font-weight:900;">~$${s.defaultPriceBf.toFixed(2)}/BF</span>
          </div>
        `).join("") + `</div>`;
    } else {
      host.innerHTML = `<div class="card"><h3 style="margin:0 0 10px;color:#FDE68A;">Saved Millwork Project Batches</h3>` +
        state.batches.map(b => `
          <div style="padding:10px;border-bottom:1px solid #334155;">
            <div style="font-weight:800;">${b.title}</div>
            <div style="font-size:12.5px;color:#FDE68A;">${b.bf.toFixed(2)} BF • $${b.cost.toFixed(2)} • ${b.weightLb.toFixed(1)} lb</div>
          </div>
        `).join("") + `</div>`;
    }
  }

  function drawBoardCad(r) {
    const c = document.getElementById("bf-cad-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#F59E0B";
    ctx.fillStyle = "rgba(217, 119, 6, 0.22)";
    ctx.lineWidth = 2.5;
    // Draw 3D isometric plank
    ctx.beginPath();
    ctx.rect(60, 85, 420, 65);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(60, 85); ctx.lineTo(130, 40); ctx.lineTo(550, 40); ctx.lineTo(480, 85); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(480, 85); ctx.lineTo(550, 40); ctx.lineTo(550, 105); ctx.lineTo(480, 150); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FDE68A";
    ctx.font = "bold 15px -apple-system, sans-serif";
    ctx.fillText(`L: ${state.lengthFt} ft  ×  W: ${state.widthIn} in  ×  T: ${state.thicknessIn} in (${state.qty} pcs)`, 75, 185);
  }

  function drawKerfDiagram(sol) {
    const c = document.getElementById("kerf-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    const maxB = sol.boards.slice(0, 4);
    maxB.forEach((b, idx) => {
      const y = 20 + idx * 58;
      const barW = 580;
      ctx.fillStyle = "#1E293B";
      ctx.strokeStyle = "#475569";
      ctx.fillRect(40, y, barW, 36);
      ctx.strokeRect(40, y, barW, 36);
      let curX = 40;
      b.cuts.forEach((cutLen) => {
        const w = Math.max(18, (cutLen / b.usable) * barW);
        ctx.fillStyle = "#D97706";
        ctx.fillRect(curX, y + 2, w - 3, 32);
        ctx.fillStyle = "#0F172A";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(`${cutLen}`, curX + 5, y + 22);
        curX += w;
      });
    });
  }

  function upd(k, v) {
    if (k === "speciesId") {
      state.speciesId = v;
      const sp = SPECIES.find(s => s.id === v);
      if (sp) state.pricePerBf = sp.defaultPriceBf;
    } else if (k === "cutsInput") {
      state.cutsInput = v;
    } else {
      state[k] = Number(v) || 0;
    }
    render();
  }

  function saveBatch() {
    const r = calcBf();
    state.batches.unshift({
      title: `${r.sp.name} (${state.qty} pcs @ ${state.lengthFt}'×${state.widthIn}")`,
      bf: r.grossBf,
      cost: r.totalCost,
      weightLb: r.weightLb
    });
    setTab("saved");
  }

  window.addEventListener("DOMContentLoaded", render);
  return { setTab, upd, saveBatch };
})();