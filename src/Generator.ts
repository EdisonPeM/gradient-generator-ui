import { colorPos } from './Types';
import { initialGradientColors } from './Constants';

import { ColorControl } from './ColorControl';
import { createGradient } from './ColorUtils';
import { GeneratorManager } from './Manager';

import './scss/gradientContainer.scss';

export class GradientGenerator {
  private gradientControls: ColorControl[] = [];

  constructor(
    private mainElement: HTMLElement,
    initialColors: colorPos[] = initialGradientColors
  ) {
    if (!mainElement) throw new Error('Root element must be provided');

    // Config Main Element
    mainElement.classList.add('gg-container');
    if (mainElement.childElementCount > 0) {
      Array.from(mainElement.children).forEach((node: Element) => {
        mainElement.removeChild(node);
      });
    }

    // Create Initial Color Controls
    initialColors.forEach((obj: colorPos) => {
      this.addElement(obj);
    });

    this.changeGradientBg();
  }

  public getGradientColors() {
    return this.gradientControls.map(
      (cc: ColorControl): colorPos => ({
        colorHex: cc.ColorHex,
        position: cc.Position,
      })
    );
  }

  public addElement(obj: colorPos, indx = -1) {
    const newControl: ColorControl = new ColorControl(obj);
    const newElement = newControl.Element;

    if (this.gradientControls[indx]) {
      const nextElement = this.gradientControls[indx].Element;

      this.mainElement.insertBefore(newElement, nextElement);
      this.gradientControls.splice(indx, 0, newControl);
    } else {
      this.mainElement.appendChild(newElement);
      this.gradientControls.push(newControl);
    }

    // Add listeners
    newControl.onDelete(() => {
      this.gradientControls = this.gradientControls.filter(
        els => els !== newControl
      );
      this.changeGradientBg();
    });

    newControl.onPositionChange(() => {
      this.updatePositionsLimits();
      this.changeGradientBg();
    });

    newControl.onColorChange(() => {
      this.changeGradientBg();
    });
  }

  private changeGradientBg() {
    if (this.gradientControls.length > 0) {
      const intermediateColors = this.gradientControls
        .map(gc => `${gc.ColorHex} ${gc.Position}%`)
        .join();

      this.mainElement.style.background = `
        linear-gradient(to right, 
          #000000 0%,
          ${intermediateColors},
          #ffffff 100%
        )
      `;
    } else {
      this.mainElement.style.background = `
        linear-gradient(to right, #000000, #ffffff)
      `;
    }
  }

  private updatePositionsLimits() {
    let minlimit = 0;
    let maxlimit = 100;
    this.gradientControls.forEach((gc, indx) => {
      const hasNext = indx + 1 !== this.gradientControls.length;
      if (hasNext) {
        const nextgc = this.gradientControls[indx + 1];
        maxlimit = nextgc.Position;
      } else {
        maxlimit = 100;
      }

      gc.setPositionLimits(minlimit, maxlimit);
      minlimit = gc.Position;
    });
  }

  public generateColors(size: number = 100): string[] {
    const colors: colorPos[] = [
      {
        colorHex: '#000000',
        position: 0,
      },
      ...this.getGradientColors(),
      {
        colorHex: '#ffffff',
        position: 100,
      },
    ];

    return createGradient(colors, size);
  }

  public createManager(): GeneratorManager {
    const Manager = new GeneratorManager(this);
    return Manager;
  }
}
