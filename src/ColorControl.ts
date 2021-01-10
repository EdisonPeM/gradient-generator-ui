import { colorPos } from './Types';
import { getCorrectTextColor } from './ColorUtils';

const e = document.createElement.bind(document);

function createDeleteControl(): HTMLElement {
  const deleteEl = e('button');
  deleteEl.className = 'gg-control-delete';
  deleteEl.innerHTML = '&times;';
  return deleteEl;
}

function createPositionControl(defaultValue: string) {
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

function createValueControl(defaultValue: string) {
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

  // Events
  public onDelete(cb: Function) {
    this.deleteEl.addEventListener('click', (ev: MouseEvent) => cb(ev));
  }

  public onPositionChange(cb: Function) {
    this.positionEl.addEventListener('input', (ev: Event) => cb(ev));
  }

  public onColorChange(cb: Function) {
    this.valueEl.addEventListener('input', (ev: Event) => cb(ev));
  }

  // Add limits
  public setPositionLimits(minlimit: number, maxlimit: number) {
    this.positionEl.dataset.min = minlimit.toString();
    this.positionEl.dataset.max = maxlimit.toString();
  }
}
