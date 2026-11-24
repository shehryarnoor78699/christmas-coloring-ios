/**
 * Ultra-HD 4K Vector UI Artwork Library for Christmas Coloring Pages
 * Replaces low-resolution cropped JPEGs with razor-sharp, multi-stop gradient 3D SVG illustrations
 * that render at infinite resolution on any phone or tablet screen (Retina / 1440p / 4K).
 */

window.UltraHdArt = (function () {
  const SHARED_DEFS = `
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#BEE6FF"/>
        <stop offset="60%" stop-color="#E7F6FF"/>
        <stop offset="100%" stop-color="#FFFFFF"/>
      </linearGradient>
      <linearGradient id="redSuit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FF3B3B"/>
        <stop offset="55%" stop-color="#E01E26"/>
        <stop offset="100%" stop-color="#9E0B12"/>
      </linearGradient>
      <linearGradient id="darkRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#C4121A"/>
        <stop offset="100%" stop-color="#78070C"/>
      </linearGradient>
      <linearGradient id="furWhite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="75%" stop-color="#F2F6FA"/>
        <stop offset="100%" stop-color="#D5E1EC"/>
      </linearGradient>
      <linearGradient id="skinPeach" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFE0C8"/>
        <stop offset="65%" stop-color="#FFC5A1"/>
        <stop offset="100%" stop-color="#F0A377"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF099"/>
        <stop offset="45%" stop-color="#FFD03B"/>
        <stop offset="100%" stop-color="#C98A00"/>
      </linearGradient>
      <linearGradient id="greenTree" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3CD060"/>
        <stop offset="55%" stop-color="#199A3B"/>
        <stop offset="100%" stop-color="#0D6323"/>
      </linearGradient>
      <linearGradient id="bluePrint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4FB6FF"/>
        <stop offset="55%" stop-color="#1582E8"/>
        <stop offset="100%" stop-color="#0952A5"/>
      </linearGradient>
      <linearGradient id="pinkHeart" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FF7EB6"/>
        <stop offset="55%" stop-color="#F52E82"/>
        <stop offset="100%" stop-color="#B00D52"/>
      </linearGradient>
      <linearGradient id="brownDeer" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E5A267"/>
        <stop offset="65%" stop-color="#BD773E"/>
        <stop offset="100%" stop-color="#8A4F20"/>
      </linearGradient>
      <filter id="softDrop" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0A2918" flood-opacity="0.22"/>
      </filter>
      <filter id="textSticker" x="-12%" y="-12%" width="124%" height="124%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#00223A" flood-opacity="0.18"/>
      </filter>
    </defs>
  `;

  // 1. ULTRA-HD HOME HERO BANNER (Bells, Holly, 3D Sticker Title, Waving Santa, "Color • Create • Print" pill)
  const HOME_HERO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 410" width="100%" height="100%">
      ${SHARED_DEFS}
      <!-- Bright Winter Sky Background -->
      <rect width="800" height="410" fill="url(#skyGrad)"/>
      <!-- Sparkles & Snowflakes -->
      <g fill="#FFFFFF" opacity="0.9">
        <circle cx="145" cy="36" r="5"/><circle cx="310" cy="24" r="4"/><circle cx="660" cy="32" r="5"/>
        <circle cx="755" cy="180" r="6"/><circle cx="48" cy="195" r="5"/><circle cx="390" cy="240" r="4"/>
        <path d="M168 42 L173 28 L178 42 L192 47 L178 52 L173 66 L168 52 L154 47 Z"/>
        <path d="M712 45 L716 33 L720 45 L732 49 L720 53 L716 65 L712 53 L700 49 Z"/>
      </g>

      <!-- Top-Left Golden Bells & Holly Leaves -->
      <g transform="translate(18, 22)" filter="url(#softDrop)">
        <path d="M22 42 C10 15, 45 5, 58 35 Z" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <path d="M58 35 C78 10, 112 22, 92 50 Z" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <path d="M10 52 C-5 35, 18 18, 45 42 Z" fill="#25B34A" stroke="#0A481A" stroke-width="3"/>
        <!-- Left Bell -->
        <path d="M28 52 C18 52, 8 92, 2 106 L58 114 C56 96, 52 52, 28 52 Z" fill="url(#goldGrad)" stroke="#8C5800" stroke-width="3"/>
        <circle cx="28" cy="115" r="9" fill="#B87300"/>
        <!-- Right Bell -->
        <path d="M68 48 C56 48, 48 86, 46 102 L104 92 C96 76, 84 48, 68 48 Z" fill="url(#goldGrad)" stroke="#8C5800" stroke-width="3"/>
        <circle cx="78" cy="100" r="9" fill="#B87300"/>
        <!-- Red Holly Berries -->
        <circle cx="46" cy="44" r="9" fill="url(#redSuit)" stroke="#7A060B" stroke-width="2"/>
        <circle cx="62" cy="46" r="9" fill="url(#redSuit)" stroke="#7A060B" stroke-width="2"/>
        <circle cx="54" cy="34" r="9" fill="url(#redSuit)" stroke="#7A060B" stroke-width="2"/>
      </g>

      <!-- Top-Right Holly Sprig -->
      <g transform="translate(695, 45)" filter="url(#softDrop)">
        <path d="M45 40 C20 22, 12 48, 35 60 Z" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <path d="M48 36 C55 8, 82 15, 68 45 Z" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <circle cx="52" cy="46" r="9" fill="url(#redSuit)" stroke="#7A060B" stroke-width="2"/>
        <circle cx="64" cy="54" r="8" fill="url(#redSuit)" stroke="#7A060B" stroke-width="2"/>
        <circle cx="48" cy="60" r="8" fill="url(#redSuit)" stroke="#7A060B" stroke-width="2"/>
      </g>

      <!-- Ultra-HD 3D Sticker Typography: "Christmas Coloring Pages" -->
      <g filter="url(#textSticker)" text-anchor="middle" font-family="'Arial Rounded MT Bold', 'Segoe UI', sans-serif" font-weight="900">
        <text x="435" y="106" font-size="94" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="22" stroke-linejoin="round">Christmas</text>
        <text x="435" y="106" font-size="94" fill="url(#redSuit)" stroke="#9E0B12" stroke-width="3">Christmas</text>

        <text x="445" y="182" font-size="72" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="18" stroke-linejoin="round">Coloring Pages</text>
        <text x="445" y="182" font-size="72" fill="url(#greenTree)" stroke="#0B5E20" stroke-width="2.5">Coloring Pages</text>
      </g>

      <!-- Red Pill Badge: "Color • Create • Print" -->
      <g transform="translate(335, 218)" filter="url(#softDrop)">
        <rect x="0" y="0" width="420" height="68" rx="34" fill="url(#redSuit)" stroke="#FFFFFF" stroke-width="4"/>
        <text x="210" y="44" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="31" fill="#FFFFFF" letter-spacing="0.5">Color • Create • Print</text>
      </g>

      <!-- Ultra-HD Waving Santa Claus (Bottom-Left) -->
      <g transform="translate(6, 155)" filter="url(#softDrop)">
        <!-- Waving Right Arm & Mitten -->
        <path d="M195 165 Q255 140 278 92 L235 74 Q215 112 178 132 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4" stroke-linejoin="round"/>
        <ellipse cx="255" cy="84" rx="28" ry="16" transform="rotate(-22 255 84)" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3.5"/>
        <path d="M242 72 C238 22, 296 22, 286 76 C298 62, 308 78, 282 92 Z" fill="url(#darkRed)" stroke="#4A070A" stroke-width="4" stroke-linejoin="round"/>

        <!-- Shoulders & Torso -->
        <path d="M8 250 C18 172, 210 172, 232 250 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4"/>
        <path d="M52 185 Q125 225 198 185" fill="none" stroke="#360507" stroke-width="8" stroke-linecap="round"/>

        <!-- Plush Scalloped White Beard -->
        <path d="M46 112 C18 145, 22 212, 68 232 C98 256, 156 256, 184 228 C222 205, 220 142, 192 112 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4" stroke-linejoin="round"/>

        <!-- Warm Face & Rosy Cheeks -->
        <path d="M64 78 C64 38, 178 38, 178 78 L178 128 C178 152, 64 152, 64 128 Z" fill="url(#skinPeach)" stroke="#4A070A" stroke-width="3.5"/>
        <circle cx="84" cy="112" r="13" fill="#FF7B7B" opacity="0.48"/>
        <circle cx="158" cy="112" r="13" fill="#FF7B7B" opacity="0.48"/>

        <!-- Twinkling Eyes & White Eyebrows -->
        <ellipse cx="98" cy="92" rx="7.5" ry="9.5" fill="#1A1A1A"/>
        <circle cx="95" cy="88" r="3" fill="#FFFFFF"/>
        <ellipse cx="146" cy="92" rx="7.5" ry="9.5" fill="#1A1A1A"/>
        <circle cx="143" cy="88" r="3" fill="#FFFFFF"/>
        <path d="M84 74 Q98 64 110 74" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
        <path d="M134 74 Q146 64 160 74" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>

        <!-- Cheerful Mouth & Mustache -->
        <path d="M104 132 Q122 162 140 132 Z" fill="#6E070C" stroke="#4A070A" stroke-width="3"/>
        <path d="M112 144 Q122 138 132 144 Q122 154 112 144 Z" fill="#FF5C6C"/>
        <path d="M122 118 C98 106, 62 118, 56 136 C78 148, 106 138, 122 128 C138 138, 166 148, 188 136 C182 118, 146 106, 122 118 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3.5" stroke-linejoin="round"/>
        <ellipse cx="122" cy="108" rx="16" ry="12.5" fill="#FF9E80" stroke="#4A070A" stroke-width="3"/>
        <ellipse cx="117" cy="104" rx="5" ry="3" fill="#FFE6DC"/>

        <!-- Santa Red Hat, Fluffy Brim & Pom-Pom -->
        <path d="M46 76 C38 -12, 168 -16, 192 68 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4" stroke-linejoin="round"/>
        <path d="M48 42 Q2 72 12 124 L48 98 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4" stroke-linejoin="round"/>
        <path d="M40 68 Q120 34 198 72 Q206 100 184 106 Q120 74 46 102 Q30 94 40 68 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4"/>
        <circle cx="16" cy="126" r="24" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4"/>
      </g>
    </svg>
  `;

  // 2. ULTRA-HD SPLASH SCREEN HERO (Full Standing Santa with Gift & Pine Trees)
  const SPLASH_HERO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 680" width="100%" height="100%">
      ${SHARED_DEFS}
      <!-- Side Pine Trees -->
      <g filter="url(#softDrop)">
        <polygon points="75,270 10,390 140,390" fill="url(#greenTree)" stroke="#0A481A" stroke-width="4"/>
        <polygon points="75,340 -5,480 155,480" fill="url(#greenTree)" stroke="#0A481A" stroke-width="4"/>
        <polygon points="525,290 460,400 590,400" fill="url(#greenTree)" stroke="#0A481A" stroke-width="4"/>
        <polygon points="525,355 445,490 605,490" fill="url(#greenTree)" stroke="#0A481A" stroke-width="4"/>
      </g>
      <!-- Title -->
      <g filter="url(#textSticker)" text-anchor="middle" font-family="'Arial Rounded MT Bold', 'Segoe UI', sans-serif" font-weight="900">
        <text x="300" y="95" font-size="82" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="20" stroke-linejoin="round">Christmas</text>
        <text x="300" y="95" font-size="82" fill="url(#redSuit)">Christmas</text>
        <text x="300" y="162" font-size="62" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="16" stroke-linejoin="round">Coloring Pages</text>
        <text x="300" y="162" font-size="62" fill="url(#greenTree)">Coloring Pages</text>
      </g>
      <!-- Full Standing Santa -->
      <g transform="translate(155, 195) scale(1.18)" filter="url(#softDrop)">
        <path d="M195 165 Q255 140 278 92 L235 74 Q215 112 178 132 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4"/>
        <ellipse cx="255" cy="84" rx="28" ry="16" transform="rotate(-22 255 84)" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3.5"/>
        <path d="M242 72 C238 22, 296 22, 286 76 Z" fill="url(#darkRed)" stroke="#4A070A" stroke-width="4"/>
        <path d="M22 185 Q122 165 222 185 L242 325 Q122 342 2 325 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4"/>
        <rect x="-4" y="308" width="252" height="32" rx="16" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4"/>
        <rect x="8" y="255" width="228" height="28" rx="6" fill="#1E1E1E" stroke="#000" stroke-width="3"/>
        <rect x="96" y="247" width="52" height="44" rx="8" fill="url(#goldGrad)" stroke="#7A4E00" stroke-width="3.5"/>
        <rect x="108" y="257" width="28" height="24" rx="4" fill="#1E1E1E"/>
        <path d="M46 112 C18 145, 22 212, 68 232 C98 256, 156 256, 184 228 C222 205, 220 142, 192 112 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4"/>
        <path d="M64 78 C64 38, 178 38, 178 78 L178 128 C178 152, 64 152, 64 128 Z" fill="url(#skinPeach)" stroke="#4A070A" stroke-width="3.5"/>
        <ellipse cx="98" cy="92" rx="7.5" ry="9.5" fill="#1A1A1A"/><circle cx="95" cy="88" r="3" fill="#FFFFFF"/>
        <ellipse cx="146" cy="92" rx="7.5" ry="9.5" fill="#1A1A1A"/><circle cx="143" cy="88" r="3" fill="#FFFFFF"/>
        <path d="M104 132 Q122 162 140 132 Z" fill="#6E070C" stroke="#4A070A" stroke-width="3"/>
        <path d="M122 118 C98 106, 62 118, 56 136 C78 148, 106 138, 122 128 C138 138, 166 148, 188 136 C182 118, 146 106, 122 118 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3.5"/>
        <ellipse cx="122" cy="108" rx="16" ry="12.5" fill="#FF9E80" stroke="#4A070A" stroke-width="3"/>
        <path d="M46 76 C38 -12, 168 -16, 192 68 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="4"/>
        <path d="M40 68 Q120 34 198 72 Q206 100 184 106 Q120 74 46 102 Q30 94 40 68 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4"/>
        <circle cx="16" cy="126" r="24" fill="url(#furWhite)" stroke="#4A070A" stroke-width="4"/>
      </g>
      <!-- Gift Box & Fluffy Snow -->
      <g transform="translate(55, 435)" filter="url(#softDrop)">
        <rect x="0" y="30" width="115" height="95" rx="10" fill="#B52BFF" stroke="#4A007A" stroke-width="4"/>
        <rect x="-8" y="8" width="131" height="30" rx="8" fill="url(#goldGrad)" stroke="#7A4E00" stroke-width="4"/>
        <rect x="44" y="8" width="26" height="117" fill="url(#redSuit)"/>
      </g>
      <path d="M0 565 Q150 515 300 565 Q450 520 600 565 L600 680 L0 680 Z" fill="url(#furWhite)"/>
    </svg>
  `;

  // 3. ULTRA-HD 4 ACTION CARD ICONS
  const ACTION_ICONS = {
    colorNow: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <path d="M60 10 C22 10, 8 38, 18 65 C28 84, 62 86, 74 72 C82 62, 68 52, 78 44 C88 36, 106 44, 104 28 C100 14, 82 10, 60 10 Z" fill="url(#goldGrad)" stroke="#9E6500" stroke-width="3.5"/>
          <circle cx="36" cy="34" r="9" fill="#FF2E2E"/><circle cx="60" cy="24" r="8.5" fill="#17A83B"/>
          <circle cx="36" cy="58" r="8.5" fill="#17A83B"/><circle cx="56" cy="68" r="8" fill="#E91E63"/>
          <!-- Paintbrush -->
          <path d="M78 36 L108 6 L116 14 L86 44 Z" fill="url(#redSuit)" stroke="#5E060A" stroke-width="3"/>
          <path d="M64 48 C64 34, 78 32, 86 42 C78 54, 64 56, 64 48 Z" fill="url(#bluePrint)" stroke="#06397A" stroke-width="3"/>
        </g>
      </svg>
    `,
    printable: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <rect x="32" y="6" width="56" height="26" rx="4" fill="#E8F6FF" stroke="#0952A5" stroke-width="3.5"/>
          <rect x="16" y="24" width="88" height="42" rx="10" fill="url(#bluePrint)" stroke="#063B7A" stroke-width="3.5"/>
          <circle cx="88" cy="38" r="4.5" fill="#FFF"/>
          <rect x="30" y="50" width="60" height="32" rx="4" fill="#FFFFFF" stroke="#0952A5" stroke-width="3.5"/>
          <line x1="40" y1="60" x2="80" y2="60" stroke="#4FB6FF" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="40" y1="70" x2="72" y2="70" stroke="#4FB6FF" stroke-width="3.5" stroke-linecap="round"/>
        </g>
      </svg>
    `,
    artwork: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <rect x="18" y="10" width="84" height="70" rx="12" fill="url(#greenTree)" stroke="#0A4D1C" stroke-width="4"/>
          <rect x="26" y="18" width="68" height="54" rx="7" fill="#B8E9FF"/>
          <circle cx="44" cy="34" r="10" fill="url(#goldGrad)"/>
          <polygon points="26,72 52,44 74,72" fill="#25B34A"/>
          <polygon points="50,72 78,38 94,72" fill="#138232"/>
        </g>
      </svg>
    `,
    favorites: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <path d="M60 78 C20 54, 12 24, 34 14 C48 8, 58 18, 60 26 C62 18, 72 8, 86 14 C108 24, 100 54, 60 78 Z" fill="url(#pinkHeart)" stroke="#7A0638" stroke-width="4" stroke-linejoin="round"/>
          <path d="M32 24 Q40 16 48 22" fill="none" stroke="#FFD6E8" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      </svg>
    `,
  };

  // 4. ULTRA-HD WINTER VILLAGE FOOTER STRIP
  const WINTER_FOOTER_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 130" width="100%" height="100%" preserveAspectRatio="none">
      ${SHARED_DEFS}
      <!-- Distant Snowy Hills -->
      <path d="M0 95 Q200 60 420 95 Q620 65 800 90 L800 130 L0 130 Z" fill="#D9F0FF"/>
      <path d="M0 108 Q260 82 520 108 Q680 92 800 105 L800 130 L0 130 Z" fill="#FFFFFF"/>

      <!-- Left Snow-Topped Pine Tree -->
      <g transform="translate(8, 6)" filter="url(#softDrop)">
        <polygon points="52,8 8,62 96,62" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <polygon points="52,40 2,95 102,95" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <polygon points="52,70 -4,122 108,122" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
      </g>

      <!-- Cozy Red Christmas Cottage -->
      <g transform="translate(125, 22)" filter="url(#softDrop)">
        <rect x="18" y="42" width="136" height="64" rx="4" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3"/>
        <path d="M6 46 L86 4 L166 46 Z" fill="url(#furWhite)" stroke="#99C2E0" stroke-width="3.5" stroke-linejoin="round"/>
        <rect x="34" y="62" width="24" height="24" rx="4" fill="url(#goldGrad)" stroke="#6E070C" stroke-width="2.5"/>
        <rect x="68" y="62" width="24" height="24" rx="4" fill="url(#goldGrad)" stroke="#6E070C" stroke-width="2.5"/>
        <rect x="108" y="58" width="28" height="48" rx="4" fill="url(#goldGrad)" stroke="#6E070C" stroke-width="2.5"/>
      </g>

      <!-- Small Distant Cottage -->
      <g transform="translate(405, 62)" filter="url(#softDrop)">
        <rect x="8" y="22" width="60" height="32" fill="url(#redSuit)" stroke="#6E070C" stroke-width="2"/>
        <polygon points="2,24 38,4 74,24" fill="#FFFFFF" stroke="#99C2E0" stroke-width="2"/>
        <rect x="20" y="32" width="12" height="12" fill="url(#goldGrad)"/>
        <rect x="42" y="30" width="14" height="24" fill="url(#goldGrad)"/>
      </g>

      <!-- Right Festive Gift Boxes -->
      <g transform="translate(580, 26)" filter="url(#softDrop)">
        <!-- Green Gift -->
        <rect x="0" y="52" width="88" height="52" rx="6" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
        <rect x="34" y="52" width="20" height="52" fill="url(#goldGrad)"/>
        <ellipse cx="32" cy="46" rx="16" ry="9" fill="url(#redSuit)" stroke="#6E070C" stroke-width="2.5"/>
        <ellipse cx="56" cy="46" rx="16" ry="9" fill="url(#redSuit)" stroke="#6E070C" stroke-width="2.5"/>
        <!-- Big Red Gift -->
        <rect x="96" y="26" width="104" height="78" rx="8" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3"/>
        <rect x="138" y="26" width="20" height="78" fill="url(#goldGrad)"/>
        <ellipse cx="134" cy="18" rx="20" ry="11" fill="url(#greenTree)" stroke="#0A481A" stroke-width="2.5"/>
        <ellipse cx="162" cy="18" rx="20" ry="11" fill="url(#greenTree)" stroke="#0A481A" stroke-width="2.5"/>
      </g>
    </svg>
  `;

  // 5. ULTRA-HD CATEGORY & LEVEL ILLUSTRATIONS
  const CATEGORY_ART = {
    santa_claus: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)" transform="translate(10, 6)">
          <path d="M18 98 C24 72, 96 72, 102 98 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="3"/>
          <path d="M24 52 C10 72, 14 102, 60 104 C106 102, 110 72, 96 52 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
          <rect x="32" y="32" width="56" height="34" rx="14" fill="url(#skinPeach)" stroke="#4A070A" stroke-width="3"/>
          <circle cx="48" cy="46" r="4.5" fill="#1A1A1A"/><circle cx="72" cy="46" r="4.5" fill="#1A1A1A"/>
          <path d="M52 66 Q60 78 68 66 Z" fill="#7A060B"/>
          <path d="M60 58 C45 52, 28 58, 26 66 C40 72, 52 66, 60 62 C68 66, 80 72, 94 66 C92 58, 75 52, 60 58 Z" fill="url(#furWhite)" stroke="#4A070A" stroke-width="2.5"/>
          <ellipse cx="60" cy="53" rx="9" ry="7" fill="#FF9472" stroke="#4A070A" stroke-width="2.5"/>
          <path d="M26 36 C24 0, 92 0, 96 36 Z" fill="url(#redSuit)" stroke="#4A070A" stroke-width="3"/>
          <rect x="22" y="26" width="76" height="16" rx="8" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
          <circle cx="14" cy="54" r="12" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
        </g>
      </svg>
    `,
    christmas_trees: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <rect x="58" y="92" width="24" height="22" rx="4" fill="#8A4F20" stroke="#4A2508" stroke-width="3"/>
          <polygon points="70,46 18,96 122,96" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="70,28 28,72 112,72" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="70,14 40,48 100,48" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="70,2 75,12 86,13 78,20 80,30 70,25 60,30 62,20 54,13 65,12" fill="url(#goldGrad)" stroke="#8C5800" stroke-width="2"/>
          <circle cx="55" cy="56" r="6" fill="url(#redSuit)"/><circle cx="84" cy="60" r="6" fill="url(#goldGrad)"/>
          <circle cx="44" cy="82" r="6.5" fill="url(#goldGrad)"/><circle cx="72" cy="78" r="6.5" fill="url(#redSuit)"/><circle cx="94" cy="84" r="6" fill="#4FB6FF"/>
        </g>
      </svg>
    `,
    snowmen: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <line x1="38" y1="68" x2="12" y2="52" stroke="#4A2508" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="102" y1="68" x2="128" y2="52" stroke="#4A2508" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="70" cy="88" r="34" fill="url(#furWhite)" stroke="#24352C" stroke-width="3"/>
          <circle cx="70" cy="48" r="26" fill="url(#furWhite)" stroke="#24352C" stroke-width="3"/>
          <rect x="44" y="64" width="52" height="12" rx="6" fill="url(#redSuit)" stroke="#6E070C" stroke-width="2.5"/>
          <path d="M52 72 L42 98 L56 98 L62 72 Z" fill="url(#redSuit)" stroke="#6E070C" stroke-width="2.5"/>
          <circle cx="60" cy="40" r="4" fill="#1A1A1A"/><circle cx="80" cy="40" r="4" fill="#1A1A1A"/>
          <polygon points="68,44 92,48 68,52" fill="#FF7700" stroke="#994400" stroke-width="2"/>
          <path d="M58 55 Q70 63 82 55" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
          <path d="M46 28 C48 4, 92 4, 98 30 Z" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3"/>
          <rect x="42" y="22" width="56" height="11" rx="5.5" fill="url(#greenTree)" stroke="#0A481A" stroke-width="2.5"/>
          <circle cx="104" cy="28" r="9" fill="#1582E8" stroke="#063B7A" stroke-width="2.5"/>
        </g>
      </svg>
    `,
    reindeer: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <path d="M48 38 L28 12 M36 22 L48 16 M34 26 L22 24" stroke="#5C3110" stroke-width="6" stroke-linecap="round"/>
          <path d="M92 38 L112 12 M104 22 L92 16 M106 26 L118 24" stroke="#5C3110" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="36" cy="44" rx="14" ry="8" transform="rotate(-20 36 44)" fill="url(#brownDeer)" stroke="#5C3110" stroke-width="3"/>
          <ellipse cx="104" cy="44" rx="14" ry="8" transform="rotate(20 104 44)" fill="url(#brownDeer)" stroke="#5C3110" stroke-width="3"/>
          <circle cx="70" cy="66" r="32" fill="url(#brownDeer)" stroke="#5C3110" stroke-width="3"/>
          <ellipse cx="70" cy="78" rx="22" ry="16" fill="#FFE0C2"/>
          <circle cx="56" cy="58" r="4.5" fill="#1A1A1A"/><circle cx="84" cy="58" r="4.5" fill="#1A1A1A"/>
          <ellipse cx="70" cy="72" rx="11" ry="8.5" fill="url(#redSuit)" stroke="#6E070C" stroke-width="2.5"/>
          <path d="M58 84 Q70 92 82 84" fill="none" stroke="#4A2508" stroke-width="3" stroke-linecap="round"/>
        </g>
      </svg>
    `,
    christmas_gifts: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <g filter="url(#softDrop)">
          <rect x="28" y="42" width="84" height="66" rx="8" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3.5"/>
          <rect x="22" y="28" width="96" height="20" rx="6" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3.5"/>
          <rect x="61" y="28" width="18" height="80" fill="url(#goldGrad)" stroke="#8C5800" stroke-width="2"/>
          <ellipse cx="52" cy="20" rx="18" ry="10" fill="url(#darkRed)" stroke="#5E060A" stroke-width="3"/>
          <ellipse cx="88" cy="20" rx="18" ry="10" fill="url(#darkRed)" stroke="#5E060A" stroke-width="3"/>
          <circle cx="70" cy="22" r="8" fill="url(#goldGrad)" stroke="#8C5800" stroke-width="2.5"/>
        </g>
      </svg>
    `,
  };

  const LEVEL_KIDS = {
    easy: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <rect width="120" height="120" rx="24" fill="#8EE075"/>
        <g filter="url(#softDrop)">
          <path d="M26 116 C32 88, 88 88, 94 116 Z" fill="url(#greenTree)" stroke="#0A481A" stroke-width="3"/>
          <circle cx="60" cy="66" r="28" fill="url(#skinPeach)" stroke="#5C3110" stroke-width="3"/>
          <circle cx="48" cy="64" r="4.5" fill="#1A1A1A"/><circle cx="72" cy="64" r="4.5" fill="#1A1A1A"/>
          <path d="M50 76 Q60 85 70 76" fill="none" stroke="#7A2E1D" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M28 52 C28 14, 92 14, 92 52 Z" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3"/>
          <rect x="24" y="42" width="72" height="14" rx="7" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
          <circle cx="20" cy="66" r="10" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
        </g>
      </svg>
    `,
    medium: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <rect width="120" height="120" rx="24" fill="#FFE066"/>
        <g filter="url(#softDrop)">
          <path d="M24 66 C18 96, 102 96, 96 66 Z" fill="#5C3110"/>
          <path d="M26 116 C32 88, 88 88, 94 116 Z" fill="url(#pinkHeart)" stroke="#7A0638" stroke-width="3"/>
          <circle cx="60" cy="66" r="27" fill="url(#skinPeach)" stroke="#5C3110" stroke-width="3"/>
          <circle cx="48" cy="64" r="4.5" fill="#1A1A1A"/><circle cx="72" cy="64" r="4.5" fill="#1A1A1A"/>
          <path d="M50 76 Q60 85 70 76" fill="none" stroke="#7A2E1D" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M28 52 C28 14, 92 14, 92 52 Z" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3"/>
          <rect x="24" y="42" width="72" height="14" rx="7" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
          <circle cx="20" cy="66" r="10" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
        </g>
      </svg>
    `,
    advanced: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        ${SHARED_DEFS}
        <rect width="120" height="120" rx="24" fill="#CFA8FF"/>
        <g filter="url(#softDrop)">
          <path d="M26 116 C32 88, 88 88, 94 116 Z" fill="url(#bluePrint)" stroke="#063B7A" stroke-width="3"/>
          <circle cx="60" cy="66" r="28" fill="url(#skinPeach)" stroke="#5C3110" stroke-width="3"/>
          <circle cx="48" cy="64" r="4.5" fill="#1A1A1A"/><circle cx="72" cy="64" r="4.5" fill="#1A1A1A"/>
          <path d="M50 76 Q60 85 70 76" fill="none" stroke="#7A2E1D" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M28 52 C28 14, 92 14, 92 52 Z" fill="url(#redSuit)" stroke="#6E070C" stroke-width="3"/>
          <rect x="24" y="42" width="72" height="14" rx="7" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
          <circle cx="20" cy="66" r="10" fill="url(#furWhite)" stroke="#4A070A" stroke-width="3"/>
        </g>
      </svg>
    `,
  };

  const PRINTABLE_CARD_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 130" width="100%" height="100%">
      <g transform="rotate(-8 60 65)">
        <rect x="18" y="12" width="84" height="104" rx="10" fill="#FFFFFF" stroke="#181818" stroke-width="3.5"/>
        <rect x="12" y="16" width="84" height="104" rx="10" fill="#FFFFFF" stroke="#181818" stroke-width="3.5"/>
        <circle cx="54" cy="64" r="24" fill="#FFFFFF" stroke="#181818" stroke-width="3"/>
        <path d="M34 52 C34 26, 74 26, 74 52 Z" fill="#FFFFFF" stroke="#181818" stroke-width="3"/>
        <circle cx="46" cy="58" r="3" fill="#181818"/><circle cx="62" cy="58" r="3" fill="#181818"/>
        <path d="M46 70 Q54 78 62 70" fill="none" stroke="#181818" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>
  `;

  return {
    HOME_HERO_SVG,
    SPLASH_HERO_SVG,
    ACTION_ICONS,
    WINTER_FOOTER_SVG,
    CATEGORY_ART,
    LEVEL_KIDS,
    PRINTABLE_CARD_ICON,
  };
})();
