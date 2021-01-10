import { colorPos } from '../Types';
import { getIntermediateColor } from '../ColorUtils';

import { GradientGenerator } from './Generator';

export type ManagerOptions = {
  keepChanges?: boolean;
};

export class GeneratorManager {
  private addMode: boolean = false;
  private cacheGradientColors: colorPos[] = [];
  private options: ManagerOptions = { keepChanges: true };

  constructor(private generator: GradientGenerator, options?: ManagerOptions) {
    if (!generator) throw new Error('A Gradient Generator must be provided');
    this.options = { ...this.options, ...options };

    const mainElement = this.generator.getMainElement();
    this.cacheGradientColors = this.generator.getGradientColors();

    // Event to add new element
    mainElement.addEventListener('click', (ev: MouseEvent) => {
      if (this.addMode) {
        const gradientColors = this.generator.getGradientColors();

        const cantColors = gradientColors.length;
        const newPosition = (ev.offsetX * 100) / mainElement.clientWidth;
        const indx = gradientColors.findIndex(gc => gc.position > newPosition);

        let color1 = '#000000';
        let color2 = '#ffffff';
        if (cantColors > 0) {
          if (indx < 0) {
            color1 = gradientColors[cantColors - 1].colorHex;
          } else if (indx === 0) {
            color2 = gradientColors[0].colorHex;
          } else {
            color1 = gradientColors[indx - 1].colorHex;
            color2 = gradientColors[indx].colorHex;
          }
        }

        const newColorPos: colorPos = {
          colorHex: getIntermediateColor(color1, color2),
          position: newPosition,
        };

        generator.append(newColorPos, indx);
        this.cancelAddMode();
        if (this.options.keepChanges) {
          this.cacheGradientColors = gradientColors;
        }
      }
    });
  }

  /**
   * Activates the mode of adding new colors on click over the gradient generator main element
   */
  public setAddMode() {
    this.addMode = true;
    const mainElement = this.generator.getMainElement();
    mainElement.classList.add('gg-add');
  }

  /**
   * Cancel the mode of adding new colors on the main element of the generator
   */
  public cancelAddMode() {
    this.addMode = false;
    const mainElement = this.generator.getMainElement();
    mainElement.classList.remove('gg-add');
  }

  /**
   * Save the changes and new colors when keepChanges option is false
   */
  public saveColors() {
    this.cancelAddMode();

    if (!this.options.keepChanges) {
      this.cacheGradientColors = this.generator.getGradientColors();
    }
  }

  /**
   * Delete changes and new colors when keep changes option is false
   */
  public restoreColors() {
    this.cancelAddMode();

    if (!this.options.keepChanges) {
      this.generator.setGradientColors(this.cacheGradientColors);
    }
  }
}
