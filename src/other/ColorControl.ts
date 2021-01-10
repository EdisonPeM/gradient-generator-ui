import { getCorrectTextColor } from '../ColorUtils';
import { colorPos } from '../Types';

class colorControl {
  private mainElement: HTMLElement;
  private deleteEl: HTMLElement;
  private positionEl: HTMLInputElement;
  private valueEl: HTMLInputElement;

  constructor(obj: colorPos) {
    this.mainElement = document.createElement('div');
    this.mainElement.className = 'gradient-color';

    // Create delete button
    this.deleteEl = document.createElement('button');
    this.deleteEl.className = 'color-delete';
    this.deleteEl.textContent = 'X';
    this.deleteEl.addEventListener('click', ev => {
      this.mainElement.remove();
    });

    // Create position range input
    this.positionEl = document.createElement('input');
    this.positionEl.className = 'color-position';
    this.positionEl.type = 'range';
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

    // Create value color input
    this.valueEl = document.createElement('input');
    this.valueEl.className = 'color-value';
    this.valueEl.type = 'color';
    this.valueEl.value = obj.colorHex;
    this.valueEl.addEventListener('input', () => {
      this.changeBg();
    });

    // Add sub elements to main Element
    this.mainElement.appendChild(this.deleteEl);
    this.mainElement.appendChild(this.positionEl);
    this.mainElement.appendChild(this.valueEl);

    // Update Element view
    this.changeBg();
    this.changePosition();
  }

  // Getters
  getElement() {
    return this.mainElement;
  }

  getColor() {
    return this.valueEl.value;
  }

  getPosition() {
    return +this.positionEl.value;
  }

  // Setters
  setDeleteClick(cb: Function) {
    this.deleteEl.onclick = (ev: MouseEvent) => cb(ev);
  }

  setPositionInput(cb: Function) {
    this.positionEl.oninput = (ev: Event) => cb(ev);
  }

  setValueInput(cb: Function) {
    this.valueEl.oninput = (ev: Event) => cb(ev);
  }

  setPositionLimits(minlimit: number, maxlimit: number) {
    this.positionEl.dataset.min = minlimit.toString();
    this.positionEl.dataset.max = maxlimit.toString();
  }

  // Inherit Actions
  changeBg() {
    let color = this.valueEl.value;
    this.deleteEl.style.setProperty('--gb-color', color);
    this.deleteEl.style.setProperty('--color', getCorrectTextColor(color));

    this.positionEl.style.setProperty('--gb-color', color);
    this.positionEl.style.setProperty('--color', getCorrectTextColor(color));
  }

  changePosition() {
    let pos = this.positionEl.valueAsNumber;
    let totalLenght = this.positionEl.clientWidth;
    let left = `${((totalLenght - 15) * pos) / 100 + 15 / 2}px`;

    this.deleteEl.style.left = left;
    this.valueEl.style.left = left;
  }
}

export default colorControl;
