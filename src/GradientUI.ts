import { ColorControl } from './ColorControl';
import { initialGradientColors } from './Constants';
import { colorPos } from './Types';

export class GradientUI {
  private gradientControls: ColorControl[] = [];

  constructor(
    private mainElement: HTMLElement,
    initialColors: colorPos[] = initialGradientColors
  ) {
    this.init(initialColors);
  }

  public init(initialColors: colorPos[]) {
    // Config Main Element
    this.mainElement.classList.add('gg-container');
    if (this.mainElement.childElementCount > 0) {
      Array.from(this.mainElement.children).forEach((node: Element) => {
        this.mainElement.removeChild(node);
      });
    }

    // Initialize the list of controls;
    this.gradientControls = [];

    // Append Initial Color Controls
    initialColors.forEach((obj: colorPos) => {
      this.addElement(obj);
    });
  }

  public getGradientControls() {
    return this.gradientControls;
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

    this.changeGradientBg();
  }

  public changeGradientBg() {
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

  public updatePositionsLimits() {
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
}
