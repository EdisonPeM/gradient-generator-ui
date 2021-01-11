import { colorPos } from '../Types';
import { createGradient } from '../ColorUtils';

import { GradientUI } from './GradientUI';
import { ColorControl } from './ColorControl';
import { GeneratorManager, ManagerOptions } from './Manager';

const initialGradientColors: colorPos[] = [
  { colorHex: '#ff0000', position: 10 },
  { colorHex: '#ffff00', position: 40 },
  { colorHex: '#00ff77', position: 70 },
];

export class GradientGenerator {
  private UI: GradientUI | null = null;
  private mainElement: HTMLElement | null = null;
  private colors: colorPos[];

  constructor({
    mainElement,
    initialColors = initialGradientColors,
  }: {
    mainElement?: HTMLElement;
    initialColors: colorPos[];
  }) {
    if (mainElement) {
      this.mainElement = mainElement;
      this.UI = new GradientUI(mainElement, initialColors);
      this.UI.onUpdateControls((controls: ColorControl[]) => {
        this.colors = controls.map(ctrl => ({
          colorHex: ctrl.ColorHex,
          position: ctrl.Position,
        }));
      });
    }

    this.colors = initialColors;
  }

  /**
   * Get the HTML Main Element
   */
  public getMainElement(): HTMLElement {
    if (!this.mainElement) {
      throw new Error('There is no main element in the generator');
    }

    return this.mainElement;
  }

  /**
   * Get the list of colors with their respective proportional position
   */
  public getGradientColors(): colorPos[] {
    return [...this.colors];
  }

  /**
   * Update the current list of colors
   * @param colors List of colors with their respective proportional position
   */
  public setGradientColors(colors: colorPos[]) {
    this.colors = [...colors];
    if (this.UI) this.UI.init(colors);
  }

  /**
   * Add a new color to the current list of colors and create a new color control in the UI
   * @param color A single colors with their respective proportional position
   * @param indx Optional position to append in the GradientGenerator
   */
  public addColors(...newColors: colorPos[]) {
    newColors.forEach(newColor => {
      const indx = this.colors.findIndex(gc => gc.position > newColor.position);
      if (indx > -1) {
        this.colors.splice(indx, 0, newColor);
      } else {
        this.colors.push(newColor);
      }

      if (this.UI) this.UI.addElement(newColor);
    });
  }

  /**
   * Generates an array of colors in hexadecimal with the current colors and the number of expected colors
   * @param size Expected number of colors generated
   */
  public generateColors(size: number = 100): string[] {
    const colors: colorPos[] = [
      {
        colorHex: '#000000',
        position: 0,
      },
      ...this.colors,
      {
        colorHex: '#ffffff',
        position: 100,
      },
    ];

    return createGradient(colors, size);
  }

  /**
   * Generate a manager with the current GradientGenerator
   * @param options Manager options
   */
  public createUIManager(options: ManagerOptions): GeneratorManager {
    return new GeneratorManager({
      ...options,
      generator: this,
    });
  }
}
