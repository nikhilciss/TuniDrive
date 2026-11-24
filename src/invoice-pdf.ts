/** Lazy-loaded browser export: capture the existing invoice, retaining Arabic shaping. */
export async function downloadInvoicePDF(
  element: HTMLElement,
  filename: string,
) {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);
  await document.fonts.ready;
  await Promise.all(
    Array.from(element.querySelectorAll("img")).map((image) =>
      image.decode().catch(() => undefined),
    ),
  );
  const canvas = await toCanvas(element, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    skipFonts: true,
    cacheBust: false,
  });
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const margin = 12,
    width = 186,
    height = 273;
  const ratio = width / canvas.width;
  const pagePixels = Math.floor(height / ratio);
  // Prefer existing DOM block boundaries so longer invoices do not split text rows.
  const bounds = element.getBoundingClientRect();
  const scale = canvas.height / element.offsetHeight;
  const breakpoints = Array.from(
    element.querySelectorAll(
      ".row, .price-summary > div, .spec-grid, .chips, p, h3, hr",
    ),
  )
    .map((node) => (node.getBoundingClientRect().bottom - bounds.top) * scale)
    .filter((y) => y > 0)
    .sort((a, b) => a - b);
  let top = 0,
    page = 0;
  while (top < canvas.height) {
    let bottom = Math.min(top + pagePixels, canvas.height);
    if (bottom < canvas.height) {
      const points = breakpoints.filter(
        (y) => y > top + pagePixels * 0.45 && y <= bottom,
      );
      if (points.length) bottom = Math.floor(points[points.length - 1]);
    }
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = bottom - top;
    const ctx = slice.getContext("2d");
    if (!ctx) throw new Error("pdfFailed");
    ctx.drawImage(
      canvas,
      0,
      top,
      canvas.width,
      slice.height,
      0,
      0,
      slice.width,
      slice.height,
    );
    if (page++) pdf.addPage();
    pdf.addImage(
      slice.toDataURL("image/png"),
      "PNG",
      margin,
      margin,
      width,
      slice.height * ratio,
      undefined,
      "FAST",
    );
    top = bottom;
  }
  pdf.setProperties({
    title: filename,
    subject: "TuniDrive demonstration invoice",
    creator: "TuniDrive",
  });
  pdf.save(filename.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf");
}
