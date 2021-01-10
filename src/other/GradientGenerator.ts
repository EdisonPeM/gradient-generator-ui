import { getIntermediateColor, hexToRGb, rgbToHex } from '../ColorUtils';
import { colorPos, colorRGB } from '../Types';
import ColorControl from './ColorControl';

import './styles.scss';

export class GradientGenerator {
  gradientColors: ColorControl[] = [];
  insertColor = false;

  cacheGradient: colorPos[] = [];
  initialGradient: colorPos[] = [
    {
      colorHex: '#ff0000',
      position: 10,
    },
    {
      colorHex: '#ffff00',
      position: 40,
    },
    {
      colorHex: '#00ff77',
      position: 70,
    },
  ];

  constructor(private mainElement: HTMLElement) {
    if (!mainElement) throw new Error('Root element must be provided');
    this.init();

    // Event Handler to Add New Color
    mainElement.addEventListener('click', (ev: MouseEvent) => {
      if (this.insertColor) {
        let cantColors = this.gradientColors.length;

        let totalLenght = mainElement.clientWidth;
        let newPosition = (ev.offsetX * 100) / totalLenght;

        let indx = this.gradientColors.findIndex(
          gc => gc.getPosition() > newPosition
        );
        // indx = (indx === -1) ? cantColors : indx;

        let color1 = '#000000';
        let color2 = '#ffffff';

        if (cantColors > 0) {
          if (indx < 0) {
            color1 = this.gradientColors[cantColors - 1].getColor();
          } else if (indx === 0) {
            color2 = this.gradientColors[0].getColor();
          } else {
            color1 = this.gradientColors[indx - 1].getColor();
            color2 = this.gradientColors[indx].getColor();
          }
        }

        let newColor = getIntermediateColor(color1, color2);

        this.addElement(
          {
            colorHex: newColor,
            position: newPosition,
          },
          indx
        );

        this.changeGradientBg();

        this.mainElement.classList.remove('add-new');
        this.insertColor = false;
      }
    });
  }

  init(colorsToGradient = this.initialGradient) {
    this.gradientColors = [];
    this.mainElement.innerHTML = '';
    colorsToGradient.forEach((obj: colorPos) => {
      this.addElement(obj);
    });
    this.changeGradientBg();
    this.saveCache();
  }

  addElement(obj: colorPos, indx = -1) {
    let colorEl: ColorControl = new ColorControl(obj);

    let newElement = colorEl.getElement();

    if (this.gradientColors[indx]) {
      let nextElement = this.gradientColors[indx].getElement();
      this.mainElement.insertBefore(newElement, nextElement);
      this.gradientColors.splice(indx, 0, colorEl);
    } else {
      this.mainElement.appendChild(newElement);
      this.gradientColors.push(colorEl);
    }

    this.configListeners(colorEl);
    // Update Element view
    colorEl.changePosition();
  }

  configListeners(gc: ColorControl) {
    gc.setDeleteClick(() => {
      this.gradientColors = this.gradientColors.filter(els => els !== gc);
      this.changeGradientBg();
    });

    gc.setPositionInput(() => {
      this.updatePositionsLimits();
      this.changeGradientBg();
    });

    gc.setValueInput(() => {
      this.changeGradientBg();
    });
  }

  changeGradientBg() {
    let gcs = this.gradientColors;
    this.mainElement.style.border = '1px solid #aaa';
    this.mainElement.style.background = `
        linear-gradient(to right, 
            #000000 0%,
            ${
              gcs.length > 0
                ? gcs
                    .map(gc => `${gc.getColor()} ${gc.getPosition()}%`)
                    .join(',') + ','
                : ''
            }
            #ffffff 100%
        )`;
  }

  updatePositionsLimits() {
    let minlimit = 0;
    let maxlimit = 100;

    this.gradientColors.forEach((gc, indx) => {
      let hasNext = indx + 1 !== this.gradientColors.length;

      if (hasNext) {
        let nextgc = this.gradientColors[indx + 1];
        maxlimit = nextgc.getPosition();
      } else {
        maxlimit = 100;
      }

      gc.setPositionLimits(minlimit, maxlimit);
      minlimit = gc.getPosition();
    });
  }

  // ----------------------------------------------------
  // ----------------------------------------------------
  // ----------------------------------------------------
  updateAllPositions() {
    this.gradientColors.forEach(c => c.changePosition());
  }

  saveCache() {
    this.cacheGradient = this.gradientColors.map(el => {
      return {
        colorHex: el.getColor(),
        position: el.getPosition(),
      };
    });
  }

  addNewColor() {
    this.insertColor = true;
    this.mainElement.classList.add('add-new');
  }

  cancelNewColors() {
    this.insertColor = false;
    this.mainElement.classList.remove('add-new');

    this.init(this.cacheGradient);
  }

  acceptChangedColors() {
    this.insertColor = false;
    this.mainElement.classList.remove('add-new');
    this.saveCache();
  }

  createGradiant(size = 100) {
    let colors = [
      {
        color: '#000000',
        position: 0,
      },
      ...this.gradientColors.map(gc => {
        return {
          color: gc.getColor(),
          position: gc.getPosition(),
        };
      }),
      {
        color: '#ffffff',
        position: 100,
      },
    ];

    let response = [];
    for (let i = 0; i < colors.length - 1; i++) {
      const color1 = colors[i];
      const color2 = colors[i + 1];

      let cantSubColors = (size * (color2.position - color1.position)) / 100;

      if (cantSubColors > 0) {
        if (i === 0) response.push(color1.color);

        let color1RGB: colorRGB = hexToRGb(color1.color);
        let color2RGB: colorRGB = hexToRGb(color2.color);

        let deltaRGB = {
          r: (color2RGB.r - color1RGB.r) / cantSubColors,
          g: (color2RGB.g - color1RGB.g) / cantSubColors,
          b: (color2RGB.b - color1RGB.b) / cantSubColors,
        };

        for (let sc = 1; sc <= cantSubColors; sc++) {
          let nextColor = {
            r: color1RGB.r + sc * deltaRGB.r,
            g: color1RGB.g + sc * deltaRGB.g,
            b: color1RGB.b + sc * deltaRGB.b,
          };
          response.push(rgbToHex(nextColor));
        }

        response.push(color2.color);
      }
    }

    return response;
  }
}

export default GradientGenerator;
