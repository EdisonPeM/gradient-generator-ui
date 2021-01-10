import { colorPos } from './Types';

import { ColorControl } from './ColorControl';
import { createGradient } from './ColorUtils';
import { GeneratorManager, ManagerOptions } from './Manager';
import { GradientUI } from './GradientUI';

export class GradientGenerator {
  private UI: GradientUI;

  constructor(private mainElement: HTMLElement) {
    if (!mainElement) throw new Error('Root element must be provided');
    this.UI = new GradientUI(mainElement);
  }

  public getMainElement(): HTMLElement {
    return this.mainElement;
  }

  public getGradientColors(): colorPos[] {
    const gradientControls = this.UI.getGradientControls();
    return gradientControls.map(
      (cc: ColorControl): colorPos => ({
        colorHex: cc.ColorHex,
        position: cc.Position,
      })
    );
  }

  public setGradientColors(colors: colorPos[]) {
    this.UI.init(colors);
  }

  public append(color: colorPos, indx = -1) {
    this.UI.addElement(color, indx);
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

  public createManager(options: ManagerOptions): GeneratorManager {
    return new GeneratorManager(this, options);
  }
}
