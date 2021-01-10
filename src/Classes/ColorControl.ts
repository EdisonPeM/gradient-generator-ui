import { colorPos } from '../Types';
import { getCorrectTextColor } from '../ColorUtils';

const e = document.createElement.bind(document);

/**
 * Helper to ceate the delete button of the color control
 */
function createDeleteControl(): HTMLElement {
  const deleteEl = e('button');
  deleteEl.className = 'gg-control-delete';
  deleteEl.innerHTML = '&times;';
  return deleteEl;
}

/**
 * Helper to ceate the position input of the color control
 */
function createPositionControl(defaultValue: string): HTMLInputElement {
  const positionEl = e('input');
  positionEl.className = 'gg-control-position';
  positionEl.type = 'range';
  positionEl.step = '1';
  positionEl.min = '0';
  positionEl.max = '100';
  positionEl.dataset.min = '0';
  positionEl.dataset.max = '100';
  positionEl.defaultValue = defaultValue;
  return positionEl;
}

/**
 * Helper to ceate the color value input of the color control
 */
function createValueControl(defaultValue: string): HTMLInputElement {
  const valueEl = e('input');
  valueEl.className = 'gg-control-value';
  valueEl.type = 'color';
  valueEl.defaultValue = defaultValue;
  return valueEl;
}

export class ColorControl {
  private mainElement: HTMLElement;
  private deleteEl: HTMLElement;
  private positionEl: HTMLInputElement;
  private valueEl: HTMLInputElement;

  constructor(color: colorPos) {
    // Create main element
    this.mainElement = e('div');
    this.mainElement.className = 'gg-control';

    // Create delete button
    this.deleteEl = createDeleteControl();
    // Create value color input
    this.valueEl = createValueControl(color.colorHex);
    // Create position range input
    this.positionEl = createPositionControl(color.position.toString());
    this.positionEl.addEventListener('input', function (ev) {
      if (this.dataset.min && this.valueAsNumber < +this.dataset.min)
        this.value = this.dataset.min;

      if (this.dataset.max && this.valueAsNumber > +this.dataset.max)
        this.value = this.dataset.max;
    });

    // Add Basic Listeners
    this.onDelete(() => this.mainElement.remove());
    this.onColorChange(() => this.changeBg());
    this.onPositionChange(() => this.changePosition());
    window.addEventListener('resize', () => this.changePosition());

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

  /**
   * Get the main element for this control
   */
  public get Element(): HTMLElement {
    return this.mainElement;
  }

  /**
   * Get the color selected in hexadecimal format
   */
  public get ColorHex(): string {
    return this.valueEl.value;
  }

  /**
   * Get the proportional position of this control
   */
  public get Position(): number {
    return this.positionEl.valueAsNumber;
  }

  /**
   * Update the position of the delete and value inputs
   */
  private changePosition() {
    const pos = this.positionEl.valueAsNumber;
    const totalLenght = this.positionEl.clientWidth;
    const left = `${((totalLenght - 15) * pos) / 100 + 15 / 2}px`;

    this.deleteEl.style.setProperty('--pos-left', left);
    this.valueEl.style.setProperty('--pos-left', left);
  }

  /**
   * Change the background color with respect the value input
   */
  private changeBg() {
    const color = this.valueEl.value;

    this.deleteEl.style.setProperty('--gb-color', color);
    this.deleteEl.style.setProperty('--color', getCorrectTextColor(color));

    this.positionEl.style.setProperty('--gb-color', color);
    this.positionEl.style.setProperty('--color', getCorrectTextColor(color));
  }

  /**
   * Add an event listener when delete element
   * @param cb Callback
   */
  public onDelete(cb: (ev: MouseEvent) => void) {
    this.deleteEl.addEventListener('click', (ev: MouseEvent) => cb(ev));
  }

  /**
   * Add an event listener when the control change it position
   * @param cb Callback
   */
  public onPositionChange(cb: (ev: Event) => void) {
    this.positionEl.addEventListener('input', (ev: Event) => cb(ev));
  }

  /**
   * Add an event listener when the control change it color value
   * @param cb Callback
   */
  public onColorChange(cb: (ev: Event) => void) {
    this.valueEl.addEventListener('input', (ev: Event) => cb(ev));
  }

  /**
   * Assign the proportional position limits of this color control
   * @param minlimit lower limit of the position input
   * @param maxlimit upper limit of the position input
   */
  public setPositionLimits(minlimit: number, maxlimit: number) {
    this.positionEl.dataset.min = minlimit.toString();
    this.positionEl.dataset.max = maxlimit.toString();
  }
}
