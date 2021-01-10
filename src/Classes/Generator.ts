import { colorPos } from '../Types';
import { createGradient } from '../ColorUtils';

import { GradientUI } from './GradientUI';
import { ColorControl } from './ColorControl';
import { GeneratorManager, ManagerOptions } from './Manager';

export class GradientGenerator {
  private UI: GradientUI;

  constructor(private mainElement: HTMLElement, initialColors?: colorPos[]) {
    if (!mainElement) throw new Error('Root element must be provided');
    this.UI = new GradientUI(mainElement, initialColors);
  }

  /**
   * Get the HTML Main Element
   */
  public getMainElement(): HTMLElement {
    return this.mainElement;
  }

  /**
   * Get the list of colors with their respective proportional position
   */
  public getGradientColors(): colorPos[] {
    const gradientControls = this.UI.getGradientControls();
    return gradientControls.map(
      (cc: ColorControl): colorPos => ({
        colorHex: cc.ColorHex,
        position: cc.Position,
      })
    );
  }

  /**
   * Update the current list of colors
   * @param colors List of colors with their respective proportional position
   */
  public setGradientColors(colors: colorPos[]) {
    this.UI.init(colors);
  }

  /**
   * Add a new color to the current list of colors and create a new color control in the UI
   * @param color A single colors with their respective proportional position
   * @param indx Optional position to append in the GradientGenerator
   */
  public append(color: colorPos, indx = -1) {
    this.UI.addElement(color, indx);
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
      ...this.getGradientColors(),
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
  public createManager(options: ManagerOptions): GeneratorManager {
    return new GeneratorManager(this, options);
  }
}
