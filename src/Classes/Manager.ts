import { colorPos } from '../Types';
import { getIntermediateColor } from '../ColorUtils';

import { GradientGenerator } from './Generator';

export type ManagerOptions = {
  generator: GradientGenerator;
  keepChanges?: boolean;
};

export class GeneratorManager {
  private generator: GradientGenerator;
  private addMode: boolean = false;
  private cacheGradientColors: colorPos[] = [];
  private keepChanges: boolean;

  constructor({ generator, keepChanges = true }: ManagerOptions) {
    if (!generator) throw new Error('A Gradient Generator must be provided');
    this.generator = generator;
    this.keepChanges = keepChanges;

    const mainElement = this.generator.getMainElement();
    this.cacheGradientColors = this.generator.getGradientColors();

    // Event to add new element
    mainElement.addEventListener('click', (ev: MouseEvent) => {
      if (this.addMode) {
        const gradientColors: colorPos[] = [
          { colorHex: '#000000', position: 0 },
          ...this.generator.getGradientColors(),
          { colorHex: '#ffffff', position: 100 },
        ];

        const newPosition = (ev.offsetX * 100) / mainElement.clientWidth;
        const indx = gradientColors.findIndex(gc => gc.position > newPosition);

        const color1 = gradientColors[indx - 1].colorHex;
        const color2 = gradientColors[indx].colorHex;

        generator.addColors({
          colorHex: getIntermediateColor(color1, color2),
          position: newPosition,
        });

        this.cancelAddMode();
        if (this.keepChanges) {
          this.cacheGradientColors = this.generator.getGradientColors();
        }
      }
    });
  }

  /**
   * Activates the mode of adding new colors on click over the gradient generator main element
   */
  public activateAddMode() {
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

    if (!this.keepChanges) {
      this.cacheGradientColors = this.generator.getGradientColors();
    }
  }

  /**
   * Delete changes and new colors when keep changes option is false
   */
  public restoreColors() {
    this.cancelAddMode();

    if (!this.keepChanges) {
      this.generator.setGradientColors(this.cacheGradientColors);
    }
  }
}
