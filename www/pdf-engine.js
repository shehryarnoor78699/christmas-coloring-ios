/**
 * PDF & Print Engine for Christmas Coloring Pages
 * Supports:
 * - Paper sizes: A4 (210 x 297 mm) and US Letter (8.5 x 11 in)
 * - Page layouts: Single Page (1 drawing per page) and Multiple Pages (2x2 grid per page)
 * - Crisp black-and-white vector/raster rendering with white background and zero ads
 * - Direct valid multi-page PDF binary generation (data URL / Blob / Base64 for Android bridge)
 */

window.PDFEngine = (function () {
  const PAPER_SIZES = {
    A4: { name: "A4 (210 × 297 mm)", widthPt: 595.28, heightPt: 841.89, canvasW: 1240, canvasH: 1754 },
    LETTER: { name: "US Letter (8.5 × 11 in)", widthPt: 612.0, heightPt: 792.0, canvasW: 1275, canvasH: 1650 },
  };

  function renderSvgToImage(svgMarkup) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function (err) {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  /**
   * Renders one PDF page canvas (either 1 drawing full-page or up to 4 drawings in a 2x2 grid)
   */
  async function renderPageCanvas(drawingsSlice, paperKey, layoutMode, pageIndex, totalPages) {
    const spec = PAPER_SIZES[paperKey] || PAPER_SIZES.A4;
    const canvas = document.createElement("canvas");
    canvas.width = spec.canvasW;
    canvas.height = spec.canvasH;
    const ctx = canvas.getContext("2d");

    // Pure white background, no ads
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle festive printable frame border
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Header
    ctx.fillStyle = "#181818";
    ctx.font = "bold 34px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Christmas Coloring Pages", canvas.width / 2, 102);

    if (layoutMode === "single" || drawingsSlice.length === 1) {
      const d = drawingsSlice[0];
      const svgText = window.CHRISTMAS_SVG_LIBRARY[d.id];
      const img = await renderSvgToImage(svgText);

      const boxSize = Math.min(canvas.width - 180, canvas.height - 360);
      const bx = (canvas.width - boxSize) / 2;
      const by = 150;
      ctx.drawImage(img, bx, by, boxSize, boxSize);

      // Drawing Title & Difficulty Footer
      ctx.font = "bold 30px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#181818";
      ctx.fillText(d.title, canvas.width / 2, by + boxSize + 58);

      ctx.font = "22px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#444444";
      ctx.fillText(`${d.categoryName}  •  Level: ${d.difficulty.toUpperCase()} (${d.recommendedAge})`, canvas.width / 2, by + boxSize + 96);
    } else {
      // 2x2 Grid for Multiple Pages mode
      const cols = 2;
      const rows = 2;
      const marginX = 85;
      const topY = 140;
      const availW = canvas.width - marginX * 2;
      const availH = canvas.height - topY - 120;
      const cellW = availW / cols;
      const cellH = availH / rows;

      for (let i = 0; i < drawingsSlice.length; i++) {
        const d = drawingsSlice[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = marginX + col * cellW;
        const cy = topY + row * cellH;
        const imgSize = Math.min(cellW - 40, cellH - 80);
        const ix = cx + (cellW - imgSize) / 2;
        const iy = cy + 12;

        const svgText = window.CHRISTMAS_SVG_LIBRARY[d.id];
        const img = await renderSvgToImage(svgText);
        ctx.drawImage(img, ix, iy, imgSize, imgSize);

        ctx.font = "bold 22px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#181818";
        ctx.fillText(d.title, cx + cellW / 2, iy + imgSize + 34);
      }
    }

    // Page number footer
    ctx.font = "20px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#555555";
    ctx.fillText(`Page ${pageIndex + 1} of ${totalPages}  •  Paper: ${paperKey}`, canvas.width / 2, canvas.height - 68);

    return canvas;
  }

  /**
   * Builds a standards-compliant PDF 1.4 file from an array of rendered JPEG page images.
   */
  function assemblePdfFromJpegPages(jpegDataUrls, widthPt, heightPt) {
    const pages = jpegDataUrls.map((dataUrl) => {
      const base64 = dataUrl.split(",")[1];
      const raw = atob(base64);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      return bytes;
    });

    const chunks = [];
    const offsets = [];
    let byteOffset = 0;

    function pushStr(str) {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i) & 0xff;
      chunks.push(arr);
      byteOffset += arr.length;
    }

    function pushBytes(arr) {
      chunks.push(arr);
      byteOffset += arr.length;
    }

    function startObj(id) {
      offsets[id] = byteOffset;
      pushStr(`${id} 0 obj\n`);
    }

    function endObj() {
      pushStr(`\nendobj\n`);
    }

    pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

    const numPages = pages.length;
    // Object 1: Catalog, Object 2: Pages
    // For each page i (0..numPages-1):
    //   PageObj = 3 + i*3
    //   ContentObj = 4 + i*3
    //   ImageObj = 5 + i*3
    const pageObjIds = [];
    for (let i = 0; i < numPages; i++) {
      pageObjIds.push(3 + i * 3);
    }

    startObj(1);
    pushStr(`<< /Type /Catalog /Pages 2 0 R >>`);
    endObj();

    startObj(2);
    pushStr(`<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${numPages} >>`);
    endObj();

    const specW = Math.round(widthPt * 100) / 100;
    const specH = Math.round(heightPt * 100) / 100;

    for (let i = 0; i < numPages; i++) {
      const pageObjId = 3 + i * 3;
      const contentObjId = 4 + i * 3;
      const imgObjId = 5 + i * 3;
      const imgBytes = pages[i];
      const pixelW = widthPt === 612 ? 1275 : 1240;
      const pixelH = widthPt === 612 ? 1650 : 1754;

      startObj(pageObjId);
      pushStr(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${specW} ${specH}] ` +
          `/Resources << /XObject << /Im${i} ${imgObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>`
      );
      endObj();

      const contentStream = `q\n${specW} 0 0 ${specH} 0 0 cm\n/Im${i} Do\nQ\n`;
      startObj(contentObjId);
      pushStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream`);
      endObj();

      startObj(imgObjId);
      pushStr(
        `<< /Type /XObject /Subtype /Image /Width ${pixelW} /Height ${pixelH} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
      );
      pushBytes(imgBytes);
      pushStr(`\nendstream`);
      endObj();
    }

    const totalObjs = 2 + numPages * 3;
    const xrefOffset = byteOffset;
    pushStr(`xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`);
    for (let id = 1; id <= totalObjs; id++) {
      const off = String(offsets[id] || 0).padStart(10, "0");
      pushStr(`${off} 00000 n \n`);
    }
    pushStr(`trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

    const blob = new Blob(chunks, { type: "application/pdf" });
    return blob;
  }

  async function generatePrintablePdf(drawingsList, paperKey = "A4", layoutMode = "single") {
    const spec = PAPER_SIZES[paperKey] || PAPER_SIZES.A4;
    const perPage = layoutMode === "multiple" ? 4 : 1;
    const groups = [];
    for (let i = 0; i < drawingsList.length; i += perPage) {
      groups.push(drawingsList.slice(i, i + perPage));
    }
    if (groups.length === 0 && window.CHRISTMAS_CATALOG?.drawings?.length) {
      groups.push([window.CHRISTMAS_CATALOG.drawings[0]]);
    }

    const jpegPages = [];
    const previewDataUrls = [];
    for (let p = 0; p < groups.length; p++) {
      const canvas = await renderPageCanvas(groups[p], paperKey, layoutMode, p, groups.length);
      const jpegUrl = canvas.toDataURL("image/jpeg", 0.92);
      jpegPages.push(jpegUrl);
      previewDataUrls.push(jpegUrl);
    }

    const pdfBlob = assemblePdfFromJpegPages(jpegPages, spec.widthPt, spec.heightPt);
    const pdfBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(pdfBlob);
    });

    return {
      blob: pdfBlob,
      base64: pdfBase64,
      pageCount: groups.length,
      paperSize: paperKey,
      layoutMode,
      previewImages: previewDataUrls,
    };
  }

  return {
    PAPER_SIZES,
    generatePrintablePdf,
  };
})();
