import { colorPos } from '../Types';
import { ColorControl } from './ColorControl';

const initialGradientColors: colorPos[] = [
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

export class GradientUI {
  private gradientControls: ColorControl[] = [];

  constructor(
    private mainElement: HTMLElement,
    initialColors: colorPos[] = initialGradientColors
  ) {
    this.init(initialColors);
  }

  /**
   * Initialize the UI creating the controls for each color in the list
   * @param initialColors List of colors with their respective proportional position
   */
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

  /**
   * Get the list of color controls in the UI
   */
  public getGradientControls(): ColorControl[] {
    return this.gradientControls;
  }

  /**
   * Add a new color control and add their respective listeners
   * @param color A single colors with their respective proportional position
   * @param indx Optional position to append in the UI
   */
  public addElement(color: colorPos, indx = -1) {
    const newControl: ColorControl = new ColorControl(color);
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

  /**
   * Change the background gradient respect to the color controls
   */
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

  /**
   * Update the position limits for each color control with respect to the others
   */
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
