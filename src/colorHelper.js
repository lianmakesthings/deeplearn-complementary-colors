const randomRGBValue = () => {
    return Math.floor(Math.random() * 256);
};

const randomColorArray = () => {
    return [randomRGBValue(), randomRGBValue(), randomRGBValue()];
};

/**
 * This implementation of computing the complementary color came from an
 * answer by Edd https://stackoverflow.com/a/37657940
 */
const computeComplementaryColor = rgbColor => {
    let r = rgbColor[0];
    let g = rgbColor[1];
    let b = rgbColor[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2.0;
    let s = h;
    const l = h;

    if (max === min) {
        h = s = 0;  // achromatic
    } else {
        const d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if (max === r && g >= b) {
            h = 1.0472 * (g - b) / d;
        } else if (max === r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if (max === g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if (max === b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h += 180;
    if (h > 360) {
        h -= 360;
    }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if (s === 0) {
        r = g = b = l;  // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b].map(v => Math.round(v * 255));
};

export default {
    randomColorArray,
    computeComplementaryColor
};