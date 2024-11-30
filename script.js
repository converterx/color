document.getElementById("hex").addEventListener("input", function () {
  const hex = this.value;
  if (isValidHex(hex)) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById("rgb").value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    document.getElementById("hsl").value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    updatePreview(hex);
  }
});

document.getElementById("rgb").addEventListener("input", function () {
  const rgb = this.value.split(",").map(Number);
  if (rgb.length === 3 && isValidRgb(rgb)) {
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    document.getElementById("hex").value = hex;
    document.getElementById("hsl").value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    updatePreview(hex);
  }
});

document.getElementById("hsl").addEventListener("input", function () {
  const hsl = this.value.split(",").map((x, i) => (i === 0 ? parseInt(x) : parseFloat(x)));
  if (hsl.length === 3 && isValidHsl(hsl)) {
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    document.getElementById("hex").value = hex;
    document.getElementById("rgb").value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    updatePreview(hex);
  }
});

function updatePreview(hex) {
  document.getElementById("color-preview").style.backgroundColor = hex;
}

function isValidHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

function isValidRgb(rgb) {
  return rgb.every((x) => x >= 0 && x <= 255);
}

function isValidHsl(hsl) {
  return hsl[0] >= 0 && hsl[0] <= 360 && hsl[1] >= 0 && hsl[1] <= 100 && hsl[2] >= 0 && hsl[2] <= 100;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  return {
    r: Math.round(255 * (l - a * Math.max(-1, Math.min(k(0) - 3, Math.min(9 - k(0), 1))))),
    g: Math.round(255 * (l - a * Math.max(-1, Math.min(k(8) - 3, Math.min(9 - k(8), 1))))),
    b: Math.round(255 * (l - a * Math.max(-1, Math.min(k(4) - 3, Math.min(9 - k(4), 1)))))
  };
}
