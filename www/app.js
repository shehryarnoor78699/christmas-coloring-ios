/**
 * Christmas Coloring Studio Pro — Master Application Controller (iOS Paid $4.99 Ad-Free Edition)
 * Features:
 * - 100% Ad-Free, Zero Tracking, Apple Kids Category & HIG Compliant
 * - 300 Offline Validated Vector Coloring Pages across 20 Categories & 3 Difficulty Levels
 * - 7 Studio Coloring Tools: Fill, Marker Brush, Magic Glitter Brush, Neon Glow Brush,
 *   6 Christmas Pattern Fills, 12 Holiday Sticker Stamps, and Precision Eraser
 * - Magic Rainbow Scratch Art Studio (Scratch & Glow)
 * - Holiday Greeting Card Maker (5 Ornate Frames, Custom To/From Message, High-Res Card Export & Share)
 * - Royal Christmas Trophy Room (12 Unlockable Achievement Badges)
 * - Festive Music Box Synthesizer & Interactive Sound Effects + iOS Haptics
 * - Full Printable PDF Book Builder (A4 & US Letter) + AirPrint & Native iOS Share Sheet
 */

window.App = (function () {
  const STORAGE_KEY = "CHRISTMAS_STUDIO_IOS_PRO_V1";

  const APP_METADATA = {
    appName: "Christmas Coloring Studio Pro",
    bundleId: "com.shehryarnoor.christmascoloring.ios",
    version: "1.0.0",
    edition: "iOS Pro Edition (100% Ad-Free)",
    developerName: "Roots services B.V.",
    supportEmail: "sherykhan1012@gmail.com",
    privacyPolicyUrl: "https://shehryarnoor.com/privacy-policy/christmas-coloring-pages/",
  };

  const ACHIEVEMENT_BADGES = [
    { id: "first_color", icon: "🎨", title: "First Splash", desc: "Fill your first coloring region" },
    { id: "first_complete", icon: "🎅", title: "Santa's Helper", desc: "Complete and save 1 coloring page" },
    { id: "glitter_artist", icon: "✨", title: "Glitter Magician", desc: "Paint with the Magic Glitter Brush" },
    { id: "neon_designer", icon: "🌟", title: "Neon Light Artist", desc: "Draw with the Holiday Neon Glow Brush" },
    { id: "pattern_tailor", icon: "🧣", title: "Pattern Tailor", desc: "Fill a region with a Festive Pattern" },
    { id: "sticker_lover", icon: "🎀", title: "Sticker Styler", desc: "Stamp Holiday Stickers on your art" },
    { id: "scratch_wizard", icon: "🌈", title: "Scratch Art Wizard", desc: "Reveal colors in Magic Scratch Art" },
    { id: "card_creator", icon: "💌", title: "Greeting Card Maker", desc: "Design a Christmas Greeting Card" },
    { id: "five_favorites", icon: "❤️", title: "Holiday Curator", desc: "Save 5 pages to your Favorites" },
    { id: "five_completed", icon: "🎄", title: "Festive Explorer", desc: "Complete 5 coloring pages" },
    { id: "ten_completed", icon: "⛄", title: "Winter Master", desc: "Complete 10 coloring pages" },
    { id: "pdf_printer", icon: "🖨️", title: "Book Publisher", desc: "Create a printable Christmas PDF" }
  ];

  const CARD_FRAMES = [
    { id: "gold_holly", name: "Royal Gold & Holly", border: "#D4AF37", innerBg: "#FFFDF7", accent: "#B51B1B", textCol: "#8B0000" },
    { id: "candy_stripe", name: "Candy Cane Border", border: "#D62828", innerBg: "#FFFFFF", accent: "#17834A", textCol: "#C8161D" },
    { id: "evergreen_pine", name: "Winter Evergreen", border: "#174B35", innerBg: "#F4FBF7", accent: "#D4AF37", textCol: "#174B35" },
    { id: "midnight_star", name: "Starlight Night", border: "#1E3A8A", innerBg: "#F0F7FF", accent: "#F59E0B", textCol: "#1E3A8A" },
    { id: "ginger_warm", name: "Warm Gingerbread", border: "#8D5B4C", innerBg: "#FFF8F0", accent: "#D62828", textCol: "#6D4C41" }
  ];

  let store = {
    version: 1,
    favorites: ["drawing_001", "drawing_016", "drawing_046", "drawing_061"],
    artworks: {},
    recentHistory: [],
    unlockedBadges: ["first_color", "first_complete"],
    stats: {
      stickersPlaced: 0,
      glitterUsed: 0,
      neonUsed: 0,
      patternsUsed: 0,
      cardsCreated: 0,
      scratchArtsPlayed: 0
    },
    settings: {
      music: true,
      sound: true,
      vibration: true,
      snowfall: true,
      allowPrinting: true,
      allowSharing: true,
      allowPdfExport: true,
      privacyPolicyUrl: "https://shehryarnoor.com/privacy-policy/christmas-coloring-pages/",
    },
  };

  let nav = {
    screen: "splash",
    history: [],
    selectedCategory: "all",
    selectedDifficulty: "all",
    searchQuery: "",
    activeDrawingId: "drawing_001",
    artworkFilter: "all",
    printableFilterCat: "all",
    printableFilterDiff: "all",
    selectedPrintIds: ["drawing_001", "drawing_016", "drawing_031", "drawing_046", "drawing_061", "drawing_076"],
    pdfPaperSize: "A4",
    pdfLayoutMode: "single",
    generatedPdfBundle: null,
    pdfPreviewPageIdx: 0,
    // Greeting Card Studio state
    cardDrawingId: "drawing_001",
    cardFrameId: "gold_holly",
    cardHeadline: "Merry Christmas!",
    cardTo: "Mom & Dad",
    cardFrom: "Little Artist",
    // Scratch Art state
    scratchDrawingId: "drawing_001",
    scratchBrushSize: 28,
  };

  function seedInitialSampleIfEmpty() {
    if (Object.keys(store.artworks).length === 0) {
      store.artworks["drawing_001"] = {
        drawingId: "drawing_001",
        customTitle: "Santa Fun",
        status: "completed",
        regionFills: {
          santa_gift_sack: "#17834A",
          sack_gift_box: "#F5C451",
          sack_gift_ribbon: "#D62828",
          sack_bow_l: "#D62828",
          sack_bow_r: "#D62828",
          santa_red_coat: "#D62828",
          waving_arm: "#D62828",
          waving_mitten: "#D62828",
          front_arm: "#D62828",
          front_mitten: "#D62828",
          left_pant_leg: "#D62828",
          right_pant_leg: "#D62828",
          santa_hat_red: "#D62828",
          santa_hat_tail: "#D62828",
          santa_black_belt: "#212121",
          belt_gold_buckle: "#F5C451",
          belt_buckle_center: "#212121",
          santa_face: "#FFCCBC",
          santa_nose: "#FF8A65",
          santa_mouth: "#D62828",
        },
        strokes: [],
        updatedAt: Date.now() - 3600000,
      };
      store.recentHistory = [
        { drawingId: "drawing_001", openedAt: Date.now() - 1800000 },
        { drawingId: "drawing_016", openedAt: Date.now() - 5400000 },
        { drawingId: "drawing_031", openedAt: Date.now() - 86400000 },
      ];
      saveStore();
    }
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        store = {
          ...store,
          ...parsed,
          settings: { ...store.settings, ...(parsed.settings || {}) },
          stats: { ...store.stats, ...(parsed.stats || {}) },
          artworks: parsed.artworks || {},
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : store.favorites,
          unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : store.unlockedBadges,
          recentHistory: Array.isArray(parsed.recentHistory) ? parsed.recentHistory : [],
        };
      }
    } catch (e) {
      console.warn("Storage load fallback:", e);
    }
    seedInitialSampleIfEmpty();
    syncAudioSettings();
  }

  function saveStore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      showToast("Storage full — please clear old exports in Settings.");
    }
  }

  function syncAudioSettings() {
    if (window.FestiveAudio) {
      window.FestiveAudio.configure({
        music: store.settings.music,
        sfx: store.settings.sound,
        haptics: store.settings.vibration
      });
    }
  }

  function playPopSound(freq = 540, duration = 0.06) {
    if (window.FestiveAudio) {
      window.FestiveAudio.playPop(freq, duration);
    }
  }

  function playChimeSound() {
    if (window.FestiveAudio) {
      window.FestiveAudio.playFanfare();
    }
  }

  function unlockBadge(badgeId) {
    if (!store.unlockedBadges.includes(badgeId)) {
      store.unlockedBadges.push(badgeId);
      saveStore();
      const b = ACHIEVEMENT_BADGES.find((x) => x.id === badgeId);
      if (b) {
        if (window.FestiveAudio) window.FestiveAudio.playFanfare();
        showToast(`🏆 Badge Unlocked: ${b.title}!`);
      }
    }
  }

  function recordAchievementEvent(type) {
    if (type === "fill_region") unlockBadge("first_color");
    if (type === "use_glitter") {
      store.stats.glitterUsed++;
      unlockBadge("glitter_artist");
    }
    if (type === "use_neon") {
      store.stats.neonUsed++;
      unlockBadge("neon_designer");
    }
    if (type === "use_pattern") {
      store.stats.patternsUsed++;
      unlockBadge("pattern_tailor");
    }
    if (type === "place_sticker") {
      store.stats.stickersPlaced++;
      unlockBadge("sticker_lover");
    }
    if (type === "scratch_art") {
      store.stats.scratchArtsPlayed++;
      unlockBadge("scratch_wizard");
    }
    if (type === "card_created") {
      store.stats.cardsCreated++;
      unlockBadge("card_creator");
    }
    if (type === "pdf_created") {
      unlockBadge("pdf_printer");
    }
    saveStore();
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.add("hidden"), 2400);
  }

  function getCatalog() {
    return window.CHRISTMAS_CATALOG || { categories: [], drawings: [] };
  }

  function getDrawingById(id) {
    return getCatalog().drawings.find((d) => d.id === id) || getCatalog().drawings[0];
  }

  function isFavorite(id) {
    return store.favorites.includes(id);
  }

  function toggleFavorite(id, ev) {
    if (ev) ev.stopPropagation();
    playPopSound(620, 0.07);
    if (isFavorite(id)) {
      store.favorites = store.favorites.filter((x) => x !== id);
      showToast("Removed from Favorites");
    } else {
      store.favorites.push(id);
      showToast("Added to Favorites ❤️");
      if (store.favorites.length >= 5) unlockBadge("five_favorites");
    }
    saveStore();
    renderCurrentScreen();
  }

  function recordRecentOpen(drawingId) {
    const now = Date.now();
    store.recentHistory = [
      { drawingId, openedAt: now },
      ...store.recentHistory.filter((r) => r.drawingId !== drawingId),
    ].slice(0, 40);
    saveStore();
  }

  function getProgressStats() {
    const drawings = getCatalog().drawings;
    let easyDone = 0, mediumDone = 0, advancedDone = 0;
    let inProgressCount = 0;

    for (const d of drawings) {
      const art = store.artworks[d.id];
      if (art?.status === "completed") {
        if (d.difficulty === "easy") easyDone++;
        else if (d.difficulty === "medium") mediumDone++;
        else if (d.difficulty === "advanced") advancedDone++;
      } else if (art?.status === "in-progress") {
        inProgressCount++;
      }
    }
    const totalDone = easyDone + mediumDone + advancedDone;
    return {
      easyDone,
      mediumDone,
      advancedDone,
      totalDone,
      inProgressCount,
      totalSaved: Object.keys(store.artworks).length,
      badgesUnlocked: store.unlockedBadges.length,
      badgesTotal: ACHIEVEMENT_BADGES.length
    };
  }

  function updateBottomNav() {
    const navBar = document.getElementById("bottom-nav");
    const hideOn = ["splash", "editor", "scratch_art", "card_studio", "printable", "pdf_preview", "print_options", "print_dialog", "completed_preview"];
    if (hideOn.includes(nav.screen)) {
      navBar.classList.add("hidden");
      return;
    }
    navBar.classList.remove("hidden");
    const activeTabMap = {
      home: "home",
      categories: "categories",
      levels: "levels",
      gallery: "categories",
      detail: "levels",
      studio_hub: "studio_hub",
      achievements: "studio_hub",
      artwork: "studio_hub",
      artwork_detail: "studio_hub",
      favorites: "studio_hub",
      recent: "studio_hub",
      progress: "levels",
      settings: "settings",
      parent_controls: "settings",
      privacy: "settings",
      about: "settings",
    };
    const activeTab = activeTabMap[nav.screen] || "home";
    navBar.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-nav") === activeTab);
    });
  }

  function navigate(screen, params = {}, pushHistory = true) {
    playPopSound(480, 0.05);
    if (pushHistory && nav.screen && nav.screen !== "splash" && nav.screen !== screen) {
      nav.history.push({
        screen: nav.screen,
        selectedCategory: nav.selectedCategory,
        selectedDifficulty: nav.selectedDifficulty,
        activeDrawingId: nav.activeDrawingId,
      });
      if (nav.history.length > 25) nav.history.shift();
    }
    Object.assign(nav, params);
    nav.screen = screen;
    updateBottomNav();
    renderCurrentScreen();
    const sc = document.getElementById("screen-container");
    if (sc && screen !== "editor" && screen !== "scratch_art") sc.scrollTop = 0;
  }

  function goBack() {
    if (nav.history.length > 0) {
      const prev = nav.history.pop();
      navigate(prev.screen, prev, false);
    } else {
      navigate("home", {}, false);
    }
  }

  function getCategoryArtHtml(cat) {
    if (window.UltraHdArt?.CATEGORY_ART?.[cat.id]) {
      return window.UltraHdArt.CATEGORY_ART[cat.id];
    }
    return window.CHRISTMAS_CATEGORY_ICONS[cat.id] || "";
  }

  // ============================================================================
  // FESTIVE SNOWFALL PARTICLE SYSTEM
  // ============================================================================
  function initSnowfallEffect() {
    const canvas = document.getElementById("snow-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let flakes = [];

    function resize() {
      canvas.width = canvas.clientWidth || 412;
      canvas.height = canvas.clientHeight || 800;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 28; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 2.6,
        vy: 0.4 + Math.random() * 0.85,
        vx: (Math.random() - 0.5) * 0.45,
        alpha: 0.35 + Math.random() * 0.5
      });
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const showSnow = store.settings.snowfall && !["editor", "scratch_art", "card_studio", "pdf_preview"].includes(nav.screen);
      if (showSnow) {
        for (const f of flakes) {
          f.y += f.vy;
          f.x += f.vx;
          if (f.y > canvas.height) {
            f.y = -5;
            f.x = Math.random() * canvas.width;
          }
          if (f.x > canvas.width) f.x = 0;
          if (f.x < 0) f.x = canvas.width;
          ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ============================================================================
  // SCREEN 17: PARENTAL GATE (Apple Kids Category Requirement)
  // ============================================================================
  function requireParentGate(actionLabel, onVerified) {
    const a = 7;
    const b = 5;
    const correct = 12;
    const options = [10, 11, 12];

    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" onclick="App.closeModal()">✕</button>
        <div style="font-size:44px;margin-bottom:4px;">🔒</div>
        <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;color:#161E19;">Parent Only</h2>
        <p style="margin:0 0 14px;font-size:14px;color:#566B60;font-weight:700;">
          Solve to continue (${actionLabel})
        </p>
        <div style="background:#F3F5F4;border-radius:14px;padding:12px;font-size:26px;font-weight:900;color:#161E19;border:1.5px solid #DFE5E1;">
          ${a} + ${b} = <span style="color:#1B8730;">?</span>
        </div>
        <div class="math-choices">
          ${options
            .map(
              (opt) => `
            <button class="math-choice-btn ${opt === correct ? "green-highlight" : ""}" onclick="App.submitParentGate(${opt}, ${correct})">${opt}</button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    requireParentGate._callback = onVerified;
  }

  function submitParentGate(chosen, correct) {
    if (chosen === correct) {
      playChimeSound();
      closeModal();
      if (requireParentGate._callback) requireParentGate._callback();
    } else {
      playPopSound(220, 0.12);
      showToast("Incorrect answer — Parents Only 🔒");
      closeModal();
    }
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
    }
  }

  // ============================================================================
  // SCREEN RENDERERS
  // ============================================================================
  function renderCurrentScreen() {
    const host = document.getElementById("screen-container");
    if (!host) return;

    switch (nav.screen) {
      case "splash":
        renderSplashScreen(host);
        break;
      case "home":
        renderHomeScreen(host);
        break;
      case "categories":
        renderCategoryGallery(host);
        break;
      case "levels":
        renderDifficultySelection(host);
        break;
      case "gallery":
        renderColoringGallery(host);
        break;
      case "detail":
        renderDrawingDetail(host);
        break;
      case "editor":
        renderColoringEditor(host);
        break;
      case "studio_hub":
        renderStudioHubScreen(host);
        break;
      case "card_studio":
        renderGreetingCardStudio(host);
        break;
      case "scratch_art":
        renderScratchArtStudio(host);
        break;
      case "achievements":
        renderAchievementsScreen(host);
        break;
      case "artwork":
        renderMyArtworkScreen(host);
        break;
      case "artwork_detail":
        renderArtworkDetailScreen(host);
        break;
      case "favorites":
        renderFavoritesScreen(host);
        break;
      case "recent":
        renderRecentlyColoredScreen(host);
        break;
      case "printable":
        renderPrintablePagesScreen(host);
        break;
      case "pdf_preview":
        renderPdfPreviewScreen(host);
        break;
      case "print_options":
        renderPrintOptionsScreen(host);
        break;
      case "print_dialog":
        renderPrintDialogScreen(host);
        break;
      case "completed_preview":
        renderCompletedArtworkPreview(host);
        break;
      case "progress":
        renderProgressDashboard(host);
        break;
      case "settings":
        renderSettingsScreen(host);
        break;
      case "parent_controls":
        renderParentControlsScreen(host);
        break;
      case "privacy":
        renderPrivacyScreen(host);
        break;
      case "about":
        renderAboutScreen(host);
        break;
      default:
        renderHomeScreen(host);
    }
  }

  // --- Screen 1: Splash Screen ---
  function renderSplashScreen(host) {
    host.innerHTML = `
      <div class="splash-screen">
        <div class="splash-hero-vector">${window.UltraHdArt?.SPLASH_HERO_SVG || ""}</div>
        <div class="splash-loader-box">
          <div class="splash-loader-label">Loading Christmas Studio Pro...</div>
          <div class="progress-track">
            <div class="progress-fill" id="splash-progress-bar" style="width:45%;"></div>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => {
      const bar = document.getElementById("splash-progress-bar");
      if (bar) bar.style.width = "100%";
    }, 180);
    setTimeout(() => {
      if (nav.screen === "splash") navigate("home", {}, false);
    }, 650);
  }

  // --- Screen 2: Home Screen (With Pro Studio Modes & Music Toggle) ---
  function renderHomeScreen(host) {
    const catList = getCatalog().categories;
    const top5Cats = catList.slice(0, 5);
    const musicOn = store.settings.music;

    host.innerHTML = `
      <div class="home-hero-banner-wrap">
        <span class="home-pro-badge">👑 PRO EDITION • AD-FREE</span>
        <button class="home-floating-music-btn" onclick="App.toggleMusicQuick()" title="Toggle Christmas Music">
          ${musicOn ? "🎵" : "🔇"}
        </button>
        ${window.UltraHdArt?.HOME_HERO_SVG || ""}
      </div>

      <div class="home-content-card">
        <!-- 4 Glossy Action Buttons -->
        <div class="main-actions-grid">
          <button class="action-card pink" onclick="App.startColoring('drawing_001')">
            <div class="action-card-svg">${window.UltraHdArt?.ACTION_ICONS?.colorNow || ""}</div>
            <span class="action-card-title">Color Now</span>
          </button>
          <button class="action-card blue" onclick="App.navigate('printable')">
            <div class="action-card-svg">${window.UltraHdArt?.ACTION_ICONS?.printable || ""}</div>
            <span class="action-card-title">Printable<br/>Pages (PDF)</span>
          </button>
          <button class="action-card yellow" onclick="App.navigate('artwork')">
            <div class="action-card-svg">${window.UltraHdArt?.ACTION_ICONS?.artwork || ""}</div>
            <span class="action-card-title">My Artwork</span>
          </button>
          <button class="action-card purple" onclick="App.navigate('favorites')">
            <div class="action-card-svg">${window.UltraHdArt?.ACTION_ICONS?.favorites || ""}</div>
            <span class="action-card-title">Favorites</span>
          </button>
        </div>

        <!-- Exclusive Pro Creative Studio Strip -->
        <div class="pro-studio-banner-row">
          <button class="pro-mini-card" style="background:linear-gradient(135deg,#6366F1,#A855F7);" onclick="App.navigate('scratch_art')">
            <span class="pro-mini-icon">🌈</span>
            <span class="pro-mini-label">Magic Scratch</span>
          </button>
          <button class="pro-mini-card" style="background:linear-gradient(135deg,#E11D48,#F43F5E);" onclick="App.navigate('card_studio')">
            <span class="pro-mini-icon">💌</span>
            <span class="pro-mini-label">Xmas Cards</span>
          </button>
          <button class="pro-mini-card" style="background:linear-gradient(135deg,#D97706,#F59E0B);" onclick="App.navigate('achievements')">
            <span class="pro-mini-icon">🏆</span>
            <span class="pro-mini-label">Trophy Room</span>
          </button>
        </div>

        <!-- Explore Categories Heading -->
        <div class="explore-heading">
          <h2>🎄 Explore 20 Categories</h2>
        </div>

        <!-- 3x2 Categories Grid -->
        <div class="categories-grid-home">
          ${top5Cats
            .map(
              (c) => `
            <div class="cat-tile-home" style="background:${c.bg};" onclick="App.openCategory('${c.id}')">
              ${getCategoryArtHtml(c)}
              <div class="cat-tile-label">${c.shortName}</div>
            </div>
          `
            )
            .join("")}
          <div class="cat-tile-home" style="background:#E8D5FF;justify-content:center;gap:6px;" onclick="App.navigate('categories')">
            <div style="display:grid;grid-template-columns:repeat(2,16px);gap:4px;">
              <span style="width:16px;height:16px;background:#9C4DF4;border-radius:4px;display:block;"></span>
              <span style="width:16px;height:16px;background:#9C4DF4;border-radius:4px;display:block;"></span>
              <span style="width:16px;height:16px;background:#9C4DF4;border-radius:4px;display:block;"></span>
              <span style="width:16px;height:16px;background:#9C4DF4;border-radius:4px;display:block;"></span>
            </div>
            <div class="cat-tile-label">All 20</div>
          </div>
        </div>

        <div class="winter-footer-wrap">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  function toggleMusicQuick() {
    store.settings.music = !store.settings.music;
    saveStore();
    syncAudioSettings();
    showToast(store.settings.music ? "🎵 Christmas Music On" : "🔇 Christmas Music Muted");
    renderCurrentScreen();
  }

  // --- Pro Studio Hub Screen ---
  function renderStudioHubScreen(host) {
    const stats = getProgressStats();
    host.innerHTML = `
      <div class="top-bar royal-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">✨ Pro Creative Studio</h1>
        </div>
      </div>

      <div class="page-body">
        <div style="background:linear-gradient(135deg,#4F46E5 0%,#9333EA 100%);color:#FFF;border-radius:22px;padding:16px;box-shadow:var(--card-shadow);display:flex;align-items:center;gap:14px;cursor:pointer;" onclick="App.navigate('scratch_art')">
          <div style="font-size:44px;background:rgba(255,255,255,0.18);width:72px;height:72px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">🌈</div>
          <div style="flex:1;">
            <div style="font-size:19px;font-weight:900;margin-bottom:3px;">Magic Rainbow Scratch Art</div>
            <div style="font-size:13px;font-weight:700;opacity:0.92;">Scratch away dark velvet to reveal glowing rainbow holiday art!</div>
          </div>
          <span style="font-size:22px;font-weight:900;">›</span>
        </div>

        <div style="background:linear-gradient(135deg,#E11D48 0%,#BE123C 100%);color:#FFF;border-radius:22px;padding:16px;box-shadow:var(--card-shadow);display:flex;align-items:center;gap:14px;cursor:pointer;" onclick="App.navigate('card_studio')">
          <div style="font-size:44px;background:rgba(255,255,255,0.18);width:72px;height:72px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">💌</div>
          <div style="flex:1;">
            <div style="font-size:19px;font-weight:900;margin-bottom:3px;">Christmas Greeting Card Studio</div>
            <div style="font-size:13px;font-weight:700;opacity:0.92;">Frame your artwork, add To/From names & share holiday cards!</div>
          </div>
          <span style="font-size:22px;font-weight:900;">›</span>
        </div>

        <div style="background:linear-gradient(135deg,#D97706 0%,#B45309 100%);color:#FFF;border-radius:22px;padding:16px;box-shadow:var(--card-shadow);display:flex;align-items:center;gap:14px;cursor:pointer;" onclick="App.navigate('achievements')">
          <div style="font-size:44px;background:rgba(255,255,255,0.18);width:72px;height:72px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">🏆</div>
          <div style="flex:1;">
            <div style="font-size:19px;font-weight:900;margin-bottom:3px;">Christmas Trophy Room</div>
            <div style="font-size:13px;font-weight:700;opacity:0.92;">${stats.badgesUnlocked} of ${stats.badgesTotal} Holiday Badges Unlocked!</div>
          </div>
          <span style="font-size:22px;font-weight:900;">›</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
          <button class="action-card yellow" style="min-height:80px;padding:12px;" onclick="App.navigate('artwork')">
            <span style="font-size:26px;">🖼️</span>
            <span class="action-card-title">My Saved Artwork (${stats.totalSaved})</span>
          </button>
          <button class="action-card purple" style="min-height:80px;padding:12px;" onclick="App.navigate('favorites')">
            <span style="font-size:26px;">❤️</span>
            <span class="action-card-title">My Favorites (${store.favorites.length})</span>
          </button>
        </div>

        <div class="winter-footer-wrap" style="margin-top:auto;">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  // ============================================================================
  // NEW MODE 1: 💌 CHRISTMAS GREETING CARD STUDIO
  // ============================================================================
  function openCardStudioForDrawing(drawingId) {
    nav.cardDrawingId = drawingId || "drawing_001";
    navigate("card_studio");
  }

  function renderGreetingCardStudio(host) {
    const allDrawings = getCatalog().drawings.slice(0, 24);
    const savedIds = Object.keys(store.artworks);
    const selectableIds = Array.from(new Set([...savedIds, ...allDrawings.map((x) => x.id)])).slice(0, 16);

    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">💌 Holiday Card Maker</h1>
        </div>
      </div>

      <div class="page-body">
        <!-- Live High-DPI Greeting Card Canvas -->
        <div style="display:flex;justify-content:center;">
          <canvas id="greeting-card-canvas" width="600" height="760"
            style="width:100%;max-width:320px;height:auto;border-radius:18px;box-shadow:0 10px 28px rgba(0,0,0,0.18);"></canvas>
        </div>

        <!-- Card Border Frame Picker -->
        <div>
          <div style="font-weight:900;font-size:13.5px;margin-bottom:6px;">1. Choose Holiday Frame:</div>
          <div class="chip-row">
            ${CARD_FRAMES.map(
              (f) => `
              <button class="filter-chip ${nav.cardFrameId === f.id ? "active" : ""}" onclick="App.setCardFrame('${f.id}')">
                ${f.name}
              </button>
            `
            ).join("")}
          </div>
        </div>

        <!-- Pick Artwork for Card -->
        <div>
          <div style="font-weight:900;font-size:13.5px;margin-bottom:6px;">2. Choose Artwork:</div>
          <div class="chip-row">
            ${selectableIds
              .map((id) => {
                const d = getDrawingById(id);
                return `
                  <button class="filter-chip ${nav.cardDrawingId === id ? "active" : ""}" onclick="App.setCardDrawing('${id}')">
                    ${store.artworks[id] ? "🎨 " : ""}${d.title}
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <!-- Custom Message Inputs -->
        <div style="background:#FFFFFF;border-radius:18px;padding:12px;box-shadow:var(--card-shadow);display:flex;flex-direction:column;gap:8px;">
          <div style="font-weight:900;font-size:13.5px;">3. Personalize Greeting:</div>
          <div class="chip-row">
            ${["Merry Christmas!", "Happy Holidays!", "Season's Greetings!", "Joy to the World!"].map(
              (msg) => `
              <button class="filter-chip ${nav.cardHeadline === msg ? "active" : ""}" onclick="App.setCardHeadline('${msg.replace(/'/g, "\\'")}')">${msg}</button>
            `
            ).join("")}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="font-size:11.5px;font-weight:800;color:#566B60;">To:</label>
              <input type="text" value="${nav.cardTo.replace(/"/g, "&quot;")}" maxlength="22"
                oninput="App.updateCardText('to', this.value)"
                style="width:100%;padding:8px 10px;border-radius:10px;border:1.5px solid #D5E2DA;font-weight:800;font-size:13.5px;" />
            </div>
            <div>
              <label style="font-size:11.5px;font-weight:800;color:#566B60;">From:</label>
              <input type="text" value="${nav.cardFrom.replace(/"/g, "&quot;")}" maxlength="22"
                oninput="App.updateCardText('from', this.value)"
                style="width:100%;padding:8px 10px;border-radius:10px;border:1.5px solid #D5E2DA;font-weight:800;font-size:13.5px;" />
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <button class="btn-primary green" onclick="App.saveOrShareGreetingCard('share')">
            📤 Share Card
          </button>
          <button class="btn-primary" onclick="App.saveOrShareGreetingCard('save')">
            💾 Save Card
          </button>
        </div>
      </div>
    `;

    drawGreetingCardCanvas();
  }

  function setCardFrame(frameId) {
    nav.cardFrameId = frameId;
    playPopSound(600, 0.05);
    renderCurrentScreen();
  }

  function setCardDrawing(drawingId) {
    nav.cardDrawingId = drawingId;
    playPopSound(620, 0.05);
    renderCurrentScreen();
  }

  function setCardHeadline(msg) {
    nav.cardHeadline = msg;
    playPopSound(640, 0.05);
    renderCurrentScreen();
  }

  function updateCardText(field, val) {
    if (field === "to") nav.cardTo = val;
    if (field === "from") nav.cardFrom = val;
    drawGreetingCardCanvas();
  }

  async function drawGreetingCardCanvas() {
    const canvas = document.getElementById("greeting-card-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const frame = CARD_FRAMES.find((f) => f.id === nav.cardFrameId) || CARD_FRAMES[0];

    // Outer Ornate Border
    ctx.fillStyle = frame.border;
    ctx.fillRect(0, 0, 600, 760);

    // Decorative Candy Cane Stripes if candy_stripe
    if (frame.id === "candy_stripe") {
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      for (let i = -760; i < 600; i += 48) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 24, 0);
        ctx.lineTo(i + 24 + 760, 760);
        ctx.lineTo(i + 760, 760);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // Gold inner trim
    ctx.fillStyle = frame.accent;
    ctx.fillRect(22, 22, 556, 716);

    // Card Cream Interior
    ctx.fillStyle = frame.innerBg;
    ctx.fillRect(30, 30, 540, 700);

    // Corner Festive Ornaments
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎄", 58, 58);
    ctx.fillText("🎄", 542, 58);
    ctx.fillText("❄️", 58, 702);
    ctx.fillText("❄️", 542, 702);

    // Top Headline
    ctx.fillStyle = frame.textCol;
    ctx.font = "900 36px -apple-system, 'SF Pro Rounded', 'Georgia', serif";
    ctx.fillText(nav.cardHeadline || "Merry Christmas!", 300, 82);

    // Artwork Frame Box
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = frame.accent;
    ctx.lineWidth = 4;
    ctx.fillRect(75, 118, 450, 450);
    ctx.strokeRect(75, 118, 450, 450);

    // Render Selected Colored Artwork into Box
    const artDataUrl = await ensureArtworkPng(nav.cardDrawingId);
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 85, 128, 430, 430);
        resolve();
      };
      img.onerror = resolve;
      img.src = artDataUrl;
    });

    // Bottom To / From Ribbon Banner
    ctx.fillStyle = frame.textCol;
    ctx.font = "800 23px -apple-system, 'SF Pro Rounded', sans-serif";
    ctx.fillText(`To: ${nav.cardTo || "Family"}   •   From: ${nav.cardFrom || "Me"}`, 300, 622);

    ctx.fillStyle = "#6B7280";
    ctx.font = "700 15px -apple-system, sans-serif";
    ctx.fillText("✨ Created with Christmas Coloring Studio Pro ✨", 300, 682);
  }

  async function saveOrShareGreetingCard(action) {
    await drawGreetingCardCanvas();
    const canvas = document.getElementById("greeting-card-canvas");
    if (!canvas) return;
    recordAchievementEvent("card_created");
    const dataUrl = canvas.toDataURL("image/png");

    if (action === "share") {
      if (!store.settings.allowSharing) {
        showToast("Sharing is disabled in Parent Controls.");
        return;
      }
      requireParentGate("Share Greeting Card", async () => {
        await triggerNativeShareOrDownload(dataUrl, "Christmas_Greeting_Card.png", "Merry Christmas Greeting Card!");
      });
    } else {
      triggerDownloadDataUrl(dataUrl, "Christmas_Greeting_Card.png");
      showToast("💌 Christmas Card Saved ✓");
    }
  }

  // ============================================================================
  // NEW MODE 2: 🌈 MAGIC RAINBOW SCRATCH ART STUDIO
  // ============================================================================
  function renderScratchArtStudio(host) {
    const sampleDrawings = getCatalog().drawings.slice(0, 15);
    const activeD = getDrawingById(nav.scratchDrawingId);

    host.innerHTML = `
      <div class="editor-layout" style="background:#0F172A;">
        <div class="top-bar royal-bar">
          <div class="top-bar-left">
            <button class="icon-btn" onclick="App.goBack()">←</button>
            <h1 class="top-bar-title">🌈 Magic Scratch Art</h1>
          </div>
          <div class="top-bar-actions">
            <button class="icon-btn" onclick="App.revealAllScratchArt()" title="Magic Reveal">✨</button>
            <button class="icon-btn" onclick="App.resetScratchArtCoat()" title="Fresh Scratch Coat">🔄</button>
            <button class="icon-btn" onclick="App.saveScratchArtPng()" title="Save Scratch Art">💾</button>
          </div>
        </div>

        <div class="canvas-viewport" style="background:radial-gradient(circle,#1E1B4B 0%,#0F172A 100%);flex-direction:column;padding:10px;">
          <div style="color:#E0E7FF;font-size:13px;font-weight:800;margin-bottom:6px;text-align:center;">
            ✨ Drag your finger or Apple Pencil to scratch off the dark velvet!
          </div>
          <div id="scratch-stage-box" style="position:relative;width:100%;max-width:410px;aspect-ratio:1/1;border-radius:22px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.5);border:3px solid #6366F1;">
            <canvas id="scratch-rainbow-underlay" width="600" height="600" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
            <canvas id="scratch-velvet-overlay" width="600" height="600" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair;"></canvas>
          </div>
        </div>

        <div class="editor-bottom-dock" style="background:#1E293B;border-top-color:#334155;color:#FFF;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:12.5px;font-weight:800;white-space:nowrap;">Scratch Size:</span>
            <input type="range" min="14" max="55" value="${nav.scratchBrushSize}"
              style="flex:1;accent-color:#A855F7;"
              oninput="App.setScratchBrushSize(this.value)" />
          </div>
          <div class="chip-row">
            ${sampleDrawings
              .map(
                (d) => `
              <button class="filter-chip ${d.id === activeD.id ? "active" : ""}" onclick="App.selectScratchDrawing('${d.id}')">
                ${d.title}
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    initScratchArtCanvases(activeD);
  }

  function setScratchBrushSize(val) {
    nav.scratchBrushSize = Number(val) || 28;
  }

  function selectScratchDrawing(id) {
    nav.scratchDrawingId = id;
    playPopSound(620, 0.05);
    renderCurrentScreen();
  }

  function initScratchArtCanvases(drawing) {
    const underCanvas = document.getElementById("scratch-rainbow-underlay");
    const overCanvas = document.getElementById("scratch-velvet-overlay");
    if (!underCanvas || !overCanvas) return;

    const uCtx = underCanvas.getContext("2d");
    const oCtx = overCanvas.getContext("2d");

    // 1. Paint glowing diagonal rainbow foil gradient on underlay + drawing line art
    const grad = uCtx.createLinearGradient(0, 0, 600, 600);
    grad.addColorStop(0, "#FF2E93");
    grad.addColorStop(0.2, "#FF8A00");
    grad.addColorStop(0.4, "#FFE600");
    grad.addColorStop(0.6, "#00F5A0");
    grad.addColorStop(0.8, "#00D9F5");
    grad.addColorStop(1, "#A855F7");
    uCtx.fillStyle = grad;
    uCtx.fillRect(0, 0, 600, 600);

    // Overlay the SVG line art in deep contrasting midnight ink
    const rawSvg = window.CHRISTMAS_SVG_LIBRARY[drawing.id] || "";
    const transparentSvg = rawSvg
      .replace(/fill="#[0-9A-Fa-f]{3,6}"/g, 'fill="none"')
      .replace(/fill="#111111"/g, 'fill="#111111"')
      .replace(/fill="#181818"/g, 'fill="#181818"');

    const img = new Image();
    const blob = new Blob([transparentSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      uCtx.drawImage(img, 0, 0, 600, 600);
      URL.revokeObjectURL(url);
    };
    img.src = url;

    // 2. Paint dark midnight velvet scratch coat on overlay canvas + faint guide lines
    paintFreshVelvetCoat(oCtx, transparentSvg);

    // 3. Bind pointer scratch events
    let scratching = false;
    let lastPt = null;
    let scratchMoves = 0;

    const getPt = (e) => {
      const rect = overCanvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 600,
        y: ((e.clientY - rect.top) / rect.height) * 600
      };
    };

    const scratchAt = (pt) => {
      oCtx.save();
      oCtx.globalCompositeOperation = "destination-out";
      oCtx.lineCap = "round";
      oCtx.lineJoin = "round";
      oCtx.lineWidth = nav.scratchBrushSize;
      oCtx.beginPath();
      if (lastPt) {
        oCtx.moveTo(lastPt.x, lastPt.y);
        oCtx.lineTo(pt.x, pt.y);
      } else {
        oCtx.moveTo(pt.x, pt.y);
        oCtx.lineTo(pt.x + 0.1, pt.y + 0.1);
      }
      oCtx.stroke();
      oCtx.restore();
      lastPt = pt;
      scratchMoves++;
      if (scratchMoves === 15) {
        recordAchievementEvent("scratch_art");
      }
      if (scratchMoves % 14 === 0 && window.FestiveAudio) {
        window.FestiveAudio.playGlitterSparkle();
      }
    };

    overCanvas.addEventListener("pointerdown", (e) => {
      scratching = true;
      lastPt = null;
      scratchAt(getPt(e));
    });

    overCanvas.addEventListener("pointermove", (e) => {
      if (!scratching) return;
      scratchAt(getPt(e));
    });

    const stopScratch = () => {
      scratching = false;
      lastPt = null;
    };
    overCanvas.addEventListener("pointerup", stopScratch);
    overCanvas.addEventListener("pointercancel", stopScratch);
  }

  function paintFreshVelvetCoat(oCtx, guideSvgStr) {
    oCtx.globalCompositeOperation = "source-over";
    const coatGrad = oCtx.createLinearGradient(0, 0, 0, 600);
    coatGrad.addColorStop(0, "#1E1B4B");
    coatGrad.addColorStop(1, "#0F172A");
    oCtx.fillStyle = coatGrad;
    oCtx.fillRect(0, 0, 600, 600);

    // Sprinkle subtle silver stars on the scratch coat
    oCtx.fillStyle = "rgba(255,255,255,0.22)";
    for (let i = 0; i < 45; i++) {
      const sx = (i * 137) % 580 + 10;
      const sy = (i * 251) % 580 + 10;
      oCtx.beginPath();
      oCtx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
      oCtx.fill();
    }

    // Faint silver guide outline on top of velvet so kids know where to scratch
    if (guideSvgStr) {
      const silverSvg = guideSvgStr
        .replace(/stroke="#[0-9A-Fa-f]{3,6}"/g, 'stroke="#6366F1"')
        .replace(/stroke-width="[0-9.]+"/g, 'stroke-width="2"');
      const img = new Image();
      const blob = new Blob([silverSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        oCtx.save();
        oCtx.globalAlpha = 0.35;
        oCtx.drawImage(img, 0, 0, 600, 600);
        oCtx.restore();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }

  function revealAllScratchArt() {
    const overCanvas = document.getElementById("scratch-velvet-overlay");
    if (!overCanvas) return;
    const oCtx = overCanvas.getContext("2d");
    oCtx.clearRect(0, 0, 600, 600);
    recordAchievementEvent("scratch_art");
    playChimeSound();
    showToast("✨ Magic Rainbow Art Revealed!");
  }

  function resetScratchArtCoat() {
    renderCurrentScreen();
    showToast("Fresh Velvet Scratch Coat Ready!");
  }

  function saveScratchArtPng() {
    const underCanvas = document.getElementById("scratch-rainbow-underlay");
    const overCanvas = document.getElementById("scratch-velvet-overlay");
    if (!underCanvas || !overCanvas) return;
    const merged = document.createElement("canvas");
    merged.width = 600;
    merged.height = 600;
    const mCtx = merged.getContext("2d");
    mCtx.drawImage(underCanvas, 0, 0);
    mCtx.drawImage(overCanvas, 0, 0);
    triggerDownloadDataUrl(merged.toDataURL("image/png"), "Magic_Scratch_Art.png");
    showToast("🌈 Scratch Art Saved ✓");
  }

  // ============================================================================
  // NEW MODE 3: 🏆 ROYAL CHRISTMAS TROPHY ROOM & STICKER BADGES
  // ============================================================================
  function renderAchievementsScreen(host) {
    const unlockedCount = store.unlockedBadges.length;
    const totalCount = ACHIEVEMENT_BADGES.length;
    const pct = Math.round((unlockedCount / totalCount) * 100);

    host.innerHTML = `
      <div class="top-bar royal-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">🏆 Trophy Room</h1>
        </div>
      </div>

      <div class="page-body">
        <div style="background:linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%);border-radius:20px;padding:16px;border:2px solid #F59E0B;box-shadow:var(--card-shadow);text-align:center;">
          <div style="font-size:38px;margin-bottom:4px;">👑</div>
          <div style="font-size:20px;font-weight:900;color:#78350F;">${unlockedCount} of ${totalCount} Badges Earned</div>
          <div style="font-size:13px;font-weight:800;color:#92400E;margin-bottom:10px;">Keep coloring and exploring Pro tools to collect them all!</div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,#D97706,#F59E0B);"></div>
          </div>
        </div>

        <div class="badges-grid">
          ${ACHIEVEMENT_BADGES.map((b) => {
            const isUnlocked = store.unlockedBadges.includes(b.id);
            return `
              <div class="badge-card ${isUnlocked ? "unlocked" : "locked"}">
                <div style="font-size:36px;">${b.icon}</div>
                <div style="font-weight:900;font-size:14.5px;color:#161E19;">${b.title}</div>
                <div style="font-size:11.5px;font-weight:700;color:#566B60;">${b.desc}</div>
                <span style="margin-top:4px;font-size:10.5px;font-weight:900;padding:2px 10px;border-radius:99px;background:${isUnlocked ? "#1B8730" : "#E5E7EB"};color:${isUnlocked ? "#FFF" : "#6B7280"};">
                  ${isUnlocked ? "✓ UNLOCKED" : "🔒 LOCKED"}
                </span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  // ============================================================================
  // CORE GALLERY, DETAIL, AND UPGRADED PRO COLORING EDITOR
  // ============================================================================
  function renderDrawingCardHtml(d) {
    const fav = isFavorite(d.id);
    const saved = store.artworks[d.id];
    const svgDisplay = saved
      ? window.ColoringEngine.buildColoredSvgMarkup(d.id, saved)
      : window.CHRISTMAS_SVG_LIBRARY[d.id];

    let badge = "";
    if (saved?.status === "completed") {
      badge = `<span class="status-pill completed">Completed</span>`;
    } else if (saved?.status === "in-progress") {
      badge = `<span class="status-pill in-progress">Unfinished</span>`;
    }

    return `
      <div class="drawing-card" onclick="App.openDrawingDetail('${d.id}')">
        <div class="drawing-preview-box">
          ${svgDisplay}
          <button class="fav-badge-btn" onclick="App.toggleFavorite('${d.id}', event)" aria-label="Favorite">
            ${fav ? "❤️" : "♡"}
          </button>
          ${badge}
        </div>
        <div class="drawing-card-title">${saved?.customTitle || d.title}</div>
      </div>
    `;
  }

  function renderCategoryGallery(host) {
    const cats = getCatalog().categories;
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Categories</h1>
        </div>
        <div class="top-bar-actions">
          <button class="icon-btn" onclick="App.navigate('gallery', {selectedCategory:'all'})" title="Search">🔍</button>
        </div>
      </div>
      <div class="page-body">
        <div class="categories-grid-full">
          ${cats
            .map(
              (c) => `
            <div class="category-card" style="background:${c.bg};" onclick="App.openCategory('${c.id}')">
              <div class="category-thumb">
                ${getCategoryArtHtml(c)}
              </div>
              <div class="category-card-name">${c.name}</div>
              <div class="category-card-count">${c.count} Pages</div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="winter-footer-wrap">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  function openCategory(catId) {
    navigate("gallery", { selectedCategory: catId, selectedDifficulty: "all", searchQuery: "" });
  }

  function renderDifficultySelection(host) {
    const stats = getProgressStats();
    const pct = Math.max(4, Math.round((stats.totalDone / 300) * 100));
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Choose Level</h1>
        </div>
      </div>
      <div class="page-body">
        <div class="level-card easy" onclick="App.openDifficulty('easy')">
          <div class="level-avatar-svg">${window.UltraHdArt?.LEVEL_KIDS?.easy || ""}</div>
          <div class="level-info">
            <h3>Easy</h3>
            <p>Ages 3–5</p>
            <p>(100 Pages)</p>
          </div>
        </div>

        <div class="level-card medium" onclick="App.openDifficulty('medium')">
          <div class="level-avatar-svg">${window.UltraHdArt?.LEVEL_KIDS?.medium || ""}</div>
          <div class="level-info">
            <h3>Medium</h3>
            <p>Ages 6–8</p>
            <p>(100 Pages)</p>
          </div>
        </div>

        <div class="level-card advanced" onclick="App.openDifficulty('advanced')">
          <div class="level-avatar-svg">${window.UltraHdArt?.LEVEL_KIDS?.advanced || ""}</div>
          <div class="level-info">
            <h3>Advanced</h3>
            <p>Ages 9+</p>
            <p>(100 Pages)</p>
          </div>
        </div>

        <div style="background:#FFFFFF;border-radius:20px;padding:15px 18px;box-shadow:var(--card-shadow);cursor:pointer;" onclick="App.navigate('progress')">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div>
              <div style="font-weight:900;font-size:16px;">Your Progress & Trophies</div>
              <div style="font-size:13px;font-weight:800;color:#566B60;">${stats.totalDone} of 300 Pages • ${stats.badgesUnlocked} Badges</div>
            </div>
            <span style="font-size:32px;">🏆</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${pct}%;"></div>
          </div>
        </div>
      </div>
    `;
  }

  function openDifficulty(diff) {
    navigate("gallery", { selectedDifficulty: diff, selectedCategory: "all", searchQuery: "" });
  }

  function renderColoringGallery(host) {
    const allDrawings = getCatalog().drawings;
    const cats = getCatalog().categories;
    const currentCatObj = cats.find((c) => c.id === nav.selectedCategory);
    const headerTitle = currentCatObj ? currentCatObj.name : "All Coloring Pages";

    const filtered = allDrawings.filter((d) => {
      if (nav.selectedCategory !== "all" && d.categoryId !== nav.selectedCategory) return false;
      if (nav.selectedDifficulty !== "all" && d.difficulty !== nav.selectedDifficulty) return false;
      if (nav.searchQuery.trim()) {
        const q = nav.searchQuery.toLowerCase();
        return d.title.toLowerCase().includes(q) || d.categoryName.toLowerCase().includes(q);
      }
      return true;
    });

    const easyCount = allDrawings.filter((d) => (nav.selectedCategory === "all" || d.categoryId === nav.selectedCategory) && d.difficulty === "easy").length;
    const medCount = allDrawings.filter((d) => (nav.selectedCategory === "all" || d.categoryId === nav.selectedCategory) && d.difficulty === "medium").length;
    const advCount = allDrawings.filter((d) => (nav.selectedCategory === "all" || d.categoryId === nav.selectedCategory) && d.difficulty === "advanced").length;
    const totalCatCount = easyCount + medCount + advCount;

    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">${headerTitle}</h1>
        </div>
      </div>

      <div class="page-body">
        <div class="search-box">
          <input type="text" id="gallery-search-input" placeholder="Search coloring pages..." value="${nav.searchQuery}" oninput="App.onGallerySearch(this.value)" />
          <span>🔍</span>
        </div>

        <div class="chip-row">
          <button class="filter-chip ${nav.selectedDifficulty === "all" ? "active" : ""}" onclick="App.setGalleryDiff('all')">All (${totalCatCount})</button>
          <button class="filter-chip ${nav.selectedDifficulty === "easy" ? "active" : ""}" onclick="App.setGalleryDiff('easy')">Easy (${easyCount})</button>
          <button class="filter-chip ${nav.selectedDifficulty === "medium" ? "active" : ""}" onclick="App.setGalleryDiff('medium')">Medium (${medCount})</button>
          <button class="filter-chip ${nav.selectedDifficulty === "advanced" ? "active" : ""}" onclick="App.setGalleryDiff('advanced')">Advanced (${advCount})</button>
        </div>

        ${
          filtered.length === 0
            ? renderEmptyStateHtml(
                "🔍",
                "No Matching Drawings",
                "Try another search or category.",
                "Show All 300",
                "App.resetGalleryFilters()"
              )
            : `<div class="drawings-grid">
                ${filtered.map((d) => renderDrawingCardHtml(d)).join("")}
               </div>`
        }
      </div>
    `;
  }

  function onGallerySearch(val) {
    nav.searchQuery = val;
    renderColoringGallery(document.getElementById("screen-container"));
    const input = document.getElementById("gallery-search-input");
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  }

  function setGalleryDiff(diff) {
    nav.selectedDifficulty = diff;
    renderCurrentScreen();
  }

  function setGalleryCat(catId) {
    nav.selectedCategory = catId;
    renderCurrentScreen();
  }

  function resetGalleryFilters() {
    nav.selectedCategory = "all";
    nav.selectedDifficulty = "all";
    nav.searchQuery = "";
    renderCurrentScreen();
  }

  function openDrawingDetail(drawingId) {
    navigate("detail", { activeDrawingId: drawingId });
  }

  function renderDrawingDetail(host) {
    const d = getDrawingById(nav.activeDrawingId);
    const fav = isFavorite(d.id);
    const previewSvg = window.CHRISTMAS_SVG_LIBRARY[d.id];

    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Template Detail</h1>
        </div>
      </div>

      <div class="page-body" style="align-items:center;text-align:center;">
        <div style="width:100%;aspect-ratio:1/1;background:#FFFFFF;border-radius:22px;padding:12px;box-shadow:var(--card-shadow);border:2px solid #EAEAEA;position:relative;">
          ${previewSvg}
          <button class="fav-badge-btn" style="width:36px;height:36px;font-size:20px;top:10px;right:10px;" onclick="App.toggleFavorite('${d.id}')">
            ${fav ? "❤️" : "♡"}
          </button>
        </div>

        <div>
          <h2 style="margin:2px 0 8px;font-size:23px;font-weight:900;">${d.title}</h2>
          <div style="display:flex;gap:8px;justify-content:center;align-items:center;">
            <span style="background:#FFF0B3;color:#7A5200;padding:4px 14px;border-radius:99px;font-size:13px;font-weight:800;text-transform:capitalize;">${d.difficulty}</span>
            <span style="background:#EFEFEF;color:#333;padding:4px 14px;border-radius:99px;font-size:13px;font-weight:800;">${d.recommendedAge}</span>
          </div>
        </div>

        <button class="btn-primary" onclick="App.startColoring('${d.id}')">
          🎨 Color in Pro Studio
        </button>

        <div style="display:flex;gap:10px;width:100%;">
          <button class="btn-secondary" style="flex:1;" onclick="App.selectScratchFromDetail('${d.id}')">
            🌈 Scratch Art
          </button>
          <button class="btn-secondary" style="flex:1;" onclick="App.printSingleBlankPage('${d.id}')">
            🖨️ Print PDF
          </button>
        </div>
      </div>
    `;
  }

  function selectScratchFromDetail(drawingId) {
    nav.scratchDrawingId = drawingId;
    navigate("scratch_art");
  }

  function startColoring(drawingId) {
    recordRecentOpen(drawingId);
    navigate("editor", { activeDrawingId: drawingId });
  }

  // --- Screen 7: Upgraded Pro Coloring Studio Editor ---
  function renderColoringEditor(host) {
    const d = getDrawingById(nav.activeDrawingId);
    const saved = store.artworks[d.id];
    const presets = window.ColoringEngine.PRESET_COLORS.slice(0, 14);
    const patterns = window.ColoringEngine.FESTIVE_PATTERNS;
    const stickers = window.ColoringEngine.HOLIDAY_STICKERS;

    host.innerHTML = `
      <div class="editor-layout">
        <div class="top-bar">
          <div class="top-bar-left">
            <button class="icon-btn" onclick="App.saveAndExitEditor()" title="Back">←</button>
            <h1 class="top-bar-title">Studio</h1>
          </div>
          <div class="top-bar-actions">
            <button class="icon-btn" onclick="App.toggleMusicQuick()" title="Music">${store.settings.music ? "🎵" : "🔇"}</button>
            <button class="icon-btn" id="btn-undo" onclick="ColoringEngine.undo()" title="Undo" disabled>↶</button>
            <button class="icon-btn" id="btn-redo" onclick="ColoringEngine.redo()" title="Redo" disabled>↷</button>
            <button class="icon-btn" onclick="App.finishDrawing()" title="Save Artwork">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="canvas-viewport" id="editor-canvas-viewport"></div>

        <!-- Pro Bottom Dock: Contextual Pattern/Sticker Strip + 14 Colors + 8 Studio Tools -->
        <div class="editor-bottom-dock">
          <!-- Contextual Pattern Picker Strip (Visible when Pattern tool is selected) -->
          <div id="context-bar-pattern" class="pro-context-bar hidden">
            ${patterns
              .map(
                (p) => `
              <button class="pattern-pill-btn" data-pattern="${p.id}" onclick="ColoringEngine.setPattern('${p.id}')">
                <span>${p.icon}</span>
                <span>${p.name}</span>
              </button>
            `
              )
              .join("")}
          </div>

          <!-- Contextual Sticker Picker Strip (Visible when Sticker tool is selected) -->
          <div id="context-bar-sticker" class="pro-context-bar hidden">
            ${stickers
              .map(
                (s) => `
              <button class="sticker-pill-btn" data-sticker="${s.id}" onclick="ColoringEngine.setSticker('${s.id}')" title="${s.label}">
                ${s.emoji}
              </button>
            `
              )
              .join("")}
          </div>

          <!-- 14-Color Two-Row Palette Card -->
          <div class="palette-strip" id="editor-palette-strip">
            ${presets
              .map(
                (hex) => `
              <button class="color-swatch" data-color="${hex}" style="background:${hex};" onclick="ColoringEngine.setColor('${hex}')"></button>
            `
              )
              .join("")}
          </div>

          <!-- 8-Tool Pro Studio Row -->
          <div class="tools-dock-row">
            <button class="tool-btn active" id="tool-btn-fill" onclick="ColoringEngine.setTool('fill')">
              <span class="tool-emoji">🪣</span>
              <span>Fill</span>
            </button>
            <button class="tool-btn" id="tool-btn-brush" onclick="ColoringEngine.setTool('brush')">
              <span class="tool-emoji">🖌️</span>
              <span>Brush</span>
            </button>
            <button class="tool-btn" id="tool-btn-glitter" onclick="ColoringEngine.setTool('glitter')">
              <span class="tool-emoji">✨</span>
              <span>Glitter</span>
            </button>
            <button class="tool-btn" id="tool-btn-neon" onclick="ColoringEngine.setTool('neon')">
              <span class="tool-emoji">🌟</span>
              <span>Neon</span>
            </button>
            <button class="tool-btn" id="tool-btn-pattern" onclick="ColoringEngine.setTool('pattern')">
              <span class="tool-emoji">🧣</span>
              <span>Pattern</span>
            </button>
            <button class="tool-btn" id="tool-btn-sticker" onclick="ColoringEngine.setTool('sticker')">
              <span class="tool-emoji">🎅</span>
              <span>Sticker</span>
            </button>
            <button class="tool-btn" id="tool-btn-eraser" onclick="ColoringEngine.setTool('eraser')">
              <span class="tool-emoji">🧽</span>
              <span>Eraser</span>
            </button>
            <button class="tool-btn" id="tool-btn-size" onclick="App.openPaletteAndBrushModal()">
              <span class="tool-emoji">🎨</span>
              <span>More</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const viewport = document.getElementById("editor-canvas-viewport");
    window.ColoringEngine.init(viewport, d, saved, (summary) => {
      syncEditorToolbar(summary);
      autoSaveProgress(d.id, summary);
    });
  }

  function syncEditorToolbar(summary) {
    const undoBtn = document.getElementById("btn-undo");
    const redoBtn = document.getElementById("btn-redo");
    if (undoBtn) undoBtn.disabled = !summary.canUndo;
    if (redoBtn) redoBtn.disabled = !summary.canRedo;

    ["fill", "brush", "glitter", "neon", "pattern", "sticker", "eraser"].forEach((t) => {
      const btn = document.getElementById(`tool-btn-${t}`);
      if (btn) btn.classList.toggle("active", summary.tool === t);
    });

    const patBar = document.getElementById("context-bar-pattern");
    const stkBar = document.getElementById("context-bar-sticker");
    if (patBar) {
      patBar.classList.toggle("hidden", summary.tool !== "pattern");
      patBar.querySelectorAll(".pattern-pill-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-pattern") === summary.activePattern);
      });
    }
    if (stkBar) {
      stkBar.classList.toggle("hidden", summary.tool !== "sticker");
      stkBar.querySelectorAll(".sticker-pill-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-sticker") === summary.activeSticker);
      });
    }

    document.querySelectorAll("#editor-palette-strip .color-swatch").forEach((sw) => {
      const hex = sw.getAttribute("data-color");
      sw.classList.toggle("active", hex.toUpperCase() === summary.color.toUpperCase());
    });
  }

  function autoSaveProgress(drawingId, summary) {
    if (summary.filledCount === 0 && summary.strokeCount === 0) return;
    const existing = store.artworks[drawingId] || {};
    store.artworks[drawingId] = {
      drawingId,
      customTitle: existing.customTitle || getDrawingById(drawingId).title,
      status: existing.status === "completed" ? "completed" : "in-progress",
      regionFills: summary.regionFills,
      strokes: summary.strokes,
      updatedAt: Date.now(),
    };
    saveStore();
  }

  async function saveAndExitEditor() {
    const summary = window.ColoringEngine.getStateSummary();
    if (summary.filledCount > 0 || summary.strokeCount > 0) {
      autoSaveProgress(summary.drawingId, summary);
    }
    goBack();
  }

  async function finishDrawing() {
    playChimeSound();
    const summary = window.ColoringEngine.getStateSummary();
    const d = getDrawingById(summary.drawingId);
    const pngDataUrl = await window.ColoringEngine.exportCompositePng(900);
    const existing = store.artworks[d.id] || {};
    store.artworks[d.id] = {
      drawingId: d.id,
      customTitle: existing.customTitle || d.title,
      status: "completed",
      regionFills: summary.regionFills,
      strokes: summary.strokes,
      pngDataUrl,
      updatedAt: Date.now(),
    };
    saveStore();

    // Check completion achievements
    unlockBadge("first_complete");
    const stats = getProgressStats();
    if (stats.totalDone >= 5) unlockBadge("five_completed");
    if (stats.totalDone >= 10) unlockBadge("ten_completed");

    showToast("Masterpiece Saved ✓");
    navigate("artwork_detail", { activeDrawingId: d.id }, false);
  }

  function confirmResetDrawing() {
    window.ColoringEngine.resetDrawing();
    showToast("Canvas cleared");
  }

  // --- Screen 8: Color & Brush Controls Modal ---
  function openPaletteAndBrushModal() {
    const summary = window.ColoringEngine.getStateSummary();
    const allPresets = window.ColoringEngine.PRESET_COLORS;
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <div class="modal-card" style="text-align:left;">
        <button class="modal-close-btn" onclick="App.closeModal()">✕</button>
        <h3 style="margin:0 0 12px;font-size:19px;font-weight:900;color:#C8161D;">Studio Size & Color Palette</h3>

        <div style="margin-bottom:14px;">
          <div style="font-weight:800;font-size:14px;margin-bottom:6px;">
            Brush / Sticker Size: <span id="brush-size-val">${summary.brushSize}px</span>
          </div>
          <input type="range" min="4" max="48" value="${summary.brushSize}" style="width:100%;accent-color:#C8161D;"
            oninput="document.getElementById('brush-size-val').textContent=this.value+'px';ColoringEngine.setBrushSize(this.value)" />
        </div>

        <div style="margin-bottom:14px;">
          <div style="font-weight:800;font-size:14px;margin-bottom:8px;">28 Holiday Colors</div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">
            ${allPresets
              .map(
                (hex) => `
              <button class="color-swatch ${hex.toUpperCase() === summary.color.toUpperCase() ? "active" : ""}"
                style="background:${hex};"
                onclick="ColoringEngine.setColor('${hex}');App.closeModal();"></button>
            `
              )
              .join("")}
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;background:#F7FAF7;padding:10px 14px;border-radius:14px;margin-bottom:12px;">
          <span style="font-weight:800;font-size:14px;">Custom Color Wheel:</span>
          <input type="color" value="${summary.color}" style="width:52px;height:36px;border:none;background:none;cursor:pointer;"
            onchange="ColoringEngine.setColor(this.value);App.closeModal();" />
        </div>

        <div style="display:flex;gap:8px;">
          <button class="btn-secondary" style="flex:1;padding:10px;" onclick="ColoringEngine.setTool('pan');App.closeModal();">🔍 Pan / Zoom</button>
          <button class="btn-secondary" style="flex:1;padding:10px;color:#C8161D;" onclick="ColoringEngine.resetDrawing();App.closeModal();">🔄 Clear Page</button>
        </div>
      </div>
    `;
  }

  // --- Screen 9: My Artwork ---
  function renderMyArtworkScreen(host) {
    const allArt = Object.values(store.artworks).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const completedCount = allArt.filter((a) => a.status === "completed").length;
    const inProgCount = allArt.filter((a) => a.status === "in-progress").length;

    const filtered = allArt.filter((a) => {
      if (nav.artworkFilter === "completed") return a.status === "completed";
      if (nav.artworkFilter === "in-progress") return a.status === "in-progress";
      return true;
    });

    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">My Artwork</h1>
        </div>
        <div class="top-bar-actions">
          <button class="icon-btn" onclick="App.navigate('recent')" title="Recently Colored">🕒</button>
        </div>
      </div>

      <div class="page-body">
        <div class="chip-row">
          <button class="filter-chip ${nav.artworkFilter === "all" ? "active" : ""}" onclick="App.setArtworkFilter('all')">All (${allArt.length})</button>
          <button class="filter-chip ${nav.artworkFilter === "completed" ? "active" : ""}" onclick="App.setArtworkFilter('completed')">Completed (${completedCount})</button>
          <button class="filter-chip ${nav.artworkFilter === "in-progress" ? "active" : ""}" onclick="App.setArtworkFilter('in-progress')">Unfinished (${inProgCount})</button>
        </div>

        ${
          filtered.length === 0
            ? renderEmptyStateHtml(
                "🖼️",
                "No Saved Artwork Yet",
                "Start coloring any page and it will appear here!",
                "Start Coloring",
                "App.navigate('levels')"
              )
            : `<div class="drawings-grid">
                ${filtered
                  .map((art) => {
                    const d = getDrawingById(art.drawingId);
                    const preview = art.pngDataUrl
                      ? `<img src="${art.pngDataUrl}" alt="${art.customTitle || d.title}" />`
                      : window.ColoringEngine.buildColoredSvgMarkup(d.id, art);
                    return `
                      <div class="drawing-card" onclick="App.navigate('artwork_detail', {activeDrawingId:'${d.id}'})">
                        <div class="drawing-preview-box">
                          ${preview}
                          <button class="fav-badge-btn" onclick="App.toggleFavorite('${d.id}', event)">❤️</button>
                          <span class="status-pill ${art.status}">${art.status === "completed" ? "Completed" : "Unfinished"}</span>
                        </div>
                        <div class="drawing-card-title">${art.customTitle || d.title}</div>
                      </div>
                    `;
                  })
                  .join("")}
               </div>`
        }
      </div>
    `;
  }

  function setArtworkFilter(f) {
    nav.artworkFilter = f;
    renderCurrentScreen();
  }

  function renderArtworkDetailScreen(host) {
    const d = getDrawingById(nav.activeDrawingId);
    const art = store.artworks[d.id];
    if (!art) {
      navigate("artwork", {}, false);
      return;
    }
    const preview = art.pngDataUrl
      ? `<img src="${art.pngDataUrl}" alt="${art.customTitle || d.title}" style="width:100%;height:100%;object-fit:contain;" />`
      : window.ColoringEngine.buildColoredSvgMarkup(d.id, art);

    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.navigate('artwork')">←</button>
          <h1 class="top-bar-title">My Artwork</h1>
        </div>
      </div>

      <div class="page-body" style="align-items:center;text-align:center;">
        <div style="width:100%;aspect-ratio:1.15/1;background:#D8F0FF;border-radius:20px;padding:10px;box-shadow:var(--card-shadow);border:2px solid #FFFFFF;">
          ${preview}
        </div>
        <h2 style="margin:4px 0;font-size:22px;font-weight:900;">${art.customTitle || d.title}</h2>

        <!-- Make Greeting Card CTA -->
        <button class="btn-primary gold" onclick="App.openCardStudioForDrawing('${d.id}')">
          💌 Turn Into Christmas Greeting Card
        </button>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;">
          <button class="action-card" style="background:#1B8730;color:#FFFFFF;min-height:74px;padding:10px;" onclick="App.startColoring('${d.id}')">
            <span style="font-size:22px;">🖍️</span>
            <span style="font-size:12.5px;font-weight:900;color:#FFFFFF;">Resume<br/>Coloring</span>
          </button>
          <button class="action-card blue" style="min-height:74px;padding:10px;" onclick="App.promptRenameArtwork('${d.id}')">
            <span style="font-size:22px;">✏️</span>
            <span style="font-size:13px;font-weight:900;">Rename</span>
          </button>
          <button class="action-card purple" style="min-height:74px;padding:10px;" onclick="App.exportArtworkPng('${d.id}')">
            <span style="font-size:22px;">💾</span>
            <span style="font-size:13px;font-weight:900;">Save PNG</span>
          </button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;">
          <button class="action-card yellow" style="min-height:64px;padding:10px;" onclick="App.shareSavedArtwork('${d.id}')">
            <span style="font-size:22px;">📤</span>
            <span style="font-size:14px;font-weight:900;">Share</span>
          </button>
          <button class="action-card pink" style="min-height:64px;padding:10px;" onclick="App.confirmDeleteArtwork('${d.id}')">
            <span style="font-size:22px;">🗑️</span>
            <span style="font-size:14px;font-weight:900;color:#B51B1B;">Delete</span>
          </button>
        </div>
      </div>
    `;
  }

  function promptRenameArtwork(drawingId) {
    const art = store.artworks[drawingId];
    if (!art) return;
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="margin:0 0 10px;font-size:20px;font-weight:900;">Rename Artwork</h3>
        <input id="rename-art-input" type="text" value="${(art.customTitle || "").replace(/"/g, "&quot;")}"
          style="width:100%;padding:12px;border-radius:12px;border:2px solid #CFE3D6;font-size:16px;font-weight:700;margin-bottom:14px;" />
        <div style="display:flex;gap:10px;">
          <button class="btn-secondary" style="flex:1;" onclick="App.closeModal()">Cancel</button>
          <button class="btn-primary green" style="flex:1;" onclick="App.saveRenamedArtwork('${drawingId}')">Save</button>
        </div>
      </div>
    `;
  }

  function saveRenamedArtwork(drawingId) {
    const inp = document.getElementById("rename-art-input");
    if (inp && store.artworks[drawingId]) {
      store.artworks[drawingId].customTitle = inp.value.trim() || getDrawingById(drawingId).title;
      saveStore();
      showToast("Artwork renamed ✓");
    }
    closeModal();
    renderCurrentScreen();
  }

  function confirmDeleteArtwork(drawingId) {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="margin:0 0 8px;font-size:20px;font-weight:900;">Delete Saved Artwork?</h3>
        <p style="margin:0 0 16px;font-size:14px;color:#566B60;font-weight:700;">
          Are you sure you want to delete this colored artwork?
        </p>
        <div style="display:flex;gap:10px;">
          <button class="btn-secondary" style="flex:1;" onclick="App.closeModal()">Cancel</button>
          <button class="btn-primary" style="flex:1;" onclick="App.deleteArtworkNow('${drawingId}')">Delete</button>
        </div>
      </div>
    `;
  }

  function deleteArtworkNow(drawingId) {
    delete store.artworks[drawingId];
    saveStore();
    closeModal();
    showToast("Artwork deleted");
    navigate("artwork", {}, false);
  }

  function renderCompletedArtworkPreview(host) {
    renderArtworkDetailScreen(host);
  }

  function renderFavoritesScreen(host) {
    const favDrawings = store.favorites.map((id) => getDrawingById(id)).filter(Boolean);
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Favorites</h1>
        </div>
      </div>
      <div class="page-body">
        ${
          favDrawings.length === 0
            ? renderEmptyStateHtml(
                "❤️",
                "No Favorites Yet",
                "Tap the heart icon on any page to save it here!",
                "Explore Pages",
                "App.navigate('gallery')"
              )
            : `<div class="drawings-grid">
                ${favDrawings.map((d) => renderDrawingCardHtml(d)).join("")}
               </div>`
        }
      </div>
    `;
  }

  function renderRecentlyColoredScreen(host) {
    const items = store.recentHistory;
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Recently Colored</h1>
        </div>
      </div>
      <div class="page-body">
        ${
          items.length === 0
            ? renderEmptyStateHtml(
                "🕒",
                "No Recent Activity",
                "Pages you open will appear here.",
                "Color Now",
                "App.navigate('levels')"
              )
            : `<div class="settings-list">
                ${items
                  .map((item) => {
                    const d = getDrawingById(item.drawingId);
                    const saved = store.artworks[d.id];
                    const thumb = window.ColoringEngine.buildColoredSvgMarkup(d.id, saved);
                    const dateStr = new Date(item.openedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return `
                      <div class="settings-row" style="cursor:pointer;gap:12px;" onclick="App.startColoring('${d.id}')">
                        <div style="width:52px;height:52px;border-radius:12px;border:1.5px solid #E0EAE4;overflow:hidden;flex-shrink:0;">
                          ${thumb}
                        </div>
                        <div style="flex:1;">
                          <div style="font-weight:900;font-size:15px;">Today, ${dateStr}</div>
                          <div style="font-size:12px;color:#566B60;font-weight:700;">${saved?.customTitle || d.title}</div>
                        </div>
                        <span style="font-size:18px;color:#566B60;">›</span>
                      </div>
                    `;
                  })
                  .join("")}
               </div>`
        }
      </div>
    `;
  }

  // --- Screen 12: Printable Coloring Pages ---
  function renderPrintablePagesScreen(host) {
    const cats = getCatalog().categories;
    const allDrawings = getCatalog().drawings;
    let filtered;
    if (nav.printableFilterCat === "all") {
      const firstFromEachCat = cats.map((c) => allDrawings.find((d) => d.categoryId === c.id)).filter(Boolean);
      const rest = allDrawings.filter((d) => !firstFromEachCat.includes(d)).slice(0, 16);
      filtered = [...firstFromEachCat, ...rest];
    } else {
      filtered = allDrawings.filter((d) => d.categoryId === nav.printableFilterCat);
    }

    host.innerHTML = `
      <div class="top-bar green-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Printable Pages</h1>
        </div>
      </div>

      <div class="page-body" style="padding-bottom:10px;">
        <div style="background:#FAF3E3;border-radius:18px;padding:12px 14px;display:flex;align-items:center;gap:12px;border:1.5px solid #EDE2C8;">
          <div style="width:74px;height:80px;flex-shrink:0;">${window.UltraHdArt?.PRINTABLE_CARD_ICON || ""}</div>
          <div style="flex:1;">
            <div style="font-weight:900;font-size:17px;color:#111;margin-bottom:4px;">AirPrint & PDF Book Builder</div>
            <div style="font-size:12.5px;font-weight:800;color:#1E2A22;line-height:1.45;">
              <span style="color:#1B8730;">✔</span> High-Resolution Vector PDF<br/>
              <span style="color:#1B8730;">✔</span> Works with Apple AirPrint<br/>
              <span style="color:#1B8730;">✔</span> Perfect for Home & Classroom
            </div>
          </div>
        </div>

        <div class="chip-row">
          <button class="filter-chip ${nav.printableFilterCat === "all" ? "active" : ""}" onclick="App.setPrintableCat('all')">All</button>
          ${cats
            .map(
              (c) => `
            <button class="filter-chip ${nav.printableFilterCat === c.id ? "active" : ""}" onclick="App.setPrintableCat('${c.id}')">${c.shortName}</button>
          `
            )
            .join("")}
        </div>

        <div class="drawings-grid-3col">
          ${filtered
            .map((d) => {
              const isSel = nav.selectedPrintIds.includes(d.id);
              return `
              <div class="drawing-card ${isSel ? "selected-print" : ""}" style="padding:6px;" onclick="App.togglePrintableSelect('${d.id}')">
                <div class="drawing-preview-box">
                  ${window.CHRISTMAS_SVG_LIBRARY[d.id]}
                  <div class="fav-badge-btn" style="width:22px;height:22px;font-size:12px;background:${isSel ? "#1B8730" : "rgba(255,255,255,0.9)"};color:${isSel ? "#FFFFFF" : "#333"};">
                    ${isSel ? "✓" : "♡"}
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>

        <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
          <button class="btn-primary" style="flex:1;" onclick="App.openPrintOptions()">
            🖨️ Print PDF (${nav.selectedPrintIds.length})
          </button>
          <button onclick="App.quickDownloadSelectedPdf()" style="width:52px;height:52px;border-radius:50%;border:2px solid #95CFA0;background:#CBEAD1;color:#174B35;font-size:22px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;" title="Download PDF">
            ⤓
          </button>
        </div>

        <div class="winter-footer-wrap">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  function setPrintableCat(catId) {
    nav.printableFilterCat = catId;
    renderCurrentScreen();
  }

  function togglePrintableSelect(id) {
    playPopSound(560, 0.05);
    if (nav.selectedPrintIds.includes(id)) {
      nav.selectedPrintIds = nav.selectedPrintIds.filter((x) => x !== id);
    } else {
      nav.selectedPrintIds.push(id);
    }
    renderCurrentScreen();
  }

  function selectFirstFourPrintables() {
    nav.selectedPrintIds = getCatalog().drawings.slice(0, 4).map((d) => d.id);
    renderCurrentScreen();
  }

  function clearPrintableSelection() {
    nav.selectedPrintIds = [];
    renderCurrentScreen();
  }

  function printSingleBlankPage(drawingId) {
    nav.selectedPrintIds = [drawingId];
    openPrintOptions();
  }

  async function quickDownloadSelectedPdf() {
    if (nav.selectedPrintIds.length === 0) {
      nav.selectedPrintIds = ["drawing_001"];
    }
    await buildAndPreviewPdf();
  }

  function openPrintOptions() {
    if (!store.settings.allowPrinting && !store.settings.allowPdfExport) {
      showToast("Printing & PDF Export are disabled in Parent Controls.");
      return;
    }
    if (nav.selectedPrintIds.length === 0) {
      nav.selectedPrintIds = ["drawing_001"];
    }
    navigate("print_options");
  }

  function renderPrintOptionsScreen(host) {
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Print Options</h1>
        </div>
      </div>

      <div class="page-body">
        <div>
          <h3 style="margin:0 0 10px;font-size:17px;font-weight:900;">Paper Size</h3>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
            <div class="drawing-card ${nav.pdfPaperSize === "A4" ? "selected-print" : ""}" style="align-items:center;padding:18px;"
              onclick="App.setPdfOption('A4', null)">
              <div style="font-size:36px;">📄</div>
              <div style="font-weight:900;font-size:18px;">A4</div>
              <div style="font-size:12px;color:#566B60;font-weight:700;">(210 × 297 mm)</div>
            </div>
            <div class="drawing-card ${nav.pdfPaperSize === "LETTER" ? "selected-print" : ""}" style="align-items:center;padding:18px;"
              onclick="App.setPdfOption('LETTER', null)">
              <div style="font-size:36px;">📃</div>
              <div style="font-weight:900;font-size:18px;">US Letter</div>
              <div style="font-size:12px;color:#566B60;font-weight:700;">(8.5 × 11 in)</div>
            </div>
          </div>
        </div>

        <div>
          <h3 style="margin:0 0 10px;font-size:17px;font-weight:900;">Page Layout</h3>
          <div class="settings-list">
            <div class="settings-row" style="cursor:pointer;" onclick="App.setPdfOption(null, 'single')">
              <span>${nav.pdfLayoutMode === "single" ? "🟢" : "⚪"} Single Drawing Per Page</span>
            </div>
            <div class="settings-row" style="cursor:pointer;" onclick="App.setPdfOption(null, 'multiple')">
              <span>${nav.pdfLayoutMode === "multiple" ? "🟢" : "⚪"} 4-Up Activity Sheet Grid</span>
            </div>
          </div>
        </div>

        <button class="btn-primary" onclick="App.buildAndPreviewPdf()">
          📄 Create Printable PDF
        </button>

        <div class="winter-footer-wrap" style="margin-top:auto;">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  function setPdfOption(paper, layout) {
    if (paper) nav.pdfPaperSize = paper;
    if (layout) nav.pdfLayoutMode = layout;
    renderCurrentScreen();
  }

  async function buildAndPreviewPdf() {
    showToast("Generating Printable PDF...");
    const drawingsList = nav.selectedPrintIds.map((id) => getDrawingById(id));
    nav.generatedPdfBundle = await window.PDFEngine.generatePrintablePdf(
      drawingsList,
      nav.pdfPaperSize,
      nav.pdfLayoutMode
    );
    nav.pdfPreviewPageIdx = 0;
    recordAchievementEvent("pdf_created");
    navigate("pdf_preview");
  }

  function renderPdfPreviewScreen(host) {
    const bundle = nav.generatedPdfBundle;
    if (!bundle || !bundle.previewImages?.length) {
      navigate("printable", {}, false);
      return;
    }
    const pageImg = bundle.previewImages[nav.pdfPreviewPageIdx] || bundle.previewImages[0];

    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Page Preview</h1>
        </div>
      </div>

      <div class="page-body" style="align-items:center;text-align:center;">
        <div style="width:100%;background:#FFFFFF;border-radius:18px;padding:10px;box-shadow:var(--card-shadow);border:2px solid #E5EAE7;">
          <img src="${pageImg}" alt="PDF Page Preview" style="width:100%;height:auto;border-radius:8px;display:block;" />
        </div>

        <div style="display:flex;align-items:center;gap:18px;font-weight:900;font-size:16px;">
          <button class="btn-secondary" style="padding:4px 12px;" onclick="App.stepPdfPreviewPage(-1)" ${nav.pdfPreviewPageIdx === 0 ? "disabled" : ""}>‹</button>
          <span>${nav.pdfPreviewPageIdx + 1} / ${bundle.pageCount}</span>
          <button class="btn-secondary" style="padding:4px 12px;" onclick="App.stepPdfPreviewPage(1)" ${nav.pdfPreviewPageIdx >= bundle.pageCount - 1 ? "disabled" : ""}>›</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn-primary green" onclick="App.triggerPrintAction()">🖨️ AirPrint</button>
            <button class="btn-secondary" onclick="App.shareGeneratedPdf()">📤 Share</button>
          </div>
          <button class="btn-primary" style="height:100%;border-radius:20px;flex-direction:column;" onclick="App.downloadGeneratedPdf()">
            <span style="font-size:24px;">📄</span>
            <span>Save PDF</span>
          </button>
        </div>
      </div>
    `;
  }

  function stepPdfPreviewPage(delta) {
    if (!nav.generatedPdfBundle) return;
    const next = nav.pdfPreviewPageIdx + delta;
    if (next >= 0 && next < nav.generatedPdfBundle.pageCount) {
      nav.pdfPreviewPageIdx = next;
      renderCurrentScreen();
    }
  }

  function triggerPrintAction() {
    if (!store.settings.allowPrinting) {
      showToast("Printing is disabled in Parent Controls.");
      return;
    }
    requireParentGate("AirPrint", () => {
      navigate("print_dialog");
    });
  }

  function renderPrintDialogScreen(host) {
    const bundle = nav.generatedPdfBundle;
    const previewImg = bundle?.previewImages?.[0] || "";
    host.innerHTML = `
      <div class="top-bar" style="background:#FFFFFF;color:#111111;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
        <div class="top-bar-left">
          <button class="icon-btn" style="color:#111111;background:#F3F4F6;" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">AirPrint</h1>
        </div>
      </div>

      <div class="page-body">
        <div style="background:#FFFFFF;border-radius:18px;padding:14px;box-shadow:var(--card-shadow);display:flex;gap:12px;align-items:center;">
          <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
            <div style="border:1.5px solid #DDD;border-radius:10px;padding:8px 10px;">
              <div style="font-size:11px;color:#666;font-weight:700;">Printer</div>
              <div style="font-weight:900;font-size:13.5px;">iOS AirPrint / Save PDF</div>
            </div>
            <div style="border:1.5px solid #DDD;border-radius:10px;padding:8px 10px;">
              <div style="font-size:11px;color:#666;font-weight:700;">Paper size</div>
              <div style="font-weight:900;font-size:13.5px;">${bundle?.paperSize === "LETTER" ? "US Letter (8.5 × 11 in)" : "A4 (210 × 297 mm)"}</div>
            </div>
            <div style="border:1.5px solid #DDD;border-radius:10px;padding:8px 10px;">
              <div style="font-size:11px;color:#666;font-weight:700;">Mode</div>
              <div style="font-weight:900;font-size:13.5px;">Crisp Black & White Line Art</div>
            </div>
          </div>
          <div style="width:120px;border:1.5px solid #DDD;border-radius:10px;overflow:hidden;">
            <img src="${previewImg}" style="width:100%;display:block;" />
          </div>
        </div>

        <div style="display:flex;gap:10px;">
          <button class="btn-secondary" style="flex:1;" onclick="App.goBack()">Cancel</button>
          <button class="btn-primary" style="flex:1;background:#007AFF;" onclick="App.executeNativePrint()">Print Now</button>
        </div>
      </div>
    `;
  }

  function executeNativePrint() {
    window.print();
  }

  function downloadGeneratedPdf() {
    if (!store.settings.allowPdfExport) {
      showToast("PDF Export is disabled in Parent Controls.");
      return;
    }
    requireParentGate("Export PDF", () => {
      const bundle = nav.generatedPdfBundle;
      if (!bundle) return;
      const url = URL.createObjectURL(bundle.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Christmas_Coloring_Book_${bundle.paperSize}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      showToast("PDF Saved ✓");
    });
  }

  function shareGeneratedPdf() {
    if (!store.settings.allowSharing) {
      showToast("Sharing is disabled in Parent Controls.");
      return;
    }
    requireParentGate("Share PDF", async () => {
      const bundle = nav.generatedPdfBundle;
      if (!bundle) return;
      try {
        if (navigator.share && bundle.blob) {
          const file = new File([bundle.blob], `Christmas_Coloring_Book_${bundle.paperSize}.pdf`, { type: "application/pdf" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Christmas Coloring Pages PDF",
              files: [file]
            });
            return;
          }
        }
      } catch (_) {}
      downloadGeneratedPdf();
    });
  }

  // --- Screen 16: Progress Dashboard ---
  function renderProgressDashboard(host) {
    const stats = getProgressStats();
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Progress</h1>
        </div>
      </div>

      <div class="page-body">
        <div style="background:#FFFFFF;border-radius:24px;padding:22px 18px;box-shadow:var(--card-shadow);text-align:center;">
          <div style="width:136px;height:136px;border-radius:50%;margin:0 auto 10px;border:11px solid #E2ECE6;border-top-color:#1B8730;border-right-color:#1B8730;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:26px;font-weight:900;color:#161E19;">${stats.totalDone} / 300</div>
            <div style="font-size:13px;font-weight:800;color:#566B60;">Completed</div>
          </div>
          <button class="btn-secondary" style="margin-top:6px;" onclick="App.navigate('achievements')">
            🏆 View ${stats.badgesUnlocked} / ${stats.badgesTotal} Holiday Badges
          </button>
        </div>

        <div class="settings-list" style="padding:16px;">
          <div style="margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;font-weight:900;margin-bottom:6px;">
              <span>✅ Easy (3–5)</span>
              <span>${stats.easyDone} / 100</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${Math.max(4, stats.easyDone)}%;"></div></div>
          </div>

          <div style="margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;font-weight:900;margin-bottom:6px;">
              <span>⭐ Medium (6–8)</span>
              <span>${stats.mediumDone} / 100</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${Math.max(4, stats.mediumDone)}%;background:#F5C451;"></div></div>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;font-weight:900;margin-bottom:6px;">
              <span>👑 Advanced (9+)</span>
              <span>${stats.advancedDone} / 100</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${Math.max(4, stats.advancedDone)}%;background:#8E24AA;"></div></div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Screen 18: Settings & Parent Controls (100% Ad-Free iOS Pro Edition) ---
  function renderSettingsScreen(host) {
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Settings</h1>
        </div>
      </div>

      <div class="page-body">
        <div class="settings-list">
          <div class="settings-row">
            <span>🎵 Christmas Music Box</span>
            <button class="toggle-switch ${store.settings.music ? "on" : ""}" onclick="App.toggleSetting('music')"></button>
          </div>
          <div class="settings-row">
            <span>🔊 Studio Sound Effects</span>
            <button class="toggle-switch ${store.settings.sound ? "on" : ""}" onclick="App.toggleSetting('sound')"></button>
          </div>
          <div class="settings-row">
            <span>📳 Haptic Feedback</span>
            <button class="toggle-switch ${store.settings.vibration ? "on" : ""}" onclick="App.toggleSetting('vibration')"></button>
          </div>
          <div class="settings-row">
            <span>❄️ Falling Snow Animation</span>
            <button class="toggle-switch ${store.settings.snowfall ? "on" : ""}" onclick="App.toggleSetting('snowfall')"></button>
          </div>
          <div class="settings-row">
            <span>👑 Pro Ad-Free Status</span>
            <span style="color:#1B8730;font-weight:900;">✓ Unlocked</span>
          </div>
          <div class="settings-row" style="cursor:pointer;" onclick="App.openParentControlsProtected()">
            <span>🔒 Parent Controls</span>
            <span>›</span>
          </div>
          <div class="settings-row" style="cursor:pointer;" onclick="App.confirmClearAllDataProtected()">
            <span>🗑️ Reset Saved Progress</span>
            <span>›</span>
          </div>
          <div class="settings-row" style="cursor:pointer;" onclick="App.navigate('privacy')">
            <span>🛡️ Privacy Policy</span>
            <span>›</span>
          </div>
          <div class="settings-row" style="cursor:pointer;" onclick="App.navigate('about')">
            <span>ℹ️ About Studio Pro</span>
            <span>›</span>
          </div>
        </div>

        <div style="text-align:center;font-size:13px;font-weight:800;color:#566B60;">
          ${APP_METADATA.appName} • v${APP_METADATA.version}
        </div>
      </div>
    `;
  }

  function toggleSetting(key) {
    store.settings[key] = !store.settings[key];
    saveStore();
    syncAudioSettings();
    playPopSound();
    renderCurrentScreen();
  }

  function openParentControlsProtected() {
    requireParentGate("Parent Controls", () => {
      navigate("parent_controls");
    });
  }

  function renderParentControlsScreen(host) {
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Parent Controls</h1>
        </div>
      </div>

      <div class="page-body">
        <div class="settings-list">
          <div class="settings-row">
            <span>🖨️ Allow AirPrint</span>
            <button class="toggle-switch ${store.settings.allowPrinting ? "on" : ""}" onclick="App.toggleSetting('allowPrinting')"></button>
          </div>
          <div class="settings-row">
            <span>📤 Allow Sharing Artwork</span>
            <button class="toggle-switch ${store.settings.allowSharing ? "on" : ""}" onclick="App.toggleSetting('allowSharing')"></button>
          </div>
          <div class="settings-row">
            <span>📄 Allow PDF Book Export</span>
            <button class="toggle-switch ${store.settings.allowPdfExport ? "on" : ""}" onclick="App.toggleSetting('allowPdfExport')"></button>
          </div>
        </div>

        <div style="background:#FFFFFF;border-radius:20px;padding:16px;box-shadow:var(--card-shadow);display:flex;flex-direction:column;gap:8px;">
          <h3 style="margin:0;font-size:16px;font-weight:900;color:#17834A;">🛡️ 100% Ad-Free Kids Guarantee</h3>
          <div style="font-size:13px;color:#2E3B33;font-weight:700;line-height:1.55;">
            This iOS Pro Edition contains <strong>zero third-party advertisements</strong>, zero analytics trackers, and zero in-app purchases. All 300 coloring pages, Pro brushes, Scratch Art, and Greeting Card tools work 100% offline.
          </div>
        </div>
      </div>
    `;
  }

  function confirmClearAllDataProtected() {
    requireParentGate("Clear Saved Data", () => {
      store.artworks = {};
      store.favorites = [];
      store.recentHistory = [];
      store.unlockedBadges = ["first_color"];
      saveStore();
      showToast("Saved data cleared");
      renderCurrentScreen();
    });
  }

  // --- Screen 19: Privacy Policy & About (Tailored for Ad-Free iOS App Store) ---
  function renderPrivacyScreen(host) {
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">Privacy Policy</h1>
        </div>
      </div>

      <div class="page-body">
        <div style="background:#FFFFFF;border-radius:22px;padding:18px;box-shadow:var(--card-shadow);">
          <h2 style="text-align:center;margin:0 0 12px;font-size:20px;font-weight:900;color:#161E19;">🛡️ Apple Kids Privacy Promise</h2>
          <div style="font-size:13.5px;font-weight:800;line-height:1.75;color:#1E2A22;">
            <span style="color:#1B8730;">✔</span> <strong>Zero Data Collection:</strong> We do not collect, store, or transmit any personal data, identifiers, photos, or usage analytics.<br/>
            <span style="color:#1B8730;">✔</span> <strong>100% Ad-Free Paid App:</strong> No advertising SDKs, no IDFA tracking, and no third-party marketing scripts.<br/>
            <span style="color:#1B8730;">✔</span> <strong>100% Local On-Device Storage:</strong> All 300 coloring pages, greeting cards, and saved drawings remain privately on your iPhone or iPad.<br/>
            <span style="color:#1B8730;">✔</span> <strong>Parent Gate Protected:</strong> Sharing and printing features are protected by a parental math verification gate.<br/>
            <span style="color:#1B8730;">✔</span> <strong>Developer:</strong> ${APP_METADATA.developerName}<br/>
            <span style="color:#1B8730;">✔</span> <strong>Parent Support:</strong> ${APP_METADATA.supportEmail}<br/>
          </div>
        </div>
        <div class="winter-footer-wrap" style="margin-top:auto;">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  function renderAboutScreen(host) {
    host.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <button class="icon-btn" onclick="App.goBack()">←</button>
          <h1 class="top-bar-title">About</h1>
        </div>
      </div>
      <div class="page-body" style="align-items:center;text-align:center;">
        <div style="width:92px;height:92px;border-radius:22px;box-shadow:var(--card-shadow);background:#FFE5EC;padding:6px;">
          ${window.UltraHdArt?.CATEGORY_ART?.santa_claus || ""}
        </div>
        <h2 style="margin:6px 0 2px;font-size:22px;font-weight:900;">${APP_METADATA.appName}</h2>
        <div style="font-weight:800;color:#566B60;font-size:13.5px;">Version ${APP_METADATA.version} • ${APP_METADATA.edition}</div>
        <p style="font-size:13.5px;font-weight:700;color:#2E3B33;max-width:320px;margin:4px 0;">
          A complete, 100% ad-free Christmas art studio for iPhone & iPad featuring 300 coloring pages, Magic Glitter & Neon brushes, Holiday Greeting Card Maker, and Rainbow Scratch Art.
        </p>
        <div style="background:#FFFFFF;border-radius:18px;padding:14px 16px;box-shadow:var(--card-shadow);text-align:left;width:100%;font-size:13.5px;font-weight:800;line-height:1.7;">
          <div>🏢 <strong>Developer:</strong> ${APP_METADATA.developerName}</div>
          <div>✉️ <strong>Support:</strong> ${APP_METADATA.supportEmail}</div>
          <div>👑 <strong>Edition:</strong> Premium Paid App (No Ads, No IAPs)</div>
        </div>
        <div class="winter-footer-wrap" style="margin-top:auto;">
          ${window.UltraHdArt?.WINTER_FOOTER_SVG || ""}
        </div>
      </div>
    `;
  }

  function renderEmptyStateHtml(icon, title, message, btnText, btnAction) {
    return `
      <div style="background:#FFFFFF;border-radius:22px;padding:28px 18px;text-align:center;box-shadow:var(--card-shadow);margin:10px 0;">
        <div style="font-size:48px;margin-bottom:8px;">${icon}</div>
        <h3 style="margin:0 0 6px;font-size:18px;font-weight:900;">${title}</h3>
        <p style="margin:0 0 16px;font-size:13.5px;color:#566B60;font-weight:700;">${message}</p>
        <button class="btn-primary green" style="max-width:220px;" onclick="${btnAction}">${btnText}</button>
      </div>
    `;
  }

  async function ensureArtworkPng(drawingId) {
    const art = store.artworks[drawingId];
    if (art?.pngDataUrl) return art.pngDataUrl;
    const svgStr = window.ColoringEngine.buildColoredSvgMarkup(drawingId, art);
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 900;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 900, 900);
      const img = new Image();
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 900, 900);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = url;
    });
  }

  function triggerDownloadDataUrl(dataUrl, filename) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function triggerNativeShareOrDownload(dataUrl, filename, titleText) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: titleText,
          files: [file]
        });
        return;
      }
    } catch (_) {}
    triggerDownloadDataUrl(dataUrl, filename);
    showToast("Saved Image ✓");
  }

  async function exportArtworkPng(drawingId) {
    const d = getDrawingById(drawingId);
    const dataUrl = await ensureArtworkPng(drawingId);
    triggerDownloadDataUrl(dataUrl, `${d.title.replace(/\s+/g, "_")}.png`);
    showToast("Saved PNG ✓");
  }

  function shareSavedArtwork(drawingId) {
    if (!store.settings.allowSharing) {
      showToast("Sharing is disabled in Parent Controls.");
      return;
    }
    requireParentGate("Share Artwork", async () => {
      const d = getDrawingById(drawingId);
      const dataUrl = await ensureArtworkPng(drawingId);
      await triggerNativeShareOrDownload(dataUrl, `${d.title.replace(/\s+/g, "_")}.png`, d.title);
    });
  }

  function shareBlankTemplate(drawingId) {
    printSingleBlankPage(drawingId);
  }

  function boot() {
    loadStore();
    initSnowfallEffect();
    renderCurrentScreen();
  }

  window.addEventListener("DOMContentLoaded", boot);

  return {
    navigate,
    goBack,
    openCategory,
    openDifficulty,
    openDrawingDetail,
    startColoring,
    toggleFavorite,
    toggleMusicQuick,
    recordAchievementEvent,
    openCardStudioForDrawing,
    setCardFrame,
    setCardDrawing,
    setCardHeadline,
    updateCardText,
    saveOrShareGreetingCard,
    setScratchBrushSize,
    selectScratchDrawing,
    selectScratchFromDetail,
    revealAllScratchArt,
    resetScratchArtCoat,
    saveScratchArtPng,
    onGallerySearch,
    setGalleryDiff,
    setGalleryCat,
    resetGalleryFilters,
    saveAndExitEditor,
    finishDrawing,
    confirmResetDrawing,
    openPaletteAndBrushModal,
    setArtworkFilter,
    promptRenameArtwork,
    saveRenamedArtwork,
    confirmDeleteArtwork,
    deleteArtworkNow,
    setPrintableCat,
    togglePrintableSelect,
    selectFirstFourPrintables,
    clearPrintableSelection,
    printSingleBlankPage,
    quickDownloadSelectedPdf,
    openPrintOptions,
    setPdfOption,
    buildAndPreviewPdf,
    stepPdfPreviewPage,
    triggerPrintAction,
    executeNativePrint,
    downloadGeneratedPdf,
    shareGeneratedPdf,
    toggleSetting,
    openParentControlsProtected,
    confirmClearAllDataProtected,
    exportArtworkPng,
    shareSavedArtwork,
    shareBlankTemplate,
    submitParentGate,
    closeModal,
    playPopSound,
    showToast,
  };
})();
