import { colorPos } from '../Types';
import { ColorControl } from './ColorControl';

export class GradientUI {
  private gradientControls: ColorControl[] = [];
  private observers: Array<(ctrls: ColorControl[]) => void> = [];

  constructor(private mainElement: HTMLElement, initialColors: colorPos[]) {
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
   * Add an event listener when any color control change it values
   * @param cb Callback
   */
  onUpdateControls(cb: (ctrls: ColorControl[]) => void) {
    this.observers.push(cb);
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
  public addElement(newColor: colorPos) {
    const newControl: ColorControl = new ColorControl(newColor);
    const newElement = newControl.Element;

    const indx = this.gradientControls.findIndex(
      gc => gc.Position > newColor.position
    );

    if (indx > -1) {
      const nextControl = this.gradientControls[indx];
      this.mainElement.insertBefore(newElement, nextControl.Element);
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

      this.observers.forEach(obs => obs(this.gradientControls));
    });

    newControl.onPositionChange(() => {
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

      this.observers.forEach(obs => obs(this.gradientControls));
      this.changeGradientBg();
    });

    newControl.onColorChange(() => {
      this.observers.forEach(obs => obs(this.gradientControls));
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
}
