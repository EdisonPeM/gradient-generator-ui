import { colorPos, colorRGB } from './Types';

/**
 * Normalize the hexadecimal color Separate the head (#) and transform 3digits to 6
 * @param hex String of Color in hexadecimal format
 */
export function normalizeHex(hex: string): string {
  const match7 = hex.match(/\w{6}$/);
  if (match7 !== null) {
    return match7[0];
  }

  const match4 = hex.match(/\w{3}$/);
  if (match4) {
    return match4[0]
      .split('')
      .map(n => n.repeat(2))
      .join('');
  }

  return hex;
}

/**
 * Transform an color string in hexadecimal to a rgb object
 * @param hex String of Color in hexadecimal format
 */
export function hexToRGb(hex: string): colorRGB {
  return {
    r: parseInt(normalizeHex(hex).substring(0, 2), 16),
    g: parseInt(normalizeHex(hex).substring(2, 4), 16),
    b: parseInt(normalizeHex(hex).substring(4, 6), 16),
  };
}

/**
 * Transform an rgb object to a color string in hexadecimal
 * @param rgb object that represents a color in RGB
 */
export function rgbToHex(rgb: colorRGB): string {
  let r = rgb.r.toString(16);
  let g = rgb.g.toString(16);
  let b = rgb.b.toString(16);

  if (r.length == 1) r = `0${r}`;
  if (g.length == 1) g = `0${g}`;
  if (b.length == 1) b = `0${b}`;

  return `#${r}${g}${b}`;
}

/**
 * Calculate the intermediate color between two colors
 * @param hex1 String of first Color in hexadecimal format
 * @param hex2 String of second Color in hexadecimal format
 */
export function getIntermediateColor(hex1: string, hex2: string): string {
  const rgb1 = hexToRGb(hex1);
  const rgb2 = hexToRGb(hex2);

  const newRGB = {
    r: Math.round((rgb2.r + rgb1.r) / 2),
    g: Math.round((rgb2.g + rgb1.g) / 2),
    b: Math.round((rgb2.b + rgb1.b) / 2),
  };

  return rgbToHex(newRGB);
}

/**
 * Get a correct text color according to the contrast
 * @param hex String of the base Color in hexadecimal format
 */
export function getCorrectTextColor(hex: string): string {
  // https://codepen.io/davidhalford/pen/ywEva?editors=0010
  /* about half of 256. Lower threshold equals more dark text on dark background  */
  const threshold = 130;

  const { r, g, b } = hexToRGb(hex);

  const cBrightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (cBrightness > threshold) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}

/**
 * Generates an array of colors in hexadecimal format based on the base color list and the number of expected colors
 * @param gradientColors List of colors with their respective proportional position
 * @param size Expected number of colors generated
 */
export function createGradient(
  gradientColors: colorPos[],
  size: number = 100
): string[] {
  const response = [];
  for (let i = 0; i < gradientColors.length - 1; i++) {
    const color1 = gradientColors[i];
    const color2 = gradientColors[i + 1];

    const cantSubColors = (color2.position - color1.position) * (size / 100);

    if (cantSubColors > 0) {
      if (i === 0) response.push(`#${normalizeHex(color1.colorHex)}`);

      const color1RGB: colorRGB = hexToRGb(color1.colorHex);
      const color2RGB: colorRGB = hexToRGb(color2.colorHex);

      const deltaRGB = {
        r: Math.trunc((color2RGB.r - color1RGB.r) / cantSubColors),
        g: Math.trunc((color2RGB.g - color1RGB.g) / cantSubColors),
        b: Math.trunc((color2RGB.b - color1RGB.b) / cantSubColors),
      };

      for (let sc = 1; sc < cantSubColors; sc++) {
        const nextColorRGB: colorRGB = {
          r: Math.trunc(color1RGB.r + sc * deltaRGB.r),
          g: Math.trunc(color1RGB.g + sc * deltaRGB.g),
          b: Math.trunc(color1RGB.b + sc * deltaRGB.b),
        };

        const nextColor = rgbToHex(nextColorRGB);

        if (nextColor.length === 7) {
          response.push(nextColor);
        }
      }

      response.push(`#${normalizeHex(color2.colorHex)}`);
    }
  }

  return response;
}
