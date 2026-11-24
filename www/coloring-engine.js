/**
 * Pro Coloring & Holiday Art Studio Engine for iOS Edition
 * Features:
 * 1. Accurate SVG Region Tap-to-Fill (solid colors + 6 procedural Christmas Pattern fills)
 * 2. Freehand Brush, Magic Glitter Sparkle Brush, Holiday Neon Glow Brush, & Eraser
 * 3. Interactive Holiday Sticker Stamps (12 festive vector/canvas stamps)
 * 4. Crisp black outline overlay above brush layer so line art NEVER gets covered
 * 5. Apple Pencil & Multi-touch Pinch-to-Zoom / Two-finger Pan support
 * 6. Full Undo / Redo / Reset stack & 1200x1200 High-Res PNG Export
 */

window.ColoringEngine = (function () {
  const PRESET_COLORS = [
    "#D62828", "#FF7043", "#F5C451", "#17834A", "#1E88E5", "#8E24AA", "#EC407A",
    "#8D5B4C", "#212121", "#9E9E9E", "#FFFFFF", "#81D4FA", "#9CCC65", "#FFCCBC",
    "#AD1457", "#00897B", "#FDD835", "#5E35B1", "#FB8C00", "#3949AB", "#43A047",
    "#6D4C41", "#00ACC1", "#C0CA33", "#F4511E", "#7CB342", "#E53935", "#FFD54F"
  ];

  const FESTIVE_PATTERNS = [
    { id: "pat_candy_cane", name: "Candy Cane", icon: "🍬", bg: "#FFFFFF", fg: "#D62828" },
    { id: "pat_plaid", name: "Royal Plaid", icon: "🧣", bg: "#B51B1B", fg: "#17834A" },
    { id: "pat_snowflakes", name: "Snowy Sky", icon: "❄️", bg: "#2980B9", fg: "#FFFFFF" },
    { id: "pat_gold_stars", name: "Gold Stars", icon: "🌟", bg: "#8E1B1B", fg: "#F5C451" },
    { id: "pat_polka_holly", name: "Holly Dots", icon: "🎄", bg: "#17834A", fg: "#FF5252" },
    { id: "pat_ginger_check", name: "Gingerbread", icon: "🍪", bg: "#C87D4B", fg: "#FFF3E0" }
  ];

  const HOLIDAY_STICKERS = [
    { id: "santa", label: "Santa", emoji: "🎅" },
    { id: "star", label: "Gold Star", emoji: "⭐" },
    { id: "tree", label: "Xmas Tree", emoji: "🎄" },
    { id: "snowman", label: "Snowman", emoji: "⛄" },
    { id: "reindeer", label: "Reindeer", emoji: "🦌" },
    { id: "bell", label: "Jingle Bell", emoji: "🔔" },
    { id: "gift", label: "Gift Box", emoji: "🎁" },
    { id: "candy", label: "Candy", emoji: "🍬" },
    { id: "cookie", label: "Gingerbread", emoji: "🍪" },
    { id: "snowflake", label: "Snowflake", emoji: "❄️" },
    { id: "bow", label: "Ribbon Bow", emoji: "🎀" },
    { id: "heart", label: "Love", emoji: "❤️" }
  ];

  let state = {
    drawingId: null,
    tool: "fill", // 'fill' | 'brush' | 'glitter' | 'neon' | 'pattern' | 'sticker' | 'eraser' | 'pan'
    color: "#D62828",
    brushSize: 18,
    activePattern: "pat_candy_cane",
    activeSticker: "star",
    recentColors: ["#D62828", "#17834A", "#F5C451", "#1E88E5", "#8D5B4C", "#FFCCBC"],
    regionFills: {}, // { region_1: '#HEX' or 'url(#pat_candy_cane)', ... }
    strokes: [], // [{ mode: 'brush'|'glitter'|'neon'|'eraser'|'sticker', color, size, stickerId, points }]
    undoStack: [],
    redoStack: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    isDrawingStroke: false,
    currentStroke: null,
    activePointers: new Map(),
    pinchStartDist: 0,
    pinchStartZoom: 1,
    panStartX: 0,
    panStartY: 0,
    multiTouchCooldownUntil: 0,
  };

  let dom = {
    stage: null,
    baseSvgHost: null,
    brushCanvas: null,
    brushCtx: null,
    outlineHost: null,
    zoomLabel: null,
  };

  let onStateChangeCallback = null;

  // Builds SVG <defs> with all 6 procedural Christmas patterns so SVG region fills can reference url(#pat_...)
  function getSvgPatternDefsMarkup() {
    return `
      <defs id="christmas-pro-pattern-defs">
        <pattern id="pat_candy_cane" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="24" height="24" fill="#FFFFFF"/>
          <rect x="0" y="0" width="10" height="24" fill="#D62828"/>
          <rect x="14" y="0" width="4" height="24" fill="#FF8A80"/>
        </pattern>
        <pattern id="pat_plaid" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#B51B1B"/>
          <rect x="0" y="10" width="32" height="12" fill="#17834A" fill-opacity="0.75"/>
          <rect x="10" y="0" width="12" height="32" fill="#17834A" fill-opacity="0.75"/>
          <line x1="0" y1="16" x2="32" y2="16" stroke="#F5C451" stroke-width="2"/>
          <line x1="16" y1="0" x2="16" y2="32" stroke="#F5C451" stroke-width="2"/>
        </pattern>
        <pattern id="pat_snowflakes" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#2980B9"/>
          <circle cx="8" cy="8" r="3" fill="#FFFFFF"/>
          <circle cx="22" cy="20" r="2.5" fill="#E1F5FE"/>
          <path d="M18 5 L18 11 M15 8 L21 8" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8 20 L8 26 M5 23 L11 23" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
        </pattern>
        <pattern id="pat_gold_stars" width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill="#9B1B1B"/>
          <polygon points="14,3 16.5,9.5 23.5,10 18,14.5 19.8,21.5 14,17.5 8.2,21.5 10,14.5 4.5,10 11.5,9.5" fill="#F5C451"/>
        </pattern>
        <pattern id="pat_polka_holly" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#17834A"/>
          <circle cx="7" cy="7" r="3.8" fill="#FF5252"/>
          <circle cx="18" cy="18" r="3.8" fill="#F5C451"/>
          <circle cx="19" cy="6" r="2" fill="#A5D6A7"/>
        </pattern>
        <pattern id="pat_ginger_check" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#C87D4B"/>
          <rect x="0" y="0" width="12" height="12" fill="#F5E6D3"/>
          <rect x="12" y="12" width="12" height="12" fill="#F5E6D3"/>
        </pattern>
      </defs>
    `;
  }

  function injectPatternsIntoSvgElement(svgEl) {
    if (!svgEl) return;
    if (!svgEl.querySelector("#christmas-pro-pattern-defs")) {
      svgEl.insertAdjacentHTML("afterbegin", getSvgPatternDefsMarkup());
    }
  }

  function init(containerEl, drawing, savedData, onStateChange) {
    onStateChangeCallback = onStateChange;
    state.drawingId = drawing.id;
    state.regionFills = savedData?.regionFills ? { ...savedData.regionFills } : {};
    state.strokes = savedData?.strokes ? JSON.parse(JSON.stringify(savedData.strokes)) : [];
    state.undoStack = [];
    state.redoStack = [];
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    state.isDrawingStroke = false;
    state.currentStroke = null;
    state.activePointers.clear();

    const rawSvg = window.CHRISTMAS_SVG_LIBRARY[drawing.id];
    containerEl.innerHTML = `
      <div class="canvas-stage" id="coloring-stage">
        <div id="base-svg-host" style="position:absolute;inset:0;width:100%;height:100%;"></div>
        <canvas id="brush-canvas" class="brush-layer" width="600" height="600"></canvas>
        <div id="outline-svg-host" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></div>
      </div>
    `;

    dom.stage = containerEl.querySelector("#coloring-stage");
    dom.baseSvgHost = containerEl.querySelector("#base-svg-host");
    dom.brushCanvas = containerEl.querySelector("#brush-canvas");
    dom.brushCtx = dom.brushCanvas.getContext("2d");
    dom.outlineHost = containerEl.querySelector("#outline-svg-host");
    dom.zoomLabel = containerEl.querySelector("#editor-zoom-text");

    // 1. Mount base interactive SVG (regions receive fills & pattern defs)
    dom.baseSvgHost.innerHTML = rawSvg;
    injectPatternsIntoSvgElement(dom.baseSvgHost.querySelector("svg"));

    // 2. Mount top outline-only SVG so black borders & facial features ALWAYS stay sharp above brush strokes
    const outlineSvg = rawSvg
      .replace(/fill="#[0-9A-Fa-f]{3,6}"/g, 'fill="none"')
      .replace(/fill="#111111"/g, 'fill="#111111"')
      .replace(/fill="#181818"/g, 'fill="#181818"');
    dom.outlineHost.innerHTML = outlineSvg;
    const origDoc = dom.baseSvgHost.querySelector("#line-art-details");
    const outDoc = dom.outlineHost.querySelector("#line-art-details");
    if (origDoc && outDoc) {
      outDoc.innerHTML = origDoc.innerHTML;
    }

    applySavedRegionFills();
    redrawBrushCanvas();
    bindEvents(containerEl);
    notifyChange();
  }

  function applySavedRegionFills() {
    const svgEl = dom.baseSvgHost.querySelector("svg");
    if (!svgEl) return;
    injectPatternsIntoSvgElement(svgEl);
    const regions = svgEl.querySelectorAll("[data-region-id]");
    regions.forEach((el) => {
      const rid = el.getAttribute("data-region-id");
      const rname = el.getAttribute("data-region-name");
      const color = state.regionFills[rid] || (rname && state.regionFills[rname]) || "#FFFFFF";
      if (state.regionFills[rname] && !state.regionFills[rid]) {
        state.regionFills[rid] = state.regionFills[rname];
      }
      el.setAttribute("fill", color);
    });
  }

  // Deterministic pseudo-random helper for sparkle particles so redraws stay stable
  function pseudoRand(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function drawFourPointStar(ctx, cx, cy, outerR, innerR, fillStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / 4;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function redrawBrushCanvas() {
    if (!dom.brushCtx) return;
    const ctx = dom.brushCtx;
    ctx.clearRect(0, 0, 600, 600);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const allStrokes = state.currentStroke ? [...state.strokes, state.currentStroke] : state.strokes;
    for (let sIdx = 0; sIdx < allStrokes.length; sIdx++) {
      const s = allStrokes[sIdx];
      if (!s.points || s.points.length === 0) continue;
      ctx.save();

      if (s.mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = s.size;
        tracePath(ctx, s.points);
        ctx.stroke();
      } else if (s.mode === "sticker") {
        // Render Holiday Sticker Stamp
        const pt = s.points[0];
        const stObj = HOLIDAY_STICKERS.find((x) => x.id === s.stickerId) || HOLIDAY_STICKERS[0];
        const fontSize = Math.max(26, (s.size || 24) * 1.9);
        ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.18)";
        ctx.shadowBlur = 6;
        ctx.fillText(stObj.emoji, pt.x, pt.y);
      } else if (s.mode === "neon") {
        // Holiday Neon Glow Brush: Outer colored aura + white hot center core
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowColor = s.color;
        ctx.shadowBlur = Math.max(14, s.size * 0.95);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        tracePath(ctx, s.points);
        ctx.stroke();

        // Inner luminous filament
        ctx.shadowBlur = 4;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = Math.max(2, s.size * 0.34);
        tracePath(ctx, s.points);
        ctx.stroke();
      } else if (s.mode === "glitter") {
        // Magic Glitter Brush: Rich base shimmer + multi-faceted metallic & diamond sparkles
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.globalAlpha = 0.85;
        tracePath(ctx, s.points);
        ctx.stroke();
        ctx.globalAlpha = 1;

        const spread = Math.max(8, s.size * 0.65);
        for (let i = 0; i < s.points.length; i++) {
          const pt = s.points[i];
          const seedBase = (sIdx + 1) * 1000 + i * 17;
          // 2 sparkle flecks per point
          for (let k = 0; k < 2; k++) {
            const r1 = pseudoRand(seedBase + k * 3);
            const r2 = pseudoRand(seedBase + k * 3 + 1);
            const r3 = pseudoRand(seedBase + k * 3 + 2);
            const ox = (r1 - 0.5) * spread * 1.5;
            const oy = (r2 - 0.5) * spread * 1.5;
            const dotR = 1.4 + r3 * 2.4;
            ctx.fillStyle = r3 > 0.5 ? "#FFF9C4" : "#FFD54F";
            ctx.beginPath();
            ctx.arc(pt.x + ox, pt.y + oy, dotR, 0, Math.PI * 2);
            ctx.fill();
          }
          // Every 3rd point draw a bright 4-point star flare
          if (i % 3 === 0) {
            const rx = (pseudoRand(seedBase + 9) - 0.5) * spread;
            const ry = (pseudoRand(seedBase + 11) - 0.5) * spread;
            drawFourPointStar(ctx, pt.x + rx, pt.y + ry, Math.max(4, s.size * 0.28), 1.3, "#FFFFFF");
          }
        }
      } else {
        // Standard smooth marker brush
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        tracePath(ctx, s.points);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function tracePath(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    if (points.length === 1) {
      ctx.lineTo(points[0].x + 0.1, points[0].y + 0.1);
    }
  }

  function pushSnapshot() {
    state.undoStack.push({
      regionFills: { ...state.regionFills },
      strokes: JSON.parse(JSON.stringify(state.strokes)),
    });
    if (state.undoStack.length > 40) state.undoStack.shift();
    state.redoStack = [];
  }

  function clientToSvgCoords(clientX, clientY) {
    const rect = dom.stage.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 600;
    const y = ((clientY - rect.top) / rect.height) * 600;
    return {
      x: Math.max(0, Math.min(600, x)),
      y: Math.max(0, Math.min(600, y)),
    };
  }

  function bindEvents(viewportEl) {
    viewportEl.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        stepZoom(delta);
      },
      { passive: false }
    );

    viewportEl.addEventListener("pointerdown", (e) => {
      if (e.target.closest("#editor-zoom-badge")) return;
      state.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (state.activePointers.size >= 2) {
        state.isDrawingStroke = false;
        state.currentStroke = null;
        state.multiTouchCooldownUntil = Date.now() + 260;
        const pts = Array.from(state.activePointers.values());
        state.pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        state.pinchStartZoom = state.zoom;
        return;
      }

      if (Date.now() < state.multiTouchCooldownUntil) return;

      if (state.tool === "pan") {
        state.panStartX = e.clientX - state.panX;
        state.panStartY = e.clientY - state.panY;
        return;
      }

      if (state.tool === "fill" || state.tool === "pattern") {
        const hitEl = document.elementFromPoint(e.clientX, e.clientY);
        const regionEl = hitEl ? hitEl.closest("[data-region-id]") : null;
        if (regionEl) {
          const rid = regionEl.getAttribute("data-region-id");
          const fillValue = state.tool === "pattern" ? `url(#${state.activePattern})` : state.color;
          const prevColor = state.regionFills[rid] || "#FFFFFF";
          if (prevColor.toUpperCase() !== fillValue.toUpperCase()) {
            pushSnapshot();
            state.regionFills[rid] = fillValue;
            regionEl.setAttribute("fill", fillValue);
            if (state.tool === "fill") recordRecentColor(state.color);
            if (window.FestiveAudio) window.FestiveAudio.playFillChime();
            if (window.App?.recordAchievementEvent) {
              window.App.recordAchievementEvent(state.tool === "pattern" ? "use_pattern" : "fill_region");
            }
            notifyChange();
          }
        }
        return;
      }

      if (state.tool === "sticker") {
        const pt = clientToSvgCoords(e.clientX, e.clientY);
        pushSnapshot();
        state.strokes.push({
          mode: "sticker",
          stickerId: state.activeSticker,
          size: state.brushSize,
          points: [pt]
        });
        if (window.FestiveAudio) window.FestiveAudio.playStickerStamp();
        if (window.App?.recordAchievementEvent) window.App.recordAchievementEvent("place_sticker");
        redrawBrushCanvas();
        notifyChange();
        return;
      }

      if (["brush", "glitter", "neon", "eraser"].includes(state.tool)) {
        const pt = clientToSvgCoords(e.clientX, e.clientY);
        state.isDrawingStroke = true;
        state.currentStroke = {
          mode: state.tool,
          color: state.color,
          size: state.brushSize,
          points: [pt],
        };
        if (state.tool === "glitter" && window.FestiveAudio) {
          window.FestiveAudio.playGlitterSparkle();
        }
        redrawBrushCanvas();
      }
    });

    viewportEl.addEventListener("pointermove", (e) => {
      if (!state.activePointers.has(e.pointerId)) return;
      state.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (state.activePointers.size >= 2) {
        const pts = Array.from(state.activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (state.pinchStartDist > 20) {
          const scale = dist / state.pinchStartDist;
          setZoom(state.pinchStartZoom * scale);
        }
        return;
      }

      if (state.tool === "pan" && state.activePointers.size === 1) {
        state.panX = e.clientX - state.panStartX;
        state.panY = e.clientY - state.panStartY;
        updateStageTransform();
        return;
      }

      if (state.isDrawingStroke && state.currentStroke) {
        const pt = clientToSvgCoords(e.clientX, e.clientY);
        state.currentStroke.points.push(pt);
        if (state.currentStroke.mode === "glitter" && state.currentStroke.points.length % 10 === 0) {
          if (window.FestiveAudio) window.FestiveAudio.playGlitterSparkle();
        }
        redrawBrushCanvas();
      }
    });

    const endPointer = (e) => {
      state.activePointers.delete(e.pointerId);
      if (state.isDrawingStroke && state.currentStroke) {
        pushSnapshot();
        const usedMode = state.currentStroke.mode;
        state.strokes.push(state.currentStroke);
        state.currentStroke = null;
        state.isDrawingStroke = false;
        recordRecentColor(state.color);
        if (window.App?.recordAchievementEvent) {
          if (usedMode === "glitter") window.App.recordAchievementEvent("use_glitter");
          if (usedMode === "neon") window.App.recordAchievementEvent("use_neon");
        }
        redrawBrushCanvas();
        notifyChange();
      }
    };

    viewportEl.addEventListener("pointerup", endPointer);
    viewportEl.addEventListener("pointercancel", endPointer);
  }

  function recordRecentColor(hex) {
    if (!hex || !hex.startsWith("#")) return;
    const clean = hex.toUpperCase();
    state.recentColors = [clean, ...state.recentColors.filter((c) => c.toUpperCase() !== clean)].slice(0, 8);
  }

  function setZoom(newZoom) {
    state.zoom = Math.max(1, Math.min(3.5, Math.round(newZoom * 100) / 100));
    if (state.zoom === 1) {
      state.panX = 0;
      state.panY = 0;
    }
    updateStageTransform();
  }

  function stepZoom(delta) {
    setZoom(state.zoom + delta);
  }

  function resetZoom() {
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    updateStageTransform();
  }

  function updateStageTransform() {
    if (!dom.stage) return;
    dom.stage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    if (dom.zoomLabel) {
      dom.zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
    }
  }

  function undo() {
    if (state.undoStack.length === 0) return false;
    state.redoStack.push({
      regionFills: { ...state.regionFills },
      strokes: JSON.parse(JSON.stringify(state.strokes)),
    });
    const prev = state.undoStack.pop();
    state.regionFills = prev.regionFills;
    state.strokes = prev.strokes;
    applySavedRegionFills();
    redrawBrushCanvas();
    notifyChange();
    return true;
  }

  function redo() {
    if (state.redoStack.length === 0) return false;
    state.undoStack.push({
      regionFills: { ...state.regionFills },
      strokes: JSON.parse(JSON.stringify(state.strokes)),
    });
    const next = state.redoStack.pop();
    state.regionFills = next.regionFills;
    state.strokes = next.strokes;
    applySavedRegionFills();
    redrawBrushCanvas();
    notifyChange();
    return true;
  }

  function resetDrawing() {
    pushSnapshot();
    state.regionFills = {};
    state.strokes = [];
    applySavedRegionFills();
    redrawBrushCanvas();
    notifyChange();
  }

  function notifyChange() {
    if (onStateChangeCallback) {
      onStateChangeCallback(getStateSummary());
    }
  }

  function getStateSummary() {
    const filledCount = Object.values(state.regionFills).filter(
      (c) => c && c.toUpperCase() !== "#FFFFFF"
    ).length;
    return {
      drawingId: state.drawingId,
      tool: state.tool,
      color: state.color,
      brushSize: state.brushSize,
      activePattern: state.activePattern,
      activeSticker: state.activeSticker,
      recentColors: state.recentColors,
      canUndo: state.undoStack.length > 0,
      canRedo: state.redoStack.length > 0,
      filledCount,
      strokeCount: state.strokes.length,
      regionFills: { ...state.regionFills },
      strokes: JSON.parse(JSON.stringify(state.strokes)),
    };
  }

  async function exportCompositePng(size = 1000) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);

    const serializeSvg = (svgNode) => {
      const clone = svgNode.cloneNode(true);
      clone.setAttribute("width", String(size));
      clone.setAttribute("height", String(size));
      return new XMLSerializer().serializeToString(clone);
    };

    const drawSvgString = (svgStr) =>
      new Promise((resolve) => {
        const img = new Image();
        const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });

    const baseSvgEl = dom.baseSvgHost?.querySelector("svg");
    if (baseSvgEl) {
      await drawSvgString(serializeSvg(baseSvgEl));
    }
    if (dom.brushCanvas) {
      ctx.drawImage(dom.brushCanvas, 0, 0, size, size);
    }
    const outlineSvgEl = dom.outlineHost?.querySelector("svg");
    if (outlineSvgEl) {
      await drawSvgString(serializeSvg(outlineSvgEl));
    }

    return canvas.toDataURL("image/png");
  }

  function setTool(toolName) {
    state.tool = toolName;
    if (window.FestiveAudio) window.FestiveAudio.playPop(580, 0.05);
    notifyChange();
  }

  function setColor(hex) {
    state.color = hex;
    recordRecentColor(hex);
    if (state.tool === "eraser" || state.tool === "pan" || state.tool === "pattern" || state.tool === "sticker") {
      state.tool = "fill";
    }
    if (window.FestiveAudio) window.FestiveAudio.playPop(640, 0.05);
    notifyChange();
  }

  function setPattern(patternId) {
    state.activePattern = patternId;
    state.tool = "pattern";
    if (window.FestiveAudio) window.FestiveAudio.playPop(660, 0.06);
    notifyChange();
  }

  function setSticker(stickerId) {
    state.activeSticker = stickerId;
    state.tool = "sticker";
    if (window.FestiveAudio) window.FestiveAudio.playPop(700, 0.06);
    notifyChange();
  }

  function setBrushSize(sz) {
    state.brushSize = Number(sz) || 18;
    notifyChange();
  }

  function buildColoredSvgMarkup(drawingId, savedWork) {
    let raw = window.CHRISTMAS_SVG_LIBRARY[drawingId] || "";
    if (raw.includes("<svg") && !raw.includes("christmas-pro-pattern-defs")) {
      raw = raw.replace(/(<svg[^>]*>)/i, `$1${getSvgPatternDefsMarkup()}`);
    }
    if (!savedWork || !savedWork.regionFills) return raw;
    for (const [key, color] of Object.entries(savedWork.regionFills)) {
      if (key.startsWith("region_")) {
        const target = `id="${key}" data-region-id="${key}"`;
        const next = `id="${key}" data-region-id="${key}" style="fill:${color}"`;
        raw = raw.replace(target, next);
      } else {
        const target = `data-region-name="${key}" fill="#FFFFFF"`;
        const next = `data-region-name="${key}" fill="${color}"`;
        raw = raw.replace(target, next);
      }
    }
    return raw;
  }

  return {
    PRESET_COLORS,
    FESTIVE_PATTERNS,
    HOLIDAY_STICKERS,
    init,
    setTool,
    setColor,
    setPattern,
    setSticker,
    setBrushSize,
    undo,
    redo,
    resetDrawing,
    stepZoom,
    resetZoom,
    getStateSummary,
    exportCompositePng,
    buildColoredSvgMarkup,
  };
})();
