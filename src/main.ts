declare global {
  interface Window {
    sliceImage: () => void;
    drawGrid: () => void;
    download: () => void;
  }
}

let loadedImage: HTMLImageElement | null = null;
const imageInput = document.getElementById("imageInput") as HTMLInputElement;
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const hiddenCanvas = document.getElementById(
  "hiddenCanvas"
) as HTMLCanvasElement;
const sliceWidthInput = document.getElementById(
  "sliceWidth"
) as HTMLInputElement;
const sliceHeightInput = document.getElementById(
  "sliceHeight"
) as HTMLInputElement;
const preview = document.getElementById("preview") as HTMLDivElement;

imageInput.addEventListener("change", function (event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  console.log("🚀 ~ file:", file)

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      loadedImage = img;
      drawGrid(); // Draw grid immediately
    };

    if (typeof e.target?.result == "string") {
      img.src = e.target?.result;
    }
  };
  reader.readAsDataURL(file);
});

function drawGrid() {
  if (!loadedImage) return;

  const sliceW = parseInt(sliceWidthInput.value);
  const sliceH = parseInt(sliceHeightInput.value);

  gridCanvas.width = loadedImage.width;
  gridCanvas.height = loadedImage.height;

  const ctx = gridCanvas.getContext("2d");

  if (!ctx) return;

  ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  ctx.drawImage(loadedImage, 0, 0);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;

  const cols = Math.ceil(loadedImage.width / sliceW);
  const rows = Math.ceil(loadedImage.height / sliceH);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.strokeRect(x * sliceW, y * sliceH, sliceW, sliceH);
    }
  }
}

function sliceImage() {
  if (!loadedImage) {
    alert("Please select an image first.");
    return;
  }

  const sliceW = parseInt(sliceWidthInput.value);
  const sliceH = parseInt(sliceHeightInput.value);
  const canvas = hiddenCanvas;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  preview.innerHTML = "";

  const cols = Math.ceil(loadedImage.width / sliceW);
  const rows = Math.ceil(loadedImage.height / sliceH);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const w = Math.min(sliceW, loadedImage.width - x * sliceW);
      const h = Math.min(sliceH, loadedImage.height - y * sliceH);

      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(loadedImage, x * sliceW, y * sliceH, w, h, 0, 0, w, h);

      const dataUrl = canvas.toDataURL();

      const div = document.createElement("div");
      div.className = "slice-container";

      const imgElem = document.createElement("img");
      imgElem.src = dataUrl;
      imgElem.width = 100;

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `slice_${x}_${y}.png`;

      div.appendChild(imgElem);
      div.appendChild(a);
      preview.appendChild(div);
    }
  }
}

function download() {
  document.querySelectorAll<HTMLLinkElement>('#preview a').forEach((a) => {
    a.click();
  })
}

window.sliceImage = sliceImage; // Expose the function to the global scope
window.drawGrid = drawGrid; // Expose the function to the global scope
window.download = download; // Expose the function to the global scope