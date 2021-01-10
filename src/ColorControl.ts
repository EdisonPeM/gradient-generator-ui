import { colorPos } from './Types';
import { getCorrectTextColor } from './ColorUtils';

import './scss/gradientControl.scss';

const e = document.createElement.bind(document);

export class ColorControl {
  private mainElement: HTMLElement;
  private deleteEl: HTMLElement;
  private positionEl: HTMLInputElement;
  private valueEl: HTMLInputElement;

  constructor(obj: colorPos) {
    // Create main element
    this.mainElement = e('div');
    this.mainElement.className = 'gg-control';

    // Create delete button
    this.deleteEl = e('button');
    this.deleteEl.className = 'gg-control-delete';
    this.deleteEl.innerHTML = '&times;';

    this.deleteEl.addEventListener('click', () => {
      this.mainElement.remove();
    });

    // Create position range input
    this.positionEl = e('input');
    this.positionEl.className = 'gg-control-position';
    this.positionEl.type = 'range';
    this.positionEl.step = '1';
    this.positionEl.min = '0';
    this.positionEl.max = '100';
    this.positionEl.dataset.min = '0';
    this.positionEl.dataset.max = '100';
    this.positionEl.defaultValue = obj.position.toString();

    this.positionEl.addEventListener('input', function (ev) {
      if (this.dataset.min && +this.value < +this.dataset.min)
        this.value = this.dataset.min;

      if (this.dataset.max && +this.value > +this.dataset.max)
        this.value = this.dataset.max;
    });
    this.positionEl.addEventListener('input', () => {
      this.changePosition();
    });
    window.addEventListener('resize', () => {
      this.changePosition();
    });

    // Create value color input
    this.valueEl = e('input');
    this.valueEl.className = 'gg-control-value';
    this.valueEl.type = 'color';
    this.valueEl.value = obj.colorHex;
    this.valueEl.addEventListener('input', () => {
      this.changeBg();
    });

    // Config First View
    setTimeout(() => {
      // Add sub elements to main Element
      this.mainElement.appendChild(this.deleteEl);
      this.mainElement.appendChild(this.positionEl);
      this.mainElement.appendChild(this.valueEl);

      // Update Element view
      this.changePosition();
      this.changeBg();
    });
  }

  // Inherit Actions
  private changePosition() {
    const pos = this.positionEl.valueAsNumber;
    const totalLenght = this.positionEl.clientWidth;
    const left = `${((totalLenght - 15) * pos) / 100 + 15 / 2}px`;

    this.deleteEl.style.setProperty('--pos-left', left);
    this.valueEl.style.setProperty('--pos-left', left);
  }

  private changeBg() {
    const color = this.valueEl.value;

    this.deleteEl.style.setProperty('--gb-color', color);
    this.deleteEl.style.setProperty('--color', getCorrectTextColor(color));

    this.positionEl.style.setProperty('--gb-color', color);
    this.positionEl.style.setProperty('--color', getCorrectTextColor(color));
  }

  // Getters
  public get Element(): HTMLElement {
    return this.mainElement;
  }

  public get ColorHex(): string {
    return this.valueEl.value;
  }

  public get Position(): number {
    return this.positionEl.valueAsNumber;
  }

  // Events
  public onDelete(cb: Function) {
    this.deleteEl.onclick = (ev: MouseEvent) => cb(ev);
  }

  public onPositionChange(cb: Function) {
    this.positionEl.oninput = (ev: Event) => cb(ev);
  }

  public onColorChange(cb: Function) {
    this.valueEl.oninput = (ev: Event) => cb(ev);
  }

  // Add limits
  public setPositionLimits(minlimit: number, maxlimit: number) {
    this.positionEl.dataset.min = minlimit.toString();
    this.positionEl.dataset.max = maxlimit.toString();
  }
}
