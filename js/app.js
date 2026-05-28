pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const grid = document.getElementById("brochureGrid");
const mainDownload = document.getElementById("mainDownload");

function slugUrl(id) {
  return "brochure-viewer.html?id=" + encodeURIComponent(id);
}

async function renderCover(pdfFile, canvas, loading) {
  try {
    const pdf = await pdfjsLib.getDocument(encodeURI(pdfFile)).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.5 });
    const context = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    loading.style.display = "none";
  } catch (error) {
    loading.textContent = "Cover gagal dimuat";
    console.error("Cover error:", error);
  }
}

function createButton(className, href, text) {
  const link = document.createElement("a");
  link.className = className;
  link.href = href;
  link.textContent = text;
  return link;
}

function renderBrochures() {
  const brochures = window.BROCHURES || [];

  if (!grid) {
    console.error("Element brochureGrid tidak ditemukan.");
    return;
  }

  grid.innerHTML = "";

  if (!brochures.length) {
    grid.innerHTML = "<p>Belum ada data brosur.</p>";
    return;
  }

  if (mainDownload) {
    mainDownload.href = brochures[0].download;
  }

  brochures.forEach(function(item) {
    const card = document.createElement("article");
    card.className = "brochure-card";

    const coverLink = document.createElement("a");
    coverLink.className = "cover-link";
    coverLink.href = slugUrl(item.id);
    coverLink.setAttribute("aria-label", "Lihat " + item.title);

    const coverFrame = document.createElement("div");
    coverFrame.className = "cover-frame";

    const canvas = document.createElement("canvas");

    const loading = document.createElement("div");
    loading.className = "cover-loading";
    loading.textContent = "Memuat Cover";

    coverFrame.appendChild(canvas);
    coverFrame.appendChild(loading);
    coverLink.appendChild(coverFrame);

    const info = document.createElement("div");
    info.className = "brochure-info";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const desc = document.createElement("p");
    desc.textContent = item.description;

    const actionRow = document.createElement("div");
    actionRow.className = "action-row";

    const viewButton = createButton("view-button", slugUrl(item.id), "Lihat Brosur");
    const downloadButton = createButton("download-button", item.download, "Download");
    downloadButton.setAttribute("download", "");

    actionRow.appendChild(viewButton);
    actionRow.appendChild(downloadButton);

    info.appendChild(title);
    info.appendChild(desc);
    info.appendChild(actionRow);

    card.appendChild(coverLink);
    card.appendChild(info);

    grid.appendChild(card);

    renderCover(item.cover, canvas, loading);
  });
}

renderBrochures();

