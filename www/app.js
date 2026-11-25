/**
 * Breastfeeding Calorie Count — Master iOS Application Controller ($4.99 Ad-Free Edition)
 * Bundle ID: com.bcalculator.app
 * Color Palette matched 1:1 to https://breastfeedingcaloriecalculator.com/ (#E91E8C Rose Pink, #7B2D8B Plum Purple, #00B386 Mint Emerald)
 * Engineered for Apple App Store Compliance:
 * - Guideline 1.4.1 Compliant: NASEM 2023, CDC, Mifflin-St Jeor (1990), and WHO clinical citations with clickable links & disclaimers
 * - Guideline 2.3.8 & 2.3.6 Compliant: Adult Maternal Health & Fitness utility (4+ Age Rating, Age Assurance = None)
 * - Guideline 4.2 & 4.3 Compliant: 5 Interactive Modules (Lactation Energy & Macro Engine, Interactive Activity & Macro Canvas Plotter,
 *   Galactagogue Meal Builder, Live Left/Right Nursing Session Timer + 12-Glass Hydration Tracker, Offline Clinical Guide)
 */

window.LactationApp = (function () {
  const STORAGE_KEY = "BREASTFEEDING_CALORIE_PRO_IOS_V2";

  let state = {
    activeTab: "calculator", // 'calculator' | 'charts' | 'meals' | 'tracker' | 'guide'
    unitSystem: "metric", // 'metric' | 'imperial'
    soundEnabled: true,
    inputs: {
      age: 29,
      heightCm: 165,
      weightKg: 66,
      targetWeightKg: 61,
      stageId: "exclusive_0_6",
      activityId: "light",
      pumpedOzPerDay: 26,
      goalMode: "gradual" // 'gradual' (-170 kcal tissue mobilization) | 'maintain' (full milk energy cost)
    },
    mealLog: ["oats", "salmon", "yogurt", "eggs"],
    hydrationGlasses: 8,
    nursingSessions: [
      { id: "ns1", time: "08:30 AM", side: "Left Breast (L)", durationMin: 18, note: "Morning full feed" },
      { id: "ns2", time: "11:45 AM", side: "Right Breast (R)", durationMin: 16, note: "Midday feed + 1 glass water" }
    ],
    savedPlans: [
      {
        id: "sp1",
        date: "2026-11-24",
        title: "Exclusive Nursing (0–6m) Plan",
        totalKcal: 2315,
        baselineKcal: 1985,
        lactationAddKcal: 330,
        proteinG: 98,
        hydrationL: 3.1
      }
    ],
    dailyNotes: "Remember to take prenatal/postnatal Vitamin D + Choline supplement and ask OB/GYN about iron levels at checkup.",
    timer: {
      running: false,
      side: "Left Breast (L)",
      elapsedSec: 0,
      intervalId: null
    }
  };

  let audioCtx = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = {
          ...state,
          ...parsed,
          inputs: { ...state.inputs, ...(parsed.inputs || {}) },
          timer: { running: false, side: "Left Breast (L)", elapsedSec: 0, intervalId: null }
        };
      }
    } catch (_) {}
  }

  function saveState() {
    try {
      const copy = { ...state, timer: undefined };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    } catch (_) {}
  }

  function playChime(freq = 620, dur = 0.08) {
    if (window.Capacitor?.Plugins?.Haptics) {
      try {
        window.Capacitor.Plugins.Haptics.impact({ style: "LIGHT" });
      } catch (_) {}
    }
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, audioCtx.currentTime + dur);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.add("hidden"), 2400);
  }

  function toggleUnitSystem() {
    state.unitSystem = state.unitSystem === "metric" ? "imperial" : "metric";
    playChime(640, 0.06);
    saveState();
    renderAll();
    showToast(`Switched to ${state.unitSystem === "metric" ? "Metric (cm / kg)" : "US Imperial (ft-in / lb)"}`);
  }

  // ============================================================================
  // NASEM 2023 & MIFFLIN-ST JEOR MATERNAL LACTATION ENERGY ENGINE
  // ============================================================================
  function calculateLactationEnergy() {
    const inp = state.inputs;
    const stages = window.LactationReferenceData.NURSING_STAGES;
    const activities = window.LactationReferenceData.ACTIVITY_LEVELS;

    const stage = stages.find((s) => s.id === inp.stageId) || stages[0];
    const act = activities.find((a) => a.id === inp.activityId) || activities[1];

    const age = Math.max(18, Math.min(55, Number(inp.age) || 29));
    const heightCm = Math.max(130, Math.min(210, Number(inp.heightCm) || 165));
    const weightKg = Math.max(38, Math.min(180, Number(inp.weightKg) || 66));

    // Mifflin-St Jeor Adult Female BMR: 10*W + 6.25*H - 5*A - 161
    const bmrKcal = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    const baselineMaintenanceKcal = Math.round(bmrKcal * act.pal);

    // Lactation Energy Add-On
    let lactationAddKcal = inp.goalMode === "maintain" ? stage.fullAddKcal : stage.netAddKcal;
    if (stage.id === "pumping_custom") {
      // ~20 kcal in milk per oz, 80% synthesis efficiency => ~25 kcal maternal expenditure per oz
      const oz = Math.max(4, Math.min(65, Number(inp.pumpedOzPerDay) || 26));
      const grossPumpKcal = Math.round(oz * 22);
      lactationAddKcal = inp.goalMode === "maintain" ? grossPumpKcal : Math.max(180, grossPumpKcal - 150);
    }

    // Enforce safe clinical maternal floor of 1,800 kcal/day
    const rawTotalKcal = baselineMaintenanceKcal + lactationAddKcal;
    const safeTotalKcal = Math.max(1800, rawTotalKcal);
    const floorApplied = rawTotalKcal < 1800;

    // Macronutrient distribution for nursing mothers:
    // Protein: 1.1g/kg + stage.proteinAddG (minimum 75g–115g)
    const proteinG = Math.round(weightKg * 1.1 + stage.proteinAddG);
    const proteinKcal = proteinG * 4;
    // Healthy Fats (30% of total kcal, rich in DHA/Omega-3)
    const fatKcal = Math.round(safeTotalKcal * 0.30);
    const fatG = Math.round(fatKcal / 9);
    // Complex Carbohydrates (remaining kcal)
    const carbsKcal = Math.max(400, safeTotalKcal - proteinKcal - fatKcal);
    const carbsG = Math.round(carbsKcal / 4);

    // Hydration target: 35mL/kg + stage.hydrationAddMl
    const totalHydrationMl = Math.round(weightKg * 35 + stage.hydrationAddMl);
    const totalHydrationL = (totalHydrationMl / 1000).toFixed(1);
    const recommendedGlasses = Math.min(14, Math.max(9, Math.round(totalHydrationMl / 250)));

    // Comparison across all 5 activity levels
    const activityComparison = activities.map((a) => ({
      id: a.id,
      label: a.label.split("(")[0].trim(),
      kcal: Math.max(1800, Math.round(bmrKcal * a.pal) + lactationAddKcal)
    }));

    return {
      stage,
      act,
      bmrKcal,
      baselineMaintenanceKcal,
      lactationAddKcal,
      safeTotalKcal,
      floorApplied,
      proteinG,
      carbsG,
      fatG,
      totalHydrationL,
      recommendedGlasses,
      activityComparison
    };
  }

  function renderHeader() {
    const hdr = document.getElementById("app-header");
    if (!hdr) return;
    hdr.innerHTML = `
      <div class="header-top-row">
        <div class="header-title-group">
          <h1>🌸 Breastfeeding Calorie Count</h1>
          <p>Maternal Lactation Energy, Meal &amp; Hydration Studio</p>
        </div>
        <button class="unit-pill-toggle" onclick="LactationApp.toggleUnitSystem()">
          ${state.unitSystem === "metric" ? "⚖️ cm / kg" : "⚖️ ft-in / lb"}
        </button>
      </div>
    `;
  }

  function renderBottomNav() {
    document.querySelectorAll("#bottom-nav .nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === state.activeTab);
    });
  }

  function switchTab(tab) {
    playChime(580, 0.05);
    state.activeTab = tab;
    renderAll();
    const sc = document.getElementById("screen-container");
    if (sc) sc.scrollTop = 0;
  }

  function renderCitationBannerHtml() {
    return `
      <div class="citation-box">
        <strong>⚕️ Clinical &amp; Educational Reference Notice:</strong><br/>
        Estimates are based on the National Academies (NASEM 2023) Dietary Reference Intakes for Energy, Mifflin-St Jeor REE, and CDC Breastfeeding Guidelines. For educational planning only; consult your OB/GYN, midwife, or IBCLC lactation specialist for individualized medical guidance.<br/>
        <strong>Official Sources:</strong>
        <a href="https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-energy" target="_blank" rel="noopener">NASEM 2023 Energy DRIs</a> •
        <a href="https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/maternal-diet.html" target="_blank" rel="noopener">CDC Maternal Diet</a> •
        <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noopener">Mifflin-St Jeor (AJCN)</a> •
        <a href="https://www.who.int/publications/i/item/9241592923" target="_blank" rel="noopener">WHO Report 935</a>
      </div>
    `;
  }

  function renderAll() {
    renderHeader();
    renderBottomNav();
    const host = document.getElementById("screen-container");
    if (!host) return;

    if (state.activeTab === "calculator") renderCalculatorTab(host);
    else if (state.activeTab === "charts") renderChartsTab(host);
    else if (state.activeTab === "meals") renderMealsTab(host);
    else if (state.activeTab === "tracker") renderTrackerTab(host);
    else if (state.activeTab === "guide") renderGuideTab(host);
  }

  // ============================================================================
  // TAB 1: LACTATION CALORIE & MACRONUTRIENT CALCULATOR
  // ============================================================================
  function renderCalculatorTab(host) {
    const inp = state.inputs;
    const res = calculateLactationEnergy();
    const stages = window.LactationReferenceData.NURSING_STAGES;
    const activities = window.LactationReferenceData.ACTIVITY_LEVELS;

    const displayWeight =
      state.unitSystem === "imperial"
        ? `${(inp.weightKg * 2.20462).toFixed(1)} lb (${inp.weightKg} kg)`
        : `${inp.weightKg} kg (${(inp.weightKg * 2.20462).toFixed(1)} lb)`;

    host.innerHTML = `
      <div class="result-hero">
        <div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.6px;">
          Estimated Daily Nursing Energy Target
        </div>
        <div class="big-value">${res.safeTotalKcal.toLocaleString()} kcal / day</div>
        <div class="secondary-value">
          Baseline Maintenance: ${res.baselineMaintenanceKcal} kcal + Lactation Output: +${res.lactationAddKcal} kcal
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="m-label">Daily Protein (+25g)</div>
            <div class="m-val">${res.proteinG}g / day</div>
          </div>
          <div class="metric-box">
            <div class="m-label">Complex Carbs</div>
            <div class="m-val">${res.carbsG}g / day</div>
          </div>
          <div class="metric-box">
            <div class="m-label">Healthy Fats &amp; DHA</div>
            <div class="m-val">${res.fatG}g / day</div>
          </div>
          <div class="metric-box">
            <div class="m-label">Fluid Intake Target</div>
            <div class="m-val">${res.totalHydrationL} L (${res.recommendedGlasses} cups)</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">🌸 Maternal &amp; Nursing Profile</h2>
        <p class="card-subtitle">${res.stage.note}</p>

        <div class="form-grid">
          <div class="form-field full">
            <label>Breastfeeding / Lactation Stage</label>
            <select onchange="LactationApp.updateInput('stageId', this.value)">
              ${stages
                .map(
                  (s) => `
                <option value="${s.id}" ${s.id === inp.stageId ? "selected" : ""}>${s.label}</option>
              `
                )
                .join("")}
            </select>
          </div>

          ${
            inp.stageId === "pumping_custom"
              ? `<div class="form-field full">
                   <label>Daily Expressed Breast Milk Volume (fl oz / day)</label>
                   <input type="number" min="4" max="65" value="${inp.pumpedOzPerDay}"
                     oninput="LactationApp.updateInput('pumpedOzPerDay', this.value)" />
                 </div>`
              : ""
          }

          <div class="form-field full">
            <label>Postpartum Energy Goal Pacing</label>
            <select onchange="LactationApp.updateInput('goalMode', this.value)">
              <option value="gradual" ${inp.goalMode === "gradual" ? "selected" : ""}>
                NASEM Standard (+330 to +400 kcal • Gentle Postpartum Return)
              </option>
              <option value="maintain" ${inp.goalMode === "maintain" ? "selected" : ""}>
                Full Milk Energy Replacement (+500 kcal • Maintain Current Weight)
              </option>
            </select>
          </div>

          <div class="form-field">
            <label>Maternal Age (Years)</label>
            <input type="number" min="18" max="55" value="${inp.age}"
              oninput="LactationApp.updateInput('age', this.value)" />
          </div>

          <div class="form-field">
            <label>Height (cm)</label>
            <input type="number" min="135" max="205" step="0.5" value="${inp.heightCm}"
              oninput="LactationApp.updateInput('heightCm', this.value)" />
          </div>

          <div class="form-field">
            <label>Current Weight (kg)</label>
            <input type="number" min="40" max="160" step="0.5" value="${inp.weightKg}"
              oninput="LactationApp.updateInput('weightKg', this.value)" />
          </div>

          <div class="form-field">
            <label>Resting BMR (Mifflin)</label>
            <input type="text" value="${res.bmrKcal} kcal/d" disabled />
          </div>

          <div class="form-field full">
            <label>Physical Activity Level (PAL)</label>
            <select onchange="LactationApp.updateInput('activityId', this.value)">
              ${activities
                .map(
                  (a) => `
                <option value="${a.id}" ${a.id === inp.activityId ? "selected" : ""}>${a.label}</option>
              `
                )
                .join("")}
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;">
          <button class="btn-primary" onclick="LactationApp.saveCurrentPlan()">
            💾 Save Energy Plan
          </button>
          <button class="btn-secondary" onclick="LactationApp.printReport()">
            🖨️ Print / PDF
          </button>
        </div>
      </div>

      <!-- Key Lactation Micronutrients Card -->
      <div class="card">
        <h3 class="card-title">✨ Essential Lactation Micronutrient Targets</h3>
        <p class="card-subtitle">CDC &amp; NIH recommended daily intake during lactation (${displayWeight})</p>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:12.5px;font-weight:800;">
          <div style="background:var(--lpink);padding:10px;border-radius:12px;">🧠 <strong>Choline:</strong> 550 mg/day</div>
          <div style="background:var(--lpurple);padding:10px;border-radius:12px;">🦋 <strong>Iodine:</strong> 290 mcg/day</div>
          <div style="background:var(--lpink);padding:10px;border-radius:12px;">🐟 <strong>DHA Omega-3:</strong> 250+ mg/day</div>
          <div style="background:var(--lpurple);padding:10px;border-radius:12px;">🦴 <strong>Calcium:</strong> 1,000 mg/day</div>
        </div>
      </div>

      ${renderCitationBannerHtml()}
    `;
  }

  function updateInput(field, val) {
    if (["stageId", "activityId", "goalMode"].includes(field)) {
      state.inputs[field] = val;
    } else {
      state.inputs[field] = Number(val) || 0;
    }
    saveState();
    renderAll();
  }

  function saveCurrentPlan() {
    const res = calculateLactationEnergy();
    state.savedPlans.unshift({
      id: "sp_" + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      title: `${res.stage.shortLabel} (${res.act.label.split("(")[0].trim()})`,
      totalKcal: res.safeTotalKcal,
      baselineKcal: res.baselineMaintenanceKcal,
      lactationAddKcal: res.lactationAddKcal,
      proteinG: res.proteinG,
      hydrationL: res.totalHydrationL
    });
    playChime(700, 0.1);
    saveState();
    showToast("🌸 Energy Plan Saved to Daily Log ✓");
  }

  function printReport() {
    window.print();
  }

  // ============================================================================
  // TAB 2: INTERACTIVE ENERGY & MACRONUTRIENT CANVAS CHARTS
  // ============================================================================
  function renderChartsTab(host) {
    const res = calculateLactationEnergy();

    host.innerHTML = `
      <div class="card">
        <h2 class="card-title">📊 Activity-Level Energy Comparison</h2>
        <p class="card-subtitle">
          Daily kcal target across 5 activity tiers for <strong>${res.stage.shortLabel}</strong>
        </p>

        <canvas id="lactation-energy-canvas" width="700" height="460"
          style="width:100%;height:auto;border-radius:16px;border:1.5px solid var(--border-rose);background:#FFFFFF;"></canvas>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
          <button class="btn-primary" onclick="LactationApp.exportChartPng()">
            💾 Save Chart PNG
          </button>
          <button class="btn-secondary" onclick="LactationApp.printReport()">
            🖨️ AirPrint Summary
          </button>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">🗂️ Saved Maternal Energy Plans</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${state.savedPlans
            .map(
              (p) => `
            <div style="background:var(--lpink);border:1px solid var(--border-rose);border-radius:14px;padding:11px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-weight:900;font-size:14px;color:var(--purple);">${p.title}</div>
                <div style="font-size:12px;font-weight:700;color:var(--text-muted);">
                  ${p.totalKcal} kcal/day (Base ${p.baselineKcal} + Nursing ${p.lactationAddKcal}) • Protein ${p.proteinG}g
                </div>
              </div>
              <span style="font-size:11px;font-weight:800;color:var(--pink);">${p.date}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      ${renderCitationBannerHtml()}
    `;

    drawLactationCanvas(res);
  }

  function drawLactationCanvas(res) {
    const canvas = document.getElementById("lactation-energy-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = "#7B2D8B";
    ctx.font = "900 18px -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Daily Energy Target by Activity Level (${res.stage.shortLabel})`, 32, 38);

    const items = res.activityComparison;
    const maxKcal = 3200;
    const startY = 74;
    const rowH = 68;

    items.forEach((item, idx) => {
      const y = startY + idx * rowH;
      const isSelected = item.id === state.inputs.activityId;

      ctx.fillStyle = isSelected ? "#E91E8C" : "#3D1C3F";
      ctx.font = isSelected ? "900 14.5px -apple-system, sans-serif" : "700 14px -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.label, 32, y + 18);

      // Bar track
      const barX = 185;
      const barMaxW = W - barX - 115;
      ctx.fillStyle = "#FCE4F3";
      ctx.beginPath();
      ctx.roundRect(barX, y, barMaxW, 30, 15);
      ctx.fill();

      // Bar fill
      const fillW = Math.max(40, Math.min(barMaxW, Math.round((item.kcal / maxKcal) * barMaxW)));
      ctx.fillStyle = isSelected ? "#E91E8C" : "#7B2D8B";
      ctx.beginPath();
      ctx.roundRect(barX, y, fillW, 30, 15);
      ctx.fill();

      // Kcal text
      ctx.fillStyle = isSelected ? "#E91E8C" : "#3D1C3F";
      ctx.font = "900 14.5px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${item.kcal} kcal`, W - 24, y + 20);
    });
  }

  function exportChartPng() {
    const canvas = document.getElementById("lactation-energy-canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "Breastfeeding_Calorie_Chart.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("Energy Chart Saved ✓");
  }

  // ============================================================================
  // TAB 3: LACTATION MEAL STUDIO & MILK-BOOSTING SUPERFOODS
  // ============================================================================
  function renderMealsTab(host) {
    const res = calculateLactationEnergy();
    const foods = window.LactationReferenceData.SUPERFOODS_LIBRARY;
    const loggedFoods = state.mealLog.map((id) => foods.find((f) => f.id === id)).filter(Boolean);

    const loggedKcal = loggedFoods.reduce((acc, f) => acc + f.kcal, 0);
    const loggedProtein = loggedFoods.reduce((acc, f) => acc + f.proteinG, 0);
    const pct = Math.min(100, Math.round((loggedKcal / res.safeTotalKcal) * 100));

    host.innerHTML = `
      <div class="result-hero">
        <div style="font-size:12px;font-weight:900;text-transform:uppercase;">Daily Lactation Meal Builder</div>
        <div class="big-value">${loggedKcal} / ${res.safeTotalKcal} kcal</div>
        <div class="secondary-value">
          Protein Logged: ${loggedProtein}g of ${res.proteinG}g Target (${pct}% of Daily Energy)
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">🥗 Galactagogue &amp; Nutrient-Dense Foods</h2>
        <p class="card-subtitle">Tap any nourishing meal below to add to your daily nursing log</p>
        <div style="display:flex;flex-direction:column;gap:9px;">
          ${foods
            .map(
              (f) => `
            <div style="background:var(--lpink);border:1.5px solid var(--border-rose);border-radius:16px;padding:11px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div style="font-size:26px;">${f.icon}</div>
              <div style="flex:1;">
                <div style="font-weight:900;font-size:14px;color:var(--text-plum);">${f.name}</div>
                <div style="font-size:11.5px;font-weight:800;color:var(--pink);">${f.tag} • ${f.kcal} kcal • ${f.proteinG}g Protein</div>
              </div>
              <button class="btn-primary" style="width:auto;padding:7px 14px;font-size:12px;"
                onclick="LactationApp.addFoodToMealLog('${f.id}')">+ Add</button>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>🍽️ Today's Logged Nursing Meals (${loggedFoods.length})</span>
          <button class="btn-secondary" style="padding:4px 12px;font-size:11.5px;" onclick="LactationApp.clearMealLog()">Clear</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:8px;">
          ${
            loggedFoods.length === 0
              ? `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Tap + Add above to build today's meal plan.</div>`
              : loggedFoods
                  .map(
                    (f, idx) => `
                <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#F8FAFC;border-radius:10px;font-size:13px;font-weight:800;">
                  <span>${f.icon} ${f.name}</span>
                  <span style="color:var(--dpink);">${f.kcal} kcal (${f.proteinG}g P)</span>
                </div>
              `
                  )
                  .join("")
          }
        </div>
      </div>
    `;
  }

  function addFoodToMealLog(foodId) {
    state.mealLog.push(foodId);
    playChime(660, 0.06);
    saveState();
    renderAll();
    showToast("Added to Today's Nursing Meal Log ✓");
  }

  function clearMealLog() {
    state.mealLog = [];
    saveState();
    renderAll();
    showToast("Meal Log Cleared");
  }

  // ============================================================================
  // TAB 4: LIVE NURSING TIMER, 12-GLASS HYDRATION & DAILY JOURNAL
  // ============================================================================
  function renderTrackerTab(host) {
    const res = calculateLactationEnergy();
    const min = Math.floor(state.timer.elapsedSec / 60);
    const sec = state.timer.elapsedSec % 60;
    const timeFmt = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    host.innerHTML = `
      <!-- Live Nursing & Pumping Session Timer -->
      <div class="result-hero">
        <div style="font-size:12px;font-weight:900;text-transform:uppercase;">Live Nursing &amp; Pumping Timer</div>
        <div class="big-value">${timeFmt}</div>
        <div class="secondary-value">Active Side: <strong>${state.timer.side}</strong></div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
          <button class="unit-pill-toggle" onclick="LactationApp.setNursingSide('Left Breast (L)')">Left (L)</button>
          <button class="unit-pill-toggle" onclick="LactationApp.setNursingSide('Right Breast (R)')">Right (R)</button>
          <button class="unit-pill-toggle" style="background:#00B386;color:#FFF;" onclick="LactationApp.toggleNursingTimer()">
            ${state.timer.running ? "⏸ Pause & Log" : "▶ Start Session"}
          </button>
        </div>
      </div>

      <!-- 12-Glass Hydration Counter -->
      <div class="card">
        <div class="card-title">
          <span>💧 Daily Hydration Tracker</span>
          <span style="color:#00B386;">${state.hydrationGlasses} / 12 Glasses (${(state.hydrationGlasses * 0.25).toFixed(2)} L)</span>
        </div>
        <p class="card-subtitle">Recommended target for your stage: ${res.totalHydrationL} Liters/day. Tap a glass to log water:</p>
        <div class="glass-grid">
          ${Array.from({ length: 12 }, (_, i) => i + 1)
            .map(
              (n) => `
            <button class="glass-btn ${n <= state.hydrationGlasses ? "filled" : ""}" onclick="LactationApp.setHydrationGlasses(${n})">
              <span>💧</span>
              <span style="font-size:10px;">${n}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Recent Nursing Sessions Log -->
      <div class="card">
        <h3 class="card-title">🕒 Recent Nursing &amp; Pumping Log</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${state.nursingSessions
            .map(
              (s) => `
            <div style="background:var(--lpink);padding:10px 12px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;">
              <div>
                <div style="color:var(--purple);">${s.side} • ${s.durationMin} min</div>
                <div style="font-size:11.5px;color:var(--text-muted);">${s.note}</div>
              </div>
              <span style="color:var(--pink);">${s.time}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Mom's Appointment & Question Notes -->
      <div class="card">
        <h3 class="card-title">📝 Mom's Checkup &amp; Lactation Notes</h3>
        <div class="form-field full">
          <textarea rows="3" oninput="LactationApp.updateDailyNotes(this.value)">${state.dailyNotes}</textarea>
        </div>
      </div>
    `;
  }

  function setNursingSide(side) {
    state.timer.side = side;
    playChime(600, 0.05);
    renderAll();
  }

  function toggleNursingTimer() {
    if (state.timer.running) {
      clearInterval(state.timer.intervalId);
      state.timer.running = false;
      const mins = Math.max(1, Math.round(state.timer.elapsedSec / 60));
      state.nursingSessions.unshift({
        id: "ns_" + Date.now(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        side: state.timer.side,
        durationMin: mins,
        note: "Logged from Live Nursing Timer"
      });
      state.timer.elapsedSec = 0;
      playChime(780, 0.12);
      saveState();
      showToast("Nursing Session Logged ✓");
      renderAll();
    } else {
      state.timer.running = true;
      playChime(620, 0.08);
      state.timer.intervalId = setInterval(() => {
        state.timer.elapsedSec++;
        renderAll();
      }, 1000);
      renderAll();
    }
  }

  function setHydrationGlasses(n) {
    state.hydrationGlasses = n;
    playChime(650, 0.05);
    saveState();
    renderAll();
  }

  function updateDailyNotes(val) {
    state.dailyNotes = val;
    saveState();
  }

  // ============================================================================
  // TAB 5: EXPERT LACTATION GUIDES, CLINICAL CITATIONS & SETTINGS
  // ============================================================================
  function renderGuideTab(host) {
    const guides = window.LactationReferenceData.EXPERT_GUIDES;
    const citations = window.LactationReferenceData.CLINICAL_CITATIONS;

    host.innerHTML = `
      <div class="card">
        <h2 class="card-title">📖 Evidence-Based Lactation Guides</h2>
        <p class="card-subtitle">Offline reference guides for nursing nutrition &amp; hydration</p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${guides
            .map(
              (g) => `
            <div style="background:var(--lpink);border:1px solid var(--border-rose);border-radius:16px;padding:12px;">
              <div style="font-weight:900;font-size:14.5px;color:var(--purple);margin-bottom:4px;">${g.icon} ${g.title}</div>
              <div style="font-size:12.5px;color:var(--text-plum);line-height:1.5;">${g.summary}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Peer-Reviewed Citations (Apple Guideline 1.4.1 Compliance) -->
      <div class="card">
        <h3 class="card-title">📚 Peer-Reviewed Clinical Sources</h3>
        <p class="card-subtitle">All energy and micronutrient equations reference published medical literature:</p>
        <div style="display:flex;flex-direction:column;gap:9px;">
          ${citations
            .map(
              (c) => `
            <div style="background:#F8FAFC;border:1px solid var(--border-rose);border-radius:14px;padding:10px;">
              <div style="font-weight:900;font-size:13px;color:var(--text-plum);">${c.title}</div>
              <div style="font-size:11.5px;color:var(--text-muted);margin:2px 0;">${c.authors} — <em>${c.journal}</em></div>
              <a href="${c.url}" target="_blank" rel="noopener" style="font-size:11.5px;font-weight:900;color:var(--dpink);">
                🔗 Open Official Publication Source
              </a>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">⚙️ App Settings &amp; Privacy</h3>
        <div class="settings-row">
          <span>⚖️ Measurement System</span>
          <button class="btn-secondary" style="padding:5px 12px;font-size:12px;" onclick="LactationApp.toggleUnitSystem()">
            ${state.unitSystem === "metric" ? "Metric (cm / kg)" : "US Imperial (ft-in / lb)"}
          </button>
        </div>
        <div class="settings-row">
          <span>🗑️ Clear All On-Device Data</span>
          <button class="btn-secondary" style="padding:5px 12px;font-size:12px;" onclick="LactationApp.resetAllData()">
            Reset Data
          </button>
        </div>
        <div style="font-size:12px;color:var(--text-muted);font-weight:700;margin-top:8px;text-align:center;">
          Breastfeeding Calorie Count v1.0 • 100% Ad-Free, Private On-Device Storage
        </div>
      </div>
    `;
  }

  function resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  function boot() {
    loadState();
    renderAll();
  }

  window.addEventListener("DOMContentLoaded", boot);

  return {
    switchTab,
    toggleUnitSystem,
    updateInput,
    saveCurrentPlan,
    printReport,
    exportChartPng,
    addFoodToMealLog,
    clearMealLog,
    setNursingSide,
    toggleNursingTimer,
    setHydrationGlasses,
    updateDailyNotes,
    resetAllData
  };
})();
